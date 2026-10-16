const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const outDir = path.join('c:', 'Users', 'bahloul.a', 'Downloads', 'Ai studio', 'achrafbah.github.io-main', 'downloads', 'excel');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const COLORS = {
  navyDark: 'FF0F172A',
  emeraldDark: 'FF064E3B',
  emeraldMed: 'FF047857',
  emeraldLight: 'FFD1FAE5',
  slateHeader: 'FF1E293B',
  slateSub: 'FF334155',
  zebraEven: 'FFF8FAFC',
  zebraOdd: 'FFFFFFFF',
  kpiBg: 'FFF0FDF4',
  kpiBorder: 'FF10B981',
  white: 'FFFFFFFF',
  textDark: 'FF0F172A',
  textMuted: 'FF64748B',
  accentGold: 'FFFEF3C7',
  borderGray: 'FFCBD5E1',
  footerBg: 'FFE2E8F0'
};

const CURRENCY_FMT = '$#,##0.00;($#,##0.00);"-"';
const INT_FMT = '#,##0';
const PCT_FMT = '0.0%';

function applyBanner(ws, title, subtitle, colCount = 9, bgHex = COLORS.emeraldDark) {
  ws.mergeCells(1, 1, 1, colCount);
  ws.mergeCells(2, 1, 2, colCount);

  const r1 = ws.getRow(1);
  r1.height = 32;
  const c1 = ws.getCell(1, 1);
  c1.value = title;
  c1.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.white } };
  c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
  c1.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  const r2 = ws.getRow(2);
  r2.height = 20;
  const c2 = ws.getCell(2, 1);
  c2.value = subtitle;
  c2.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: COLORS.emeraldLight } };
  c2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgHex } };
  c2.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };

  ws.getRow(3).height = 10;
}

function applyKpiCards(ws, kpis) {
  const r4 = ws.getRow(4);
  const r5 = ws.getRow(5);
  r4.height = 18;
  r5.height = 28;

  kpis.forEach((kpi) => {
    const { colStart, colEnd, label, formula, value, numFmt } = kpi;
    if (colEnd > colStart) {
      ws.mergeCells(4, colStart, 4, colEnd);
      ws.mergeCells(5, colStart, 5, colEnd);
    }
    const lblCell = ws.getCell(4, colStart);
    lblCell.value = label.toUpperCase();
    lblCell.font = { name: 'Segoe UI', size: 8, bold: true, color: { argb: COLORS.emeraldDark } };
    lblCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    lblCell.alignment = { vertical: 'middle', horizontal: 'center' };

    const valCell = ws.getCell(5, colStart);
    if (formula) {
      valCell.value = { formula };
    } else {
      valCell.value = value;
    }
    if (numFmt) valCell.numFmt = numFmt;
    valCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: COLORS.navyDark } };
    valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    valCell.alignment = { vertical: 'middle', horizontal: 'center' };

    for (let c = colStart; c <= colEnd; c++) {
      ws.getCell(4, c).border = {
        top: { style: 'medium', color: { argb: COLORS.kpiBorder } },
        left: c === colStart ? { style: 'thin', color: { argb: COLORS.kpiBorder } } : undefined,
        right: c === colEnd ? { style: 'thin', color: { argb: COLORS.kpiBorder } } : undefined
      };
      ws.getCell(5, c).border = {
        bottom: { style: 'medium', color: { argb: COLORS.kpiBorder } },
        left: c === colStart ? { style: 'thin', color: { argb: COLORS.kpiBorder } } : undefined,
        right: c === colEnd ? { style: 'thin', color: { argb: COLORS.kpiBorder } } : undefined
      };
    }
  });
  ws.getRow(6).height = 12;
}

function styleTableHeader(ws, rowNum, headers) {
  const row = ws.getRow(rowNum);
  row.height = 26;
  headers.forEach((h, idx) => {
    const cell = row.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.slateHeader } };
    cell.alignment = { vertical: 'middle', horizontal: idx === 0 ? 'left' : 'center', wrapText: true };
    cell.border = {
      top: { style: 'medium', color: { argb: COLORS.navyDark } },
      bottom: { style: 'medium', color: { argb: COLORS.emeraldMed } },
      left: { style: 'thin', color: { argb: COLORS.slateSub } },
      right: { style: 'thin', color: { argb: COLORS.slateSub } }
    };
  });
}

function styleDataRow(ws, rowNum, colCount, isEven, numFmts = [], alignments = []) {
  const row = ws.getRow(rowNum);
  row.height = 21;
  const bg = isEven ? COLORS.zebraEven : COLORS.zebraOdd;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
    cell.alignment = {
      vertical: 'middle',
      horizontal: alignments[c - 1] || (c === 1 ? 'left' : 'right')
    };
    if (numFmts[c - 1]) cell.numFmt = numFmts[c - 1];
    cell.border = {
      top: { style: 'thin', color: { argb: COLORS.borderGray } },
      bottom: { style: 'thin', color: { argb: COLORS.borderGray } },
      left: { style: 'thin', color: { argb: COLORS.borderGray } },
      right: { style: 'thin', color: { argb: COLORS.borderGray } }
    };
  }
}

function styleFooterRow(ws, rowNum, colCount, numFmts = []) {
  const row = ws.getRow(rowNum);
  row.height = 24;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navyDark } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.footerBg } };
    cell.alignment = { vertical: 'middle', horizontal: c === 1 ? 'left' : 'right' };
    if (numFmts[c - 1]) cell.numFmt = numFmts[c - 1];
    cell.border = {
      top: { style: 'double', color: { argb: COLORS.navyDark } },
      bottom: { style: 'medium', color: { argb: COLORS.navyDark } },
      left: { style: 'thin', color: { argb: COLORS.borderGray } },
      right: { style: 'thin', color: { argb: COLORS.borderGray } }
    };
  }
}

// ============================================================================
// 1. SaaS-Financial-Model.xlsx
// ============================================================================
async function buildSaaSModel() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Corporate Finance Excel Specialist';
  const ws = wb.addWorksheet('12M SaaS Forecast', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'SAAS FINANCIAL MODEL — MRR, ARR, CHURN, CAC, LTV & 12-MONTH BURN FORECAST',
    'Executive Operating Model | Subscription Growth, Unit Economics & Runway Projections',
    11,
    COLORS.emeraldDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Ending ARR (Month 12)', formula: 'G19*12', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: '12-Mo Total Net New MRR', formula: 'SUM(D8:D19)+SUM(E8:E19)-SUM(F8:F19)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: 'Avg Monthly Gross Margin', formula: 'AVERAGE(I8:I19)', numFmt: PCT_FMT },
    { colStart: 7, colEnd: 8, label: 'Blended LTV / CAC Ratio', formula: '(AVERAGE(G8:G19)/AVERAGE(B8:B19)/0.028)/AVERAGE(J8:J19)', numFmt: '0.0"x"' },
    { colStart: 9, colEnd: 11, label: '12-Mo Cumulative Net Profit / Burn', formula: 'SUM(K8:K19)', numFmt: CURRENCY_FMT }
  ]);

  const headers = [
    'Forecast Month',
    'Active Customers',
    'Beginning MRR',
    'New Logo MRR',
    'Expansion MRR',
    'Churned MRR',
    'Ending MRR',
    'MoM MRR Growth %',
    'Gross Margin %',
    'Blended CAC ($)',
    'Operating Cash Flow / Burn'
  ];
  styleTableHeader(ws, 7, headers);

  const months = [
    ['Jan 2026', 140, 42000, 6800, 2100, 1250, 0.81, 410, 41500],
    ['Feb 2026', 156, 49650, 7400, 2450, 1390, 0.815, 405, 43200],
    ['Mar 2026', 174, 58110, 8200, 2900, 1510, 0.82, 398, 45800],
    ['Apr 2026', 195, 67700, 9100, 3400, 1690, 0.825, 392, 48500],
    ['May 2026', 219, 78510, 10200, 3950, 1880, 0.83, 385, 51200],
    ['Jun 2026', 246, 90780, 11400, 4500, 2080, 0.835, 380, 54900],
    ['Jul 2026', 276, 104600, 12600, 5200, 2300, 0.84, 376, 58400],
    ['Aug 2026', 310, 120100, 13900, 5950, 2520, 0.842, 372, 62100],
    ['Sep 2026', 348, 137430, 15400, 6800, 2750, 0.845, 368, 66800],
    ['Oct 2026', 390, 156880, 17100, 7700, 2980, 0.848, 365, 71500],
    ['Nov 2026', 437, 178700, 18900, 8750, 3220, 0.85, 360, 76900],
    ['Dec 2026', 489, 203130, 20800, 9900, 3450, 0.855, 355, 82400],
    ['Jan 2027 (Proj)', 545, 230380, 22900, 11200, 3690, 0.858, 352, 88200],
    ['Feb 2027 (Proj)', 608, 260790, 25100, 12600, 3910, 0.86, 348, 94500]
  ];

  const fmts = [null, INT_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, PCT_FMT, PCT_FMT, CURRENCY_FMT, CURRENCY_FMT];
  const aligns = ['left', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right'];

  months.forEach((m, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = m[0];
    row.getCell(2).value = m[1];
    row.getCell(3).value = i === 0 ? m[2] : { formula: `G${r - 1}` };
    row.getCell(4).value = m[3];
    row.getCell(5).value = m[4];
    row.getCell(6).value = m[5];
    row.getCell(7).value = { formula: `C${r}+D${r}+E${r}-F${r}` };
    row.getCell(8).value = { formula: `IF(C${r}>0,(G${r}-C${r})/C${r},0)` };
    row.getCell(9).value = m[6];
    row.getCell(10).value = m[7];
    row.getCell(11).value = { formula: `(G${r}*I${r})-${m[8]}` };
    styleDataRow(ws, r, 11, i % 2 === 1, fmts, aligns);
  });

  const footRow = 8 + months.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'TOTAL / AVERAGE SUMMARY';
  fr.getCell(2).value = { formula: `AVERAGE(B8:B${footRow - 1})` };
  fr.getCell(3).value = { formula: `C8` };
  fr.getCell(4).value = { formula: `SUM(D8:D${footRow - 1})` };
  fr.getCell(5).value = { formula: `SUM(E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `G${footRow - 1}` };
  fr.getCell(8).value = { formula: `AVERAGE(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `AVERAGE(I8:I${footRow - 1})` };
  fr.getCell(10).value = { formula: `AVERAGE(J8:J${footRow - 1})` };
  fr.getCell(11).value = { formula: `SUM(K8:K${footRow - 1})` };
  styleFooterRow(ws, footRow, 11, fmts);

  ws.columns = [
    { width: 18 }, { width: 17 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 15 }, { width: 17 }, { width: 17 }, { width: 16 }, { width: 16 }, { width: 24 }
  ];

  // Sheet 2: Unit Economics & Cohort Benchmark
  const ws2 = wb.addWorksheet('Unit Economics & Tiers');
  applyBanner(ws2, 'SAAS PRICING TIERS & UNIT ECONOMICS BENCHMARKS', 'Plan Breakdown, ARPA, Logo Churn & LTV Multiples', 7, COLORS.navyDark);
  styleTableHeader(ws2, 4, ['Subscription Tier', 'Monthly Price ($)', 'Active Seats', 'Monthly MRR ($)', 'Annualized ARR ($)', 'Monthly Churn %', 'Estimated LTV ($)']);
  const tiers = [
    ['Starter Self-Serve', 49, 210, 0.035],
    ['Growth Team Plan', 149, 185, 0.024],
    ['Professional Suite', 349, 130, 0.016],
    ['Enterprise Standard', 999, 64, 0.009],
    ['Enterprise Custom Plus', 2450, 19, 0.005]
  ];
  const tierFmts = [null, CURRENCY_FMT, INT_FMT, CURRENCY_FMT, CURRENCY_FMT, PCT_FMT, CURRENCY_FMT];
  tiers.forEach((t, idx) => {
    const r = 5 + idx;
    const row = ws2.getRow(r);
    row.getCell(1).value = t[0];
    row.getCell(2).value = t[1];
    row.getCell(3).value = t[2];
    row.getCell(4).value = { formula: `B${r}*C${r}` };
    row.getCell(5).value = { formula: `D${r}*12` };
    row.getCell(6).value = t[3];
    row.getCell(7).value = { formula: `IF(F${r}>0,(B${r}*0.84)/F${r},0)` };
    styleDataRow(ws2, r, 7, idx % 2 === 1, tierFmts);
  });
  const tf = 5 + tiers.length;
  ws2.getRow(tf).getCell(1).value = 'TOTAL / WEIGHTED AVG';
  ws2.getRow(tf).getCell(2).value = { formula: `AVERAGE(B5:B${tf - 1})` };
  ws2.getRow(tf).getCell(3).value = { formula: `SUM(C5:C${tf - 1})` };
  ws2.getRow(tf).getCell(4).value = { formula: `SUM(D5:D${tf - 1})` };
  ws2.getRow(tf).getCell(5).value = { formula: `SUM(E5:E${tf - 1})` };
  ws2.getRow(tf).getCell(6).value = { formula: `AVERAGE(F5:F${tf - 1})` };
  ws2.getRow(tf).getCell(7).value = { formula: `AVERAGE(G5:G${tf - 1})` };
  styleFooterRow(ws2, tf, 7, tierFmts);
  ws2.columns = [{ width: 24 }, { width: 18 }, { width: 16 }, { width: 18 }, { width: 20 }, { width: 18 }, { width: 20 }];

  await wb.xlsx.writeFile(path.join(outDir, 'SaaS-Financial-Model.xlsx'));
}

// ============================================================================
// 2. Real-Estate-ROI-Analyzer.xlsx
// ============================================================================
async function buildRealEstateModel() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Portfolio ROI Analyzer', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'REAL ESTATE INVESTMENT ROI ANALYZER — CASH FLOW, CAP RATE & MORTGAGE PMT',
    'Multi-Property Rental Deal Underwriting | Debt Service, NOI, Cap Rate & Cash-on-Cash Return',
    11,
    COLORS.navyDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Total Portfolio Value', formula: 'SUM(B8:B20)', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: 'Total Equity Down Payment', formula: 'SUM(C8:C20)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: 'Annual Portfolio NOI', formula: 'SUM(H8:H20)*12', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 8, label: 'Portfolio Avg Cap Rate', formula: 'AVERAGE(J8:J20)', numFmt: PCT_FMT },
    { colStart: 9, colEnd: 11, label: 'Avg Cash-on-Cash ROI %', formula: 'AVERAGE(K8:K20)', numFmt: PCT_FMT }
  ]);

  const headers = [
    'Property Address / Asset',
    'Purchase Price ($)',
    'Down Payment (25%)',
    'Loan Amount ($)',
    'Interest Rate %',
    'Gross Monthly Rent',
    'Operating Expenses',
    'Monthly NOI ($)',
    'Monthly Mortgage PMT',
    'Cap Rate %',
    'Cash-on-Cash ROI %'
  ];
  styleTableHeader(ws, 7, headers);

  const props = [
    ['104 Oakridge Duplex, Austin TX', 485000, 0.065, 4600, 1380],
    ['229 Maple Court Triplex, Raleigh NC', 620000, 0.0675, 5950, 1790],
    ['88 Pinecrest Fourplex, Tampa FL', 790000, 0.0685, 7800, 2340],
    ['412 Cedar Townhome, Nashville TN', 365000, 0.064, 3250, 960],
    ['19 Summit Garden Apts, Phoenix AZ', 940000, 0.07, 9100, 2850],
    ['705 Harbor View Condo, Miami FL', 410000, 0.066, 3850, 1280],
    ['318 Highland SFR, Charlotte NC', 330000, 0.0625, 2950, 840],
    ['550 Riverfront Lofts, Columbus OH', 540000, 0.0665, 5200, 1560],
    ['622 Meadowbrook Duplex, Dallas TX', 460000, 0.065, 4450, 1310],
    ['910 Bayside Villas, Jacksonville FL', 675000, 0.068, 6500, 1980],
    ['144 Westside Brownstone, Atlanta GA', 515000, 0.0655, 4900, 1470],
    ['280 Sunbelt Courtyard, Las Vegas NV', 595000, 0.067, 5650, 1690],
    ['830 Parkside Multi-Family, Denver CO', 860000, 0.069, 8250, 2490]
  ];

  const fmts = [null, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, PCT_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, PCT_FMT, PCT_FMT];

  props.forEach((p, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = p[0];
    row.getCell(2).value = p[1];
    row.getCell(3).value = { formula: `B${r}*0.25` };
    row.getCell(4).value = { formula: `B${r}-C${r}` };
    row.getCell(5).value = p[2];
    row.getCell(6).value = p[3];
    row.getCell(7).value = p[4];
    row.getCell(8).value = { formula: `F${r}-G${r}` };
    row.getCell(9).value = { formula: `-PMT(E${r}/12,360,D${r})` };
    row.getCell(10).value = { formula: `IF(B${r}>0,(H${r}*12)/B${r},0)` };
    row.getCell(11).value = { formula: `IF(C${r}>0,((H${r}-I${r})*12)/(C${r}+8500),0)` };
    styleDataRow(ws, r, 11, i % 2 === 1, fmts);
  });

  const footRow = 8 + props.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'PORTFOLIO TOTAL / AVERAGE';
  fr.getCell(2).value = { formula: `SUM(B8:B${footRow - 1})` };
  fr.getCell(3).value = { formula: `SUM(C8:C${footRow - 1})` };
  fr.getCell(4).value = { formula: `SUM(D8:D${footRow - 1})` };
  fr.getCell(5).value = { formula: `AVERAGE(E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${footRow - 1})` };
  fr.getCell(8).value = { formula: `SUM(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `SUM(I8:I${footRow - 1})` };
  fr.getCell(10).value = { formula: `AVERAGE(J8:J${footRow - 1})` };
  fr.getCell(11).value = { formula: `AVERAGE(K8:K${footRow - 1})` };
  styleFooterRow(ws, footRow, 11, fmts);

  ws.columns = [
    { width: 32 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 14 },
    { width: 18 }, { width: 18 }, { width: 17 }, { width: 20 }, { width: 14 }, { width: 18 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Real-Estate-ROI-Analyzer.xlsx'));
}

// ============================================================================
// 3. Net-Worth-Portfolio-Tracker.xlsx
// ============================================================================
async function buildNetWorthTracker() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Net Worth & FIRE Tracker', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'PERSONAL NET WORTH & WEALTH PORTFOLIO — LIQUID/ILLIQUID ASSETS, LIABILITIES & FIRE TARGET',
    'Comprehensive Balance Sheet | Asset Allocation, Debt Paydown & 4% Safe Withdrawal Rule Calculator',
    9,
    COLORS.emeraldDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Total Gross Assets', formula: 'SUMIF(C8:C23,"Asset",F8:F23)', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: 'Total Liabilities / Debt', formula: 'SUMIF(C8:C23,"Liability",F8:F23)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: 'Total Net Worth', formula: 'SUMIF(C8:C23,"Asset",F8:F23)-SUMIF(C8:C23,"Liability",F8:F23)', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 7, label: 'Liquid Net Worth', formula: 'SUMIF(D8:D23,"Liquid",F8:F23)', numFmt: CURRENCY_FMT },
    { colStart: 8, colEnd: 9, label: 'FIRE Target Progress ($2.5M)', formula: '(SUMIF(C8:C23,"Asset",F8:F23)-SUMIF(C8:C23,"Liability",F8:F23))/2500000', numFmt: PCT_FMT }
  ]);

  const headers = [
    'Account / Holding Name',
    'Institution / Custodian',
    'Balance Sheet Class',
    'Liquidity Status',
    'Cost Basis / Principal',
    'Current Market Value',
    'Unrealized Gain / (Loss)',
    'Expected Annual Yield %',
    'Est. Annual Passive Income'
  ];
  styleTableHeader(ws, 7, headers);

  const items = [
    ['High-Yield Treasury Money Market', 'Vanguard Cash Plus', 'Asset', 'Liquid', 65000, 68400, 0.048],
    ['S&P 500 Index ETF (VOO)', 'Fidelity Brokerage', 'Asset', 'Liquid', 210000, 342500, 0.085],
    ['Total World Stock Index (VT)', 'Vanguard', 'Asset', 'Liquid', 95000, 138900, 0.078],
    ['401(k) Retirement Target Trust', 'Empower Retirement', 'Asset', 'Illiquid', 280000, 465000, 0.082],
    ['Roth IRA Growth Portfolio', 'Charles Schwab', 'Asset', 'Liquid', 78000, 144200, 0.09],
    ['Health Savings Account (HSA Invested)', 'Lively / Schwab', 'Asset', 'Liquid', 24000, 36800, 0.075],
    ['Primary Residence (Single Family)', 'County Assessor Est.', 'Asset', 'Illiquid', 520000, 695000, 0.04],
    ['Rental Investment Condo #2B', 'LLC Holding', 'Asset', 'Illiquid', 290000, 375000, 0.065],
    ['Private Equity / Angel Syndicate', 'Carta Custodial', 'Asset', 'Illiquid', 50000, 82000, 0.11],
    ['Series I & US Treasury Bonds', 'TreasuryDirect', 'Asset', 'Liquid', 40000, 43600, 0.045],
    ['Crypto Cold Storage (BTC / ETH)', 'Ledger Vault', 'Asset', 'Liquid', 18000, 54200, 0.02],
    ['Emergency Checking Operating Cash', 'Chase Private Client', 'Asset', 'Liquid', 28000, 28000, 0.01],
    ['Primary Residence 30-Yr Mortgage', 'Wells Fargo Home', 'Liability', 'Liability', 416000, 348500, 0.0325],
    ['Rental Property Investment Loan', 'First Republic Bank', 'Liability', 'Liability', 217500, 189400, 0.055],
    ['Executive Auto Financing Note', 'BMW Financial', 'Liability', 'Liability', 42000, 18200, 0.039],
    ['Rewards Credit Card Statement (Paid Monthly)', 'American Express', 'Liability', 'Liability', 4800, 4800, 0.0]
  ];

  const fmts = [null, null, null, null, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, PCT_FMT, CURRENCY_FMT];
  const aligns = ['left', 'left', 'center', 'center', 'right', 'right', 'right', 'right', 'right'];

  items.forEach((it, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = it[0];
    row.getCell(2).value = it[1];
    row.getCell(3).value = it[2];
    row.getCell(4).value = it[3];
    row.getCell(5).value = it[4];
    row.getCell(6).value = it[5];
    row.getCell(7).value = { formula: `IF(C${r}="Asset",F${r}-E${r},E${r}-F${r})` };
    row.getCell(8).value = it[6];
    row.getCell(9).value = { formula: `IF(C${r}="Asset",F${r}*H${r},-(F${r}*H${r}))` };
    styleDataRow(ws, r, 9, i % 2 === 1, fmts, aligns);
  });

  const footRow = 8 + items.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'NET WORTH & PASSIVE INCOME SUMMARY';
  fr.getCell(2).value = 'All Accounts';
  fr.getCell(3).value = 'Net Balance';
  fr.getCell(4).value = '4% Rule Ready';
  fr.getCell(5).value = { formula: `SUMIF(C8:C${footRow - 1},"Asset",E8:E${footRow - 1})-SUMIF(C8:C${footRow - 1},"Liability",E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUMIF(C8:C${footRow - 1},"Asset",F8:F${footRow - 1})-SUMIF(C8:C${footRow - 1},"Liability",F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${footRow - 1})` };
  fr.getCell(8).value = { formula: `AVERAGE(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `SUM(I8:I${footRow - 1})` };
  styleFooterRow(ws, footRow, 9, fmts);

  ws.columns = [
    { width: 34 }, { width: 22 }, { width: 18 }, { width: 16 }, { width: 20 },
    { width: 20 }, { width: 22 }, { width: 20 }, { width: 24 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Net-Worth-Portfolio-Tracker.xlsx'));
}

// ============================================================================
// 4. Cash-Flow-Forecaster.xlsx
// ============================================================================
async function buildCashFlowForecaster() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('12M Cash Flow Runway', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    '12-MONTH BUSINESS CASH FLOW FORECASTER — INFLOWS, OUTFLOWS, NET BURN & RUNWAY',
    'Corporate Treasury & Liquidity Model | Working Capital, Payroll, OpEx & Minimum Cash Alert',
    10,
    COLORS.navyDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Starting Cash Balance', formula: 'B8', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: '12-Mo Total Cash Inflows', formula: 'SUM(E8:E19)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: '12-Mo Total Cash Outflows', formula: 'SUM(H8:H19)', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 8, label: 'Lowest Projected Cash Balance', formula: 'MIN(J8:J19)', numFmt: CURRENCY_FMT },
    { colStart: 9, colEnd: 10, label: 'Ending Cash Balance (Month 12)', formula: 'J19', numFmt: CURRENCY_FMT }
  ]);

  const headers = [
    'Month / Period',
    'Beginning Cash ($)',
    'Customer Collections',
    'Other / Financing Inflows',
    'Total Cash Inflows ($)',
    'Payroll & Benefits',
    'Operating & Vendor OpEx',
    'Total Cash Outflows ($)',
    'Net Monthly Cash Flow',
    'Ending Cash Balance ($)'
  ];
  styleTableHeader(ws, 7, headers);

  const periods = [
    ['Month 1 — Jan 2026', 450000, 128000, 0, 98000, 46500],
    ['Month 2 — Feb 2026', 0, 134500, 0, 98000, 48200],
    ['Month 3 — Mar 2026', 0, 142000, 15000, 104000, 49800],
    ['Month 4 — Apr 2026', 0, 151000, 0, 104000, 52400],
    ['Month 5 — May 2026', 0, 159500, 0, 112000, 53900],
    ['Month 6 — Jun 2026', 0, 168000, 250000, 112000, 58100],
    ['Month 7 — Jul 2026', 0, 179000, 0, 118500, 56200],
    ['Month 8 — Aug 2026', 0, 191500, 0, 118500, 59400],
    ['Month 9 — Sep 2026', 0, 204000, 0, 125000, 61800],
    ['Month 10 — Oct 2026', 0, 218000, 0, 125000, 64500],
    ['Month 11 — Nov 2026', 0, 233500, 10000, 131000, 67200],
    ['Month 12 — Dec 2026', 0, 252000, 0, 131000, 71000]
  ];

  const fmts = [null, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT];

  periods.forEach((p, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = p[0];
    row.getCell(2).value = i === 0 ? p[1] : { formula: `J${r - 1}` };
    row.getCell(3).value = p[2];
    row.getCell(4).value = p[3];
    row.getCell(5).value = { formula: `C${r}+D${r}` };
    row.getCell(6).value = p[4];
    row.getCell(7).value = p[5];
    row.getCell(8).value = { formula: `F${r}+G${r}` };
    row.getCell(9).value = { formula: `E${r}-H${r}` };
    row.getCell(10).value = { formula: `B${r}+I${r}` };
    styleDataRow(ws, r, 10, i % 2 === 1, fmts);
  });

  const footRow = 8 + periods.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = '12-MONTH TOTAL / SUMMARY';
  fr.getCell(2).value = { formula: `B8` };
  fr.getCell(3).value = { formula: `SUM(C8:C${footRow - 1})` };
  fr.getCell(4).value = { formula: `SUM(D8:D${footRow - 1})` };
  fr.getCell(5).value = { formula: `SUM(E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${footRow - 1})` };
  fr.getCell(8).value = { formula: `SUM(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `SUM(I8:I${footRow - 1})` };
  fr.getCell(10).value = { formula: `J${footRow - 1}` };
  styleFooterRow(ws, footRow, 10, fmts);

  ws.columns = [
    { width: 24 }, { width: 19 }, { width: 20 }, { width: 22 }, { width: 20 },
    { width: 19 }, { width: 21 }, { width: 20 }, { width: 20 }, { width: 22 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Cash-Flow-Forecaster.xlsx'));
}

// ============================================================================
// 5. Freelance-Tax-Calculator.xlsx
// ============================================================================
async function buildFreelanceTaxCalculator() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Tax & Expense Ledger', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'FREELANCE & SELF-EMPLOYED QUARTERLY TAX ESTIMATOR — DEDUCTIONS & NET TAKE-HOME',
    'Schedule C Business Income & Expense Tracker | SE Tax (15.3%), Income Tax Reserve & Net Profit',
    9,
    COLORS.emeraldDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Gross 1099 / Client Revenue', formula: 'SUM(D8:D21)', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: 'Total IRS Tax Deductions', formula: 'SUM(E8:E21)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: 'Net Taxable Business Profit', formula: 'SUM(F8:F21)', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 7, label: 'Est. Annual Tax Reserve', formula: 'SUM(H8:H21)', numFmt: CURRENCY_FMT },
    { colStart: 8, colEnd: 9, label: 'Net Take-Home Cash After Tax', formula: 'SUM(I8:I21)', numFmt: CURRENCY_FMT }
  ]);

  const headers = [
    'Tax Period / Entry',
    'Primary Client / Source',
    'IRS Expense Category',
    'Gross Revenue ($)',
    'Deductible Expense ($)',
    'Net Taxable Profit ($)',
    'SE Tax Reserve (15.3%)',
    'Total Tax Reserve (28%)',
    'Net Take-Home Pay ($)'
  ];
  styleTableHeader(ws, 7, headers);

  const rows = [
    ['Q1 — Jan Retainer', 'Apex FinTech Corp', 'Software & SaaS Subscriptions', 16500, 1420],
    ['Q1 — Feb Milestone', 'NorthStar Health Systems', 'Home Office & Fiber Internet', 18200, 1180],
    ['Q1 — Mar Advisory', 'Vanguard Retail Group', 'Professional Legal & CPA Fees', 19400, 2150],
    ['Q2 — Apr Sprint', 'Apex FinTech Corp', 'Hardware & MacBook Pro Depr.', 17800, 3400],
    ['Q2 — May Launch', 'CloudScale AI Inc.', 'Advertising & Paid Portfolio', 21500, 1650],
    ['Q2 — Jun Retainer', 'Horizon Logistics LLC', 'Business Travel & Airfare', 16900, 2380],
    ['Q3 — Jul Audit', 'CloudScale AI Inc.', 'Health Insurance Premium (100%)', 22400, 1890],
    ['Q3 — Aug Architecture', 'BlueWave Media Partners', 'Subcontractor & Design Help', 24000, 4200],
    ['Q3 — Sep Retainer', 'Apex FinTech Corp', 'Coworking & Studio Lease', 18500, 1350],
    ['Q4 — Oct Enterprise', 'Summit BioLabs Inc.', 'Continuing Education & Conf.', 25800, 1920],
    ['Q4 — Nov Optimization', 'CloudScale AI Inc.', 'Software & Cloud Hosting AWS', 23100, 1540],
    ['Q4 — Dec Year-End', 'Summit BioLabs Inc.', 'Solo 401(k) Employer Match', 27500, 6500],
    ['Bonus — Product Licensing', 'Gumroad / Digital Assets', 'Merchant Processing Fees', 8400, 620],
    ['Bonus — Workshop Keynote', 'Global Tech Summit', 'Meals (50% Deductible Cap)', 6500, 480]
  ];

  const fmts = [null, null, null, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT];
  const aligns = ['left', 'left', 'left', 'right', 'right', 'right', 'right', 'right', 'right'];

  rows.forEach((item, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = item[0];
    row.getCell(2).value = item[1];
    row.getCell(3).value = item[2];
    row.getCell(4).value = item[3];
    row.getCell(5).value = item[4];
    row.getCell(6).value = { formula: `D${r}-E${r}` };
    row.getCell(7).value = { formula: `IF(F${r}>0,F${r}*0.9235*0.153,0)` };
    row.getCell(8).value = { formula: `IF(F${r}>0,F${r}*0.28,0)` };
    row.getCell(9).value = { formula: `F${r}-H${r}` };
    styleDataRow(ws, r, 9, i % 2 === 1, fmts, aligns);
  });

  const footRow = 8 + rows.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'ANNUAL TAX & INCOME TOTALS';
  fr.getCell(2).value = '14 Revenue Streams';
  fr.getCell(3).value = 'Schedule C Totals';
  fr.getCell(4).value = { formula: `SUM(D8:D${footRow - 1})` };
  fr.getCell(5).value = { formula: `SUM(E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${footRow - 1})` };
  fr.getCell(8).value = { formula: `SUM(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `SUM(I8:I${footRow - 1})` };
  styleFooterRow(ws, footRow, 9, fmts);

  ws.columns = [
    { width: 24 }, { width: 24 }, { width: 28 }, { width: 18 }, { width: 20 },
    { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Freelance-Tax-Calculator.xlsx'));
}

// ============================================================================
// 6. Startup-Cap-Table.xlsx
// ============================================================================
async function buildStartupCapTable() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Cap Table & Dilution', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'STARTUP CAP TABLE & DILUTION SIMULATOR — FOUNDER EQUITY, SEED, SERIES A & OPTION POOL',
    'Venture Capital Ownership Ledger | Pre/Post-Money Valuation, Fully Diluted Shares & Exit Payouts',
    10,
    COLORS.navyDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Post-Money Valuation ($)', formula: 'SUM(I8:I20)', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: 'Total Fully Diluted Shares', formula: 'SUM(G8:G20)', numFmt: INT_FMT },
    { colStart: 5, colEnd: 6, label: 'Implied Series A Share Price', formula: 'SUM(I8:I20)/SUM(G8:G20)', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 8, label: 'Founder Combined Ownership %', formula: 'SUMIF(B8:B20,"Founder",H8:H20)', numFmt: PCT_FMT },
    { colStart: 9, colEnd: 10, label: 'Total Venture Capital Raised', formula: 'SUM(C8:C20)', numFmt: CURRENCY_FMT }
  ]);

  const headers = [
    'Shareholder / Entity Name',
    'Stakeholder Class',
    'Capital Invested ($)',
    'Founding / Seed Shares',
    'Series A New Shares',
    'Option Pool Grants',
    'Total Fully Diluted Shares',
    'Fully Diluted Ownership %',
    'Post-Money Implied Value ($)',
    '$100M Exit Payout ($)'
  ];
  styleTableHeader(ws, 7, headers);

  const holders = [
    ['Alex Rivera (CEO & Co-Founder)', 'Founder', 25000, 3850000, 0, 0],
    ['Samantha Chen (CTO & Co-Founder)', 'Founder', 25000, 3450000, 0, 0],
    ['Marcus Vance (COO & Co-Founder)', 'Founder', 15000, 1700000, 0, 0],
    ['Y Combinator / Accelerator', 'Seed Investor', 500000, 850000, 0, 0],
    ['First Round Seed Fund LP', 'Seed Investor', 1500000, 1650000, 220000, 0],
    ['Apex Angel Syndicate', 'Angel Investor', 450000, 520000, 0, 0],
    ['Sequoia / Tier-1 Lead VC (Series A)', 'Series A Preferred', 7500000, 0, 3125000, 0],
    ['Benchmark Co-Invest Partners', 'Series A Preferred', 2500000, 0, 1041667, 0],
    ['Strategic Cloud Ventures', 'Series A Preferred', 1200000, 0, 500000, 0],
    ['VP of Engineering (Early Hire #1)', 'Employee ESOP', 0, 0, 0, 320000],
    ['VP of Sales & GTM (Early Hire #2)', 'Employee ESOP', 0, 0, 0, 260000],
    ['Advisory Board Equity Pool', 'Advisor Shares', 0, 120000, 0, 95000],
    ['Unallocated Employee Option Pool', 'Option Pool Reserve', 0, 0, 0, 1325000]
  ];

  const fmts = [null, null, CURRENCY_FMT, INT_FMT, INT_FMT, INT_FMT, INT_FMT, PCT_FMT, CURRENCY_FMT, CURRENCY_FMT];
  const aligns = ['left', 'center', 'right', 'right', 'right', 'right', 'right', 'right', 'right', 'right'];

  const lastRow = 7 + holders.length;
  const footRow = lastRow + 1;

  holders.forEach((h, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = h[0];
    row.getCell(2).value = h[1];
    row.getCell(3).value = h[2];
    row.getCell(4).value = h[3];
    row.getCell(5).value = h[4];
    row.getCell(6).value = h[5];
    row.getCell(7).value = { formula: `SUM(D${r}:F${r})` };
    row.getCell(8).value = { formula: `IF($G$${footRow}>0,G${r}/$G$${footRow},0)` };
    row.getCell(9).value = { formula: `G${r}*2.40` };
    row.getCell(10).value = { formula: `H${r}*100000000` };
    styleDataRow(ws, r, 10, i % 2 === 1, fmts, aligns);
  });

  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'TOTAL FULLY DILUTED CAP TABLE';
  fr.getCell(2).value = '100.0% Allocated';
  fr.getCell(3).value = { formula: `SUM(C8:C${lastRow})` };
  fr.getCell(4).value = { formula: `SUM(D8:D${lastRow})` };
  fr.getCell(5).value = { formula: `SUM(E8:E${lastRow})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${lastRow})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${lastRow})` };
  fr.getCell(8).value = { formula: `SUM(H8:H${lastRow})` };
  fr.getCell(9).value = { formula: `SUM(I8:I${lastRow})` };
  fr.getCell(10).value = { formula: `SUM(J8:J${lastRow})` };
  styleFooterRow(ws, footRow, 10, fmts);

  ws.columns = [
    { width: 34 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 19 },
    { width: 18 }, { width: 22 }, { width: 22 }, { width: 24 }, { width: 22 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Startup-Cap-Table.xlsx'));
}

// ============================================================================
// 7. Event-Master-Budget.xlsx
// ============================================================================
async function buildEventMasterBudget() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Event Master Budget', { views: [{ state: 'frozen', ySplit: 7 }] });

  applyBanner(
    ws,
    'WEDDING & CORPORATE EVENT MASTER BUDGET — ESTIMATED VS ACTUAL, DEPOSITS & BALANCE DUE',
    'Executive Event Production Tracker | Vendor Contracts, Variance Analysis & Payment Milestones',
    9,
    COLORS.emeraldDark
  );

  applyKpiCards(ws, [
    { colStart: 1, colEnd: 2, label: 'Total Estimated Budget', formula: 'SUM(D8:D22)', numFmt: CURRENCY_FMT },
    { colStart: 3, colEnd: 4, label: 'Total Actual Contracted', formula: 'SUM(E8:E22)', numFmt: CURRENCY_FMT },
    { colStart: 5, colEnd: 6, label: 'Total Budget Variance ($)', formula: 'SUM(F8:F22)', numFmt: CURRENCY_FMT },
    { colStart: 7, colEnd: 7, label: 'Total Deposits Paid', formula: 'SUM(G8:G22)', numFmt: CURRENCY_FMT },
    { colStart: 8, colEnd: 9, label: 'Remaining Balance Due', formula: 'SUM(H8:H22)', numFmt: CURRENCY_FMT }
  ]);

  const headers = [
    'Event Expense Line Item',
    'Category',
    'Contracted Vendor',
    'Estimated Budget ($)',
    'Actual Cost ($)',
    'Variance (Under / Over)',
    'Deposit Paid ($)',
    'Balance Due ($)',
    'Budget Status'
  ];
  styleTableHeader(ws, 7, headers);

  const expenses = [
    ['Grand Ballroom & Terrace Rental', 'Venue', 'The Ritz-Carlton Plaza', 18500, 18000, 9000],
    ['3-Course Plated Dinner & Hors d\'Oeuvres', 'Catering', 'Epicurean Culinary Group', 24000, 25400, 12700],
    ['Top-Shelf Open Bar & Sommelier Service', 'Beverage', 'Vintage Pour Events', 6800, 6450, 3200],
    ['4K Cinema Video & Documentary Photo', 'Media', 'Lumiere Visual Studios', 7500, 7500, 3750],
    ['Stage Lighting, LED Wall & Sound', 'AV & Production', 'Apex Stageworks Inc.', 9200, 8850, 4500],
    ['Centerpieces, Arch & Floral Installations', 'Decor & Floral', 'Botanica Luxe Design', 6500, 7100, 3550],
    ['Live Jazz Quartet & Reception DJ', 'Entertainment', 'Encore Talent Agency', 4800, 4600, 2300],
    ['Lead Event Planner & Day-Of Staff', 'Coordination', 'Bespoke Affairs Co.', 5500, 5500, 5500],
    ['Foil-Stamped Invitations & Signage', 'Print & Branding', 'Atelier Press Studio', 2200, 1980, 1980],
    ['VIP Executive Coach & Valet Fleet', 'Logistics', 'Premier Chauffeur Limo', 3400, 3650, 1800],
    ['Artisan Tiered Cake & Espresso Bar', 'Catering', 'Patisserie Belle', 1850, 1790, 900],
    ['Custom Lounge Furniture & Drapery', 'Rentals', 'Moderne Event Rentals', 4200, 4100, 2050],
    ['VIP Speaker / Bridal Party Gifts', 'Hospitality', 'Tiffany & Co. Corporate', 2600, 2480, 2480],
    ['Event Liability Insurance & Security', 'Operations', 'Chubb Event Protection', 1600, 1550, 1550],
    ['Hotel Welcome Bags & Shuttle Service', 'Guest Experience', 'Marriott Marquis Group', 2900, 3120, 1500]
  ];

  const fmts = [null, null, null, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, CURRENCY_FMT, null];
  const aligns = ['left', 'center', 'left', 'right', 'right', 'right', 'right', 'right', 'center'];

  expenses.forEach((e, i) => {
    const r = 8 + i;
    const row = ws.getRow(r);
    row.getCell(1).value = e[0];
    row.getCell(2).value = e[1];
    row.getCell(3).value = e[2];
    row.getCell(4).value = e[3];
    row.getCell(5).value = e[4];
    row.getCell(6).value = { formula: `D${r}-E${r}` };
    row.getCell(7).value = e[5];
    row.getCell(8).value = { formula: `E${r}-G${r}` };
    row.getCell(9).value = { formula: `IF(E${r}>D${r},"OVER BUDGET","ON TRACK")` };
    styleDataRow(ws, r, 9, i % 2 === 1, fmts, aligns);
  });

  const footRow = 8 + expenses.length;
  const fr = ws.getRow(footRow);
  fr.getCell(1).value = 'MASTER EVENT BUDGET TOTALS';
  fr.getCell(2).value = '15 Vendors';
  fr.getCell(3).value = 'All Contracts';
  fr.getCell(4).value = { formula: `SUM(D8:D${footRow - 1})` };
  fr.getCell(5).value = { formula: `SUM(E8:E${footRow - 1})` };
  fr.getCell(6).value = { formula: `SUM(F8:F${footRow - 1})` };
  fr.getCell(7).value = { formula: `SUM(G8:G${footRow - 1})` };
  fr.getCell(8).value = { formula: `SUM(H8:H${footRow - 1})` };
  fr.getCell(9).value = { formula: `IF(E${footRow}>D${footRow},"NET OVER","UNDER BUDGET")` };
  styleFooterRow(ws, footRow, 9, fmts);

  ws.columns = [
    { width: 34 }, { width: 18 }, { width: 26 }, { width: 20 }, { width: 18 },
    { width: 22 }, { width: 18 }, { width: 18 }, { width: 18 }
  ];

  await wb.xlsx.writeFile(path.join(outDir, 'Event-Master-Budget.xlsx'));
}

async function main() {
  console.log('Generating 7 Corporate Finance, Accounting & Wealth Excel templates...');
  await buildSaaSModel();
  await buildRealEstateModel();
  await buildNetWorthTracker();
  await buildCashFlowForecaster();
  await buildFreelanceTaxCalculator();
  await buildStartupCapTable();
  await buildEventMasterBudget();
  console.log('All 7 Excel workbooks generated successfully in:', outDir);
}

main().catch((err) => {
  console.error('Error generating Excel files:', err);
  process.exit(1);
});
