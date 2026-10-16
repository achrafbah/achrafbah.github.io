const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.resolve(__dirname, '../../downloads/excel');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

async function createWorkbook(filename, title, kpiList, headers, rows, totals) {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SmartCents & BizTools Executive Suite';
  const ws = wb.addWorksheet('Dashboard & Model');

  // Title Banner
  ws.mergeCells('A1:H1');
  const titleCell = ws.getCell('A1');
  titleCell.value = title.toUpperCase();
  titleCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  ws.getRow(1).height = 32;

  // Subtitle
  ws.mergeCells('A2:H2');
  const subCell = ws.getCell('A2');
  subCell.value = 'BizTools Executive Financial & Operations Engine • Automated Dynamic Formulas';
  subCell.font = { italic: true, size: 9, color: { argb: 'FF94A3B8' } };
  subCell.alignment = { horizontal: 'center', vertical: 'middle' };
  subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  ws.getRow(2).height = 20;

  // KPI Block
  ws.getRow(4).height = 18;
  ws.getRow(5).height = 24;
  kpiList.forEach((kpi, idx) => {
    const colStart = idx * 2 + 1;
    const colEnd = colStart + 1;
    if (colEnd <= 8) {
      ws.mergeCells(4, colStart, 4, colEnd);
      ws.mergeCells(5, colStart, 5, colEnd);
      const lCell = ws.getCell(4, colStart);
      lCell.value = kpi.label;
      lCell.font = { bold: true, size: 9, color: { argb: 'FF64748B' } };
      lCell.alignment = { horizontal: 'center', vertical: 'middle' };
      lCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };

      const vCell = ws.getCell(5, colStart);
      if (kpi.formula) vCell.value = { formula: kpi.formula };
      else vCell.value = kpi.val;
      vCell.font = { bold: true, size: 12, color: { argb: 'FF0F172A' } };
      vCell.alignment = { horizontal: 'center', vertical: 'middle' };
      vCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
      if (kpi.numFmt) vCell.numFmt = kpi.numFmt;
    }
  });

  // Table Headers
  ws.getRow(7).height = 26;
  headers.forEach((h, idx) => {
    const c = ws.getCell(7, idx + 1);
    c.value = h.name;
    c.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
    c.alignment = { horizontal: h.align || 'left', vertical: 'middle' };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    c.border = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } }
    };
  });

  // Data Rows
  rows.forEach((r, rIdx) => {
    const rowNum = 8 + rIdx;
    const row = ws.getRow(rowNum);
    row.height = 20;
    const isEven = rIdx % 2 === 0;
    const bgColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    r.forEach((val, cIdx) => {
      const cell = ws.getCell(rowNum, cIdx + 1);
      if (typeof val === 'object' && val.formula) {
        cell.value = { formula: val.formula };
      } else {
        cell.value = val;
      }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.font = { size: 9.5, color: { argb: 'FF334155' } };
      cell.alignment = { horizontal: headers[cIdx].align || 'left', vertical: 'middle' };
      if (headers[cIdx].numFmt) cell.numFmt = headers[cIdx].numFmt;
      cell.border = {
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });
  });

  // Totals Row
  const totRow = 8 + rows.length;
  ws.getRow(totRow).height = 24;
  totals.forEach((t, cIdx) => {
    const cell = ws.getCell(totRow, cIdx + 1);
    if (t && typeof t === 'object' && t.formula) {
      cell.value = { formula: t.formula };
    } else {
      cell.value = t;
    }
    cell.font = { bold: true, size: 10, color: { argb: 'FF0F172A' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    cell.alignment = { horizontal: headers[cIdx].align || 'left', vertical: 'middle' };
    if (headers[cIdx].numFmt) cell.numFmt = headers[cIdx].numFmt;
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      bottom: { style: 'double', color: { argb: 'FF0F172A' } }
    };
  });

  // Auto-width
  headers.forEach((h, idx) => {
    ws.getColumn(idx + 1).width = h.width || 18;
  });

  const filePath = path.join(OUT_DIR, filename);
  await wb.xlsx.writeFile(filePath);
  console.log('Created: ' + filename);
}

async function run() {
  console.log('Generating 14 new professional Excel models...');

  // 1. Cryptocurrency-Portfolio-Tax-Tracker.xlsx
  await createWorkbook(
    'Cryptocurrency-Portfolio-Tax-Tracker.xlsx',
    'Cryptocurrency Portfolio & Realized Tax Gain/Loss Model',
    [
      { label: 'Total Invested', formula: 'SUM(E8:E21)', numFmt: '$#,##0.00' },
      { label: 'Current Value', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Unrealized P&L', formula: 'F5-B5', numFmt: '$#,##0.00' },
      { label: 'Portfolio ROI', formula: 'IF(B5>0,G5/B5,0)', numFmt: '0.0%' }
    ],
    [
      { name: 'Asset Name', width: 16 },
      { name: 'Ticker', width: 10, align: 'center' },
      { name: 'Holdings', width: 14, align: 'right', numFmt: '#,##0.0000' },
      { name: 'Avg Buy Price', width: 15, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Cost Basis', width: 15, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Current Price', width: 15, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Market Value', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Net Gain/Loss', width: 16, align: 'right', numFmt: '$#,##0.00' }
    ],
    [
      ['Bitcoin', 'BTC', 1.85, 42500, { formula: 'C8*D8' }, 67800, { formula: 'C8*F8' }, { formula: 'G8-E8' }],
      ['Ethereum', 'ETH', 14.5, 2350, { formula: 'C9*D9' }, 3520, { formula: 'C9*F9' }, { formula: 'G9-E9' }],
      ['Solana', 'SOL', 120, 78.5, { formula: 'C10*D10' }, 158.4, { formula: 'C10*F10' }, { formula: 'G10-E10' }],
      ['Cardano', 'ADA', 15000, 0.42, { formula: 'C11*D11' }, 0.58, { formula: 'C11*F11' }, { formula: 'G11-E11' }],
      ['Chainlink', 'LINK', 650, 12.8, { formula: 'C12*D12' }, 19.5, { formula: 'C12*F12' }, { formula: 'G12-E12' }],
      ['Polygon', 'MATIC', 8500, 0.72, { formula: 'C13*D13' }, 0.94, { formula: 'C13*F13' }, { formula: 'G13-E13' }],
      ['Avalanche', 'AVAX', 220, 24.5, { formula: 'C14*D14' }, 38.2, { formula: 'C14*F14' }, { formula: 'G14-E14' }],
      ['Polkadot', 'DOT', 1100, 6.2, { formula: 'C15*D15' }, 8.75, { formula: 'C15*F15' }, { formula: 'G15-E15' }],
      ['Render Token', 'RNDR', 900, 4.1, { formula: 'C16*D16' }, 10.4, { formula: 'C16*F16' }, { formula: 'G16-E16' }],
      ['Near Protocol', 'NEAR', 1400, 3.2, { formula: 'C17*D17' }, 6.8, { formula: 'C17*F17' }, { formula: 'G17-E17' }],
      ['Uniswap', 'UNI', 800, 7.5, { formula: 'C18*D18' }, 11.2, { formula: 'C18*F18' }, { formula: 'G18-E18' }],
      ['Bittensor', 'TAO', 25, 280, { formula: 'C19*D19' }, 540, { formula: 'C19*F19' }, { formula: 'G19-E19' }],
      ['Fetch.ai', 'FET', 3500, 0.85, { formula: 'C20*D20' }, 2.15, { formula: 'C20*F20' }, { formula: 'G20-E20' }],
      ['Sui Network', 'SUI', 4500, 1.15, { formula: 'C21*D21' }, 2.05, { formula: 'C21*F21' }, { formula: 'G21-E21' }]
    ],
    ['PORTFOLIO TOTAL', '', '', '', { formula: 'SUM(E8:E21)' }, '', { formula: 'SUM(G8:G21)' }, { formula: 'SUM(H8:H21)' }]
  );

  // 2. Commercial-Mortgage-Amortization.xlsx
  await createWorkbook(
    'Commercial-Mortgage-Amortization.xlsx',
    'Commercial Real Estate Loan Amortization & Debt Service Schedule',
    [
      { label: 'Loan Principal', formula: 'SUM(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Total Interest', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' },
      { label: 'Total DSCR Service', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Avg Interest Rate', formula: 'AVERAGE(E8:E21)', numFmt: '0.00%' }
    ],
    [
      { name: 'Tranche / Asset', width: 18 },
      { name: 'Lender', width: 15 },
      { name: 'Term (Yrs)', width: 12, align: 'center' },
      { name: 'Original Principal', width: 18, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Interest Rate', width: 14, align: 'right', numFmt: '0.00%' },
      { name: 'Annual Interest', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Annual Principal & Int', width: 20, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Loan Status', width: 14, align: 'center' }
    ],
    [
      ['Plaza Retail Tower A', 'JPMorgan Chase', 25, 4500000, 0.0575, { formula: 'D8*E8' }, { formula: 'ROUND(-PMT(E8,C8,D8),2)' }, 'Active'],
      ['Industrial Park B', 'Bank of America', 20, 2800000, 0.0625, { formula: 'D9*E9' }, { formula: 'ROUND(-PMT(E9,C9,D9),2)' }, 'Active'],
      ['Medical Office Center', 'Wells Fargo', 25, 3200000, 0.055, { formula: 'D10*E10' }, { formula: 'ROUND(-PMT(E10,C10,D10),2)' }, 'Active'],
      ['Multifamily Complex C', 'Freddie Mac', 30, 6800000, 0.051, { formula: 'D11*E11' }, { formula: 'ROUND(-PMT(E11,C11,D11),2)' }, 'Active'],
      ['Logistics Hub South', 'PNC Bank', 15, 1950000, 0.064, { formula: 'D12*E12' }, { formula: 'ROUND(-PMT(E12,C12,D12),2)' }, 'Active'],
      ['Downtown Mixed-Use', 'KeyBank', 25, 5200000, 0.058, { formula: 'D13*E13' }, { formula: 'ROUND(-PMT(E13,C13,D13),2)' }, 'Active'],
      ['Suburban Flex Space', 'Truist Bank', 20, 2100000, 0.061, { formula: 'D14*E14' }, { formula: 'ROUND(-PMT(E14,C14,D14),2)' }, 'Active'],
      ['Tech Hub Office 4', 'US Bank', 20, 3600000, 0.059, { formula: 'D15*E15' }, { formula: 'ROUND(-PMT(E15,C15,D15),2)' }, 'Active'],
      ['Cold Storage Facility', 'Fifth Third', 15, 1750000, 0.066, { formula: 'D16*E16' }, { formula: 'ROUND(-PMT(E16,C16,D16),2)' }, 'Active'],
      ['Retail Strip Center', 'Regions Bank', 25, 2900000, 0.057, { formula: 'D17*E17' }, { formula: 'ROUND(-PMT(E17,C17,D17),2)' }, 'Active'],
      ['Student Housing Village', 'Fannie Mae', 30, 7400000, 0.052, { formula: 'D18*E18' }, { formula: 'ROUND(-PMT(E18,C18,D18),2)' }, 'Active'],
      ['Self-Storage Depot East', 'Huntington', 20, 1650000, 0.063, { formula: 'D19*E19' }, { formula: 'ROUND(-PMT(E19,C19,D19),2)' }, 'Active'],
      ['Corporate HQ Campus', 'Citigroup', 25, 8500000, 0.054, { formula: 'D20*E20' }, { formula: 'ROUND(-PMT(E20,C20,D20),2)' }, 'Active'],
      ['Data Center Facility', 'Goldman Sachs', 15, 4900000, 0.060, { formula: 'D21*E21' }, { formula: 'ROUND(-PMT(E21,C21,D21),2)' }, 'Active']
    ],
    ['PORTFOLIO TOTAL', '', '', { formula: 'SUM(D8:D21)' }, { formula: 'AVERAGE(E8:E21)' }, { formula: 'SUM(F8:F21)' }, { formula: 'SUM(G8:G21)' }, '14 Loans']
  );

  // 3. Dividend-Income-Snowball-Model.xlsx
  await createWorkbook(
    'Dividend-Income-Snowball-Model.xlsx',
    'Dividend Aristocrats Snowball & DRIP Compounding Model',
    [
      { label: 'Total Portfolio Capital', formula: 'SUM(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Annual Passive Dividend', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Monthly Cash Flow', formula: 'C5/12', numFmt: '$#,##0.00' },
      { label: 'Blended Dividend Yield', formula: 'IF(A5>0,C5/A5,0)', numFmt: '0.00%' }
    ],
    [
      { name: 'Company Name', width: 18 },
      { name: 'Ticker', width: 10, align: 'center' },
      { name: 'Shares Held', width: 13, align: 'right', numFmt: '#,##0' },
      { name: 'Market Value', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Div Per Share', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Div Yield %', width: 13, align: 'right', numFmt: '0.00%' },
      { name: 'Annual Dividend', width: 17, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Payout Frequency', width: 16, align: 'center' }
    ],
    [
      ['Realty Income', 'O', 850, 48450, 3.12, 0.0547, { formula: 'C8*E8' }, 'Monthly'],
      ['Johnson & Johnson', 'JNJ', 320, 51200, 4.96, 0.0310, { formula: 'C9*E9' }, 'Quarterly'],
      ['Procter & Gamble', 'PG', 310, 49600, 3.96, 0.0248, { formula: 'C10*E10' }, 'Quarterly'],
      ['Coca-Cola Co.', 'KO', 800, 48000, 1.94, 0.0323, { formula: 'C11*E11' }, 'Quarterly'],
      ['AbbVie Inc.', 'ABBV', 280, 46200, 6.20, 0.0376, { formula: 'C12*E12' }, 'Quarterly'],
      ['Exxon Mobil', 'XOM', 420, 48300, 3.80, 0.0330, { formula: 'C13*E13' }, 'Quarterly'],
      ['Chevron Corp.', 'CVX', 300, 45000, 6.52, 0.0435, { formula: 'C14*E14' }, 'Quarterly'],
      ['PepsiCo Inc.', 'PEP', 290, 49300, 5.06, 0.0298, { formula: 'C15*E15' }, 'Quarterly'],
      ['Lockheed Martin', 'LMT', 110, 49500, 12.60, 0.0280, { formula: 'C16*E16' }, 'Quarterly'],
      ['McDonalds Corp.', 'MCD', 180, 50400, 6.68, 0.0239, { formula: 'C17*E17' }, 'Quarterly'],
      ['Target Corp.', 'TGT', 350, 49000, 4.48, 0.0320, { formula: 'C18*E18' }, 'Quarterly'],
      ['General Dynamics', 'GD', 190, 51300, 5.68, 0.0210, { formula: 'C19*E19' }, 'Quarterly'],
      ['Main Street Capital', 'MAIN', 1100, 49500, 3.18, 0.0707, { formula: 'C20*E20' }, 'Monthly'],
      ['Ares Capital Corp.', 'ARCC', 2300, 47150, 1.92, 0.0937, { formula: 'C21*E21' }, 'Quarterly']
    ],
    ['TOTAL PORTFOLIO', '', { formula: 'SUM(C8:C21)' }, { formula: 'SUM(D8:D21)' }, '', { formula: 'AVERAGE(F8:F21)' }, { formula: 'SUM(G8:G21)' }, 'Reinvest Active']
  );

  // 4. Venture-Capital-Deal-Flow-Scorecard.xlsx
  await createWorkbook(
    'Venture-Capital-Deal-Flow-Scorecard.xlsx',
    'Venture Capital Deal Flow, Valuation & Investment Scorecard',
    [
      { label: 'Active Pipeline Deals', formula: 'COUNTA(A8:A21)', numFmt: '0' },
      { label: 'Total Target Check Size', formula: 'SUM(E8:E21)', numFmt: '$#,##0.00' },
      { label: 'Avg Pre-Money Valuation', formula: 'AVERAGE(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Avg Weighted Score', formula: 'AVERAGE(G8:G21)', numFmt: '0.0 / 10' }
    ],
    [
      { name: 'Startup Company', width: 18 },
      { name: 'Niche Sector', width: 16 },
      { name: 'Round Stage', width: 12, align: 'center' },
      { name: 'Pre-Money Valuation', width: 19, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Target Investment', width: 17, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Target Ownership', width: 16, align: 'right', numFmt: '0.0%' },
      { name: 'Weighted Score', width: 15, align: 'right', numFmt: '0.0' },
      { name: 'Investment Decision', width: 18, align: 'center' }
    ],
    [
      ['NeuralForge AI', 'Enterprise AI', 'Seed', 12000000, 1500000, { formula: 'E8/(D8+E8)' }, 9.2, 'Lead Term Sheet'],
      ['CyberSentinel', 'Cybersecurity', 'Series A', 28000000, 3500000, { formula: 'E9/(D9+E9)' }, 8.7, 'Due Diligence'],
      ['FinPulse Flow', 'Fintech / B2B', 'Seed', 9000000, 1200000, { formula: 'E10/(D10+E10)' }, 8.4, 'Partner Review'],
      ['BioSynth Lab', 'HealthTech / AI', 'Series A', 35000000, 4000000, { formula: 'E11/(D11+E11)' }, 7.9, 'Technical Audit'],
      ['SupplyLogix', 'Supply Chain SaaS', 'Pre-Seed', 5000000, 750000, { formula: 'E12/(D12+E12)' }, 8.1, 'Reference Checks'],
      ['OmniRetail AI', 'E-Commerce Agent', 'Seed', 14000000, 2000000, { formula: 'E13/(D13+E13)' }, 9.0, 'Lead Term Sheet'],
      ['VoltCharge Energy', 'CleanTech / Grid', 'Series A', 40000000, 5000000, { formula: 'E14/(D14+E14)' }, 7.5, 'Monitoring'],
      ['QuantumShield', 'Post-Quantum Crypto', 'Seed', 16000000, 2200000, { formula: 'E15/(D15+E15)' }, 8.8, 'Term Sheet Issued'],
      ['DevOpsMesh', 'Developer Tools', 'Series A', 22000000, 3000000, { formula: 'E16/(D16+E16)' }, 8.3, 'Due Diligence'],
      ['MedVibe Health', 'Remote Patient Care', 'Seed', 8500000, 1100000, { formula: 'E17/(D17+E17)' }, 7.8, 'IC Follow-up'],
      ['AgroSens Robotic', 'AgriTech Autonomy', 'Seed', 11000000, 1400000, { formula: 'E18/(D18+E18)' }, 8.0, 'Site Visit'],
      ['FleetCarbon AI', 'ESG Logistics', 'Pre-Seed', 6000000, 800000, { formula: 'E19/(D19+E19)' }, 7.2, 'Pass / Track'],
      ['LegalGenius AI', 'Legal Tech Agents', 'Seed', 13500000, 1800000, { formula: 'E20/(D20+E20)' }, 8.9, 'Due Diligence'],
      ['HyperScale Storage', 'Decentralized Cloud', 'Series A', 32000000, 4000000, { formula: 'E21/(D21+E21)' }, 8.5, 'Partner Review']
    ],
    ['PIPELINE TOTAL', '', '', { formula: 'SUM(D8:D21)' }, { formula: 'SUM(E8:E21)' }, { formula: 'AVERAGE(F8:F21)' }, { formula: 'AVERAGE(G8:G21)' }, 'Allocated']
  );

  // 5. College-Savings-529-Growth-Model.xlsx
  await createWorkbook(
    'College-Savings-529-Growth-Model.xlsx',
    'College Tuition 529 Plan Savings & Compound Growth Model',
    [
      { label: 'Current 529 Balance', formula: 'SUM(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Annual Contributions', formula: 'SUM(E8:E21)*12', numFmt: '$#,##0.00' },
      { label: 'Projected College Fund', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Overall Funding Goal', formula: 'SUM(H8:H21)', numFmt: '$#,##0.00' }
    ],
    [
      { name: 'Beneficiary Child', width: 17 },
      { name: 'Target College Year', width: 17, align: 'center' },
      { name: 'Years to College', width: 15, align: 'center' },
      { name: 'Starting Balance', width: 17, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Monthly Savings', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Est. Annual Return', width: 16, align: 'right', numFmt: '0.0%' },
      { name: 'Projected At Age 18', width: 19, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Est. 4-Yr Degree Cost', width: 19, align: 'right', numFmt: '$#,##0.00' }
    ],
    [
      ['Child 1 - Sophia', 2033, 7, 28500, 450, 0.07, { formula: 'ROUND(D8*(1+F8)^C8 + E8*12*(((1+F8)^C8 - 1)/F8),2)' }, 125000],
      ['Child 2 - Lucas', 2036, 10, 18200, 500, 0.07, { formula: 'ROUND(D9*(1+F9)^C9 + E9*12*(((1+F9)^C9 - 1)/F9),2)' }, 145000],
      ['Child 3 - Emma', 2039, 13, 12000, 400, 0.07, { formula: 'ROUND(D10*(1+F10)^C10 + E10*12*(((1+F10)^C10 - 1)/F10),2)' }, 170000],
      ['Nephew 1 - Noah', 2032, 6, 15000, 250, 0.07, { formula: 'ROUND(D11*(1+F11)^C11 + E11*12*(((1+F11)^C11 - 1)/F11),2)' }, 110000],
      ['Nephew 2 - Liam', 2035, 9, 9500, 200, 0.07, { formula: 'ROUND(D12*(1+F12)^C12 + E12*12*(((1+F12)^C12 - 1)/F12),2)' }, 135000],
      ['Niece - Olivia', 2037, 11, 7800, 250, 0.07, { formula: 'ROUND(D13*(1+F13)^C13 + E13*12*(((1+F13)^C13 - 1)/F13),2)' }, 155000],
      ['Family Trust Child A', 2031, 5, 45000, 600, 0.065, { formula: 'ROUND(D14*(1+F14)^C14 + E14*12*(((1+F14)^C14 - 1)/F14),2)' }, 105000],
      ['Family Trust Child B', 2034, 8, 32000, 550, 0.065, { formula: 'ROUND(D15*(1+F15)^C15 + E15*12*(((1+F15)^C15 - 1)/F15),2)' }, 130000],
      ['Family Trust Child C', 2038, 12, 19000, 450, 0.07, { formula: 'ROUND(D16*(1+F16)^C16 + E16*12*(((1+F16)^C16 - 1)/F16),2)' }, 160000],
      ['Scholarship Fund 1', 2030, 4, 65000, 800, 0.06, { formula: 'ROUND(D17*(1+F17)^C17 + E17*12*(((1+F17)^C17 - 1)/F17),2)' }, 95000],
      ['Scholarship Fund 2', 2033, 7, 38000, 700, 0.065, { formula: 'ROUND(D18*(1+F18)^C18 + E18*12*(((1+F18)^C18 - 1)/F18),2)' }, 125000],
      ['Scholarship Fund 3', 2036, 10, 24000, 650, 0.07, { formula: 'ROUND(D19*(1+F19)^C19 + E19*12*(((1+F19)^C19 - 1)/F19),2)' }, 145000],
      ['STEM Endowment A', 2035, 9, 55000, 900, 0.07, { formula: 'ROUND(D20*(1+F20)^C20 + E20*12*(((1+F20)^C20 - 1)/F20),2)' }, 135000],
      ['Medical Scholar B', 2037, 11, 42000, 750, 0.07, { formula: 'ROUND(D21*(1+F21)^C21 + E21*12*(((1+F21)^C21 - 1)/F21),2)' }, 155000]
    ],
    ['PORTFOLIO TOTAL', '', '', { formula: 'SUM(D8:D21)' }, { formula: 'SUM(E8:E21)' }, { formula: 'AVERAGE(F8:F21)' }, { formula: 'SUM(G8:G21)' }, { formula: 'SUM(H8:H21)' }]
  );

  // 6. Vehicle-Fleet-Depreciation-Lease-Tracker.xlsx
  await createWorkbook(
    'Vehicle-Fleet-Depreciation-Lease-Tracker.xlsx',
    'Corporate Vehicle Fleet Depreciation & Lease Expense Tracker',
    [
      { label: 'Fleet Purchase Value', formula: 'SUM(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Current Book Value', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Annual Depreciation', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' },
      { label: 'Monthly Fleet Lease/Op', formula: 'SUM(H8:H21)', numFmt: '$#,##0.00' }
    ],
    [
      { name: 'Vehicle ID / Plate', width: 17 },
      { name: 'Vehicle Make & Model', width: 20 },
      { name: 'Year Acquired', width: 14, align: 'center' },
      { name: 'Initial Cost', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Useful Life (Yrs)', width: 15, align: 'center' },
      { name: 'Annual Deprec.', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Current Book Value', width: 18, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Monthly OpCost', width: 16, align: 'right', numFmt: '$#,##0.00' }
    ],
    [
      ['FL-101 (Sprinter)', 'Mercedes Sprinter 2500', 2023, 62000, 5, { formula: 'D8/E8' }, { formula: 'D8 - F8*3' }, 750],
      ['FL-102 (Transit)', 'Ford Transit 350 HD', 2024, 54000, 5, { formula: 'D9/E9' }, { formula: 'D9 - F9*2' }, 680],
      ['FL-103 (Transit)', 'Ford Transit Cargo', 2024, 52000, 5, { formula: 'D10/E10' }, { formula: 'D10 - F10*2' }, 650],
      ['FL-104 (F-150)', 'Ford F-150 Lightning', 2023, 68000, 5, { formula: 'D11/E11' }, { formula: 'D11 - F11*3' }, 520],
      ['FL-105 (Silverado)', 'Chevy Silverado 2500', 2022, 59000, 5, { formula: 'D12/E12' }, { formula: 'D12 - F12*4' }, 710],
      ['FL-106 (Model Y)', 'Tesla Model Y Fleet', 2024, 46000, 5, { formula: 'D13/E13' }, { formula: 'D13 - F13*2' }, 380],
      ['FL-107 (Model 3)', 'Tesla Model 3 Exec', 2024, 42000, 5, { formula: 'D14/E14' }, { formula: 'D14 - F14*2' }, 340],
      ['FL-108 (Ram Pro)', 'Ram ProMaster 2500', 2023, 49000, 5, { formula: 'D15/E15' }, { formula: 'D15 - F15*3' }, 620],
      ['FL-109 (Forklift A)', 'Toyota 8FGU25 Forklift', 2021, 38000, 7, { formula: 'D16/E16' }, { formula: 'D16 - F16*5' }, 290],
      ['FL-110 (Forklift B)', 'Hyster Electric 5000', 2022, 41000, 7, { formula: 'D17/E17' }, { formula: 'D17 - F17*4' }, 310],
      ['FL-111 (Box Truck)', 'Isuzu NPR-HD 16ft', 2022, 78000, 6, { formula: 'D18/E18' }, { formula: 'D18 - F18*4' }, 890],
      ['FL-112 (Box Truck)', 'Freightliner M2 24ft', 2021, 95000, 6, { formula: 'D19/E19' }, { formula: 'D19 - F19*5' }, 1120],
      ['FL-113 (Sedan)', 'Toyota Camry Hybrid', 2024, 32000, 5, { formula: 'D20/E20' }, { formula: 'D20 - F20*2' }, 280],
      ['FL-114 (Sedan)', 'Honda Accord Hybrid', 2024, 34000, 5, { formula: 'D21/E21' }, { formula: 'D21 - F21*2' }, 290]
    ],
    ['FLEET TOTAL', '', '14 Units', { formula: 'SUM(D8:D21)' }, '', { formula: 'SUM(F8:F21)' }, { formula: 'SUM(G8:G21)' }, { formula: 'SUM(H8:H21)' }]
  );

  // 7. Amazon-FBA-Profit-Calculator.xlsx
  await createWorkbook(
    'Amazon-FBA-Profit-Calculator.xlsx',
    'Amazon FBA Product Profit, Referral & Storage Fee Calculator',
    [
      { label: 'Total Revenue Forecast', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' },
      { label: 'Total Amazon Fees', formula: 'SUM(H8:H21)', numFmt: '$#,##0.00' },
      { label: 'Net Profit Realized', formula: 'F5-H5-SUM(E8:E21)', numFmt: '$#,##0.00' },
      { label: 'Average Net Margin', formula: 'H5/F5', numFmt: '0.0%' }
    ],
    [
      { name: 'Product SKU', width: 14 },
      { name: 'Product Title', width: 22 },
      { name: 'Units/Mo', width: 12, align: 'right', numFmt: '#,##0' },
      { name: 'Retail Price', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Unit COGS', width: 13, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Gross Revenue', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'FBA Pick & Pack', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: '15% Amazon Referral', width: 18, align: 'right', numFmt: '$#,##0.00' }
    ],
    [
      ['FBA-SKU-01', 'Ergonomic Desk Mat XL', 450, 34.99, 8.20, { formula: 'C8*D8' }, 5.85, { formula: 'F8*0.15' }],
      ['FBA-SKU-02', 'Magnetic Charging Stand', 620, 42.50, 11.40, { formula: 'C9*D9' }, 4.95, { formula: 'F9*0.15' }],
      ['FBA-SKU-03', 'Stainless Coffee Tumbler', 850, 26.95, 5.80, { formula: 'C10*D10' }, 5.40, { formula: 'F10*0.15' }],
      ['FBA-SKU-04', 'Resistance Bands 5-Set', 1100, 19.99, 3.40, { formula: 'C11*D11' }, 4.25, { formula: 'F11*0.15' }],
      ['FBA-SKU-05', 'Blue Light Glasses 2-Pk', 780, 24.90, 4.10, { formula: 'C12*D12' }, 3.90, { formula: 'F12*0.15' }],
      ['FBA-SKU-06', 'Orthopedic Lumbar Pillow', 510, 39.99, 9.60, { formula: 'C13*D13' }, 6.20, { formula: 'F13*0.15' }],
      ['FBA-SKU-07', 'Wireless Mic for Phone', 390, 49.95, 12.80, { formula: 'C14*D14' }, 4.50, { formula: 'F14*0.15' }],
      ['FBA-SKU-08', 'Silicone Kitchen Utensils', 670, 29.99, 7.10, { formula: 'C15*D15' }, 5.75, { formula: 'F15*0.15' }],
      ['FBA-SKU-09', 'Leather Passport Wallet', 920, 21.50, 4.50, { formula: 'C16*D16' }, 3.80, { formula: 'F16*0.15' }],
      ['FBA-SKU-10', 'Aroma Essential Diffuser', 580, 32.00, 7.90, { formula: 'C17*D17' }, 5.60, { formula: 'F17*0.15' }],
      ['FBA-SKU-11', 'Travel Packing Cubes 6pc', 1250, 27.99, 5.50, { formula: 'C18*D18' }, 5.10, { formula: 'F18*0.15' }],
      ['FBA-SKU-12', 'Sunrise Alarm Clock Light', 440, 45.99, 12.10, { formula: 'C19*D19' }, 6.40, { formula: 'F19*0.15' }],
      ['FBA-SKU-13', 'Under-Desk Footrest Foam', 490, 36.50, 8.80, { formula: 'C20*D20' }, 6.10, { formula: 'F20*0.15' }],
      ['FBA-SKU-14', 'Adjustable Laptop Stand', 820, 38.90, 9.20, { formula: 'C21*D21' }, 5.30, { formula: 'F21*0.15' }]
    ],
    ['FBA TOTAL', '', { formula: 'SUM(C8:C21)' }, '', { formula: 'SUM(E8:E21)' }, { formula: 'SUM(F8:F21)' }, { formula: 'SUM(G8:G21)' }, { formula: 'SUM(H8:H21)' }]
  );

  // 8. Shopify-Order-Fulfillment-Tracker.xlsx
  await createWorkbook(
    'Shopify-Order-Fulfillment-Tracker.xlsx',
    'Shopify Order Dispatch, 3PL Fulfillment & Return Ledger',
    [
      { label: 'Total Orders Processed', formula: 'COUNTA(A8:A21)', numFmt: '#,##0' },
      { label: 'Total Order Value', formula: 'SUM(D8:D21)', numFmt: '$#,##0.00' },
      { label: 'Total Shipping Paid', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Fulfillment On-Time %', formula: 'COUNTIF(H8:H21,"Delivered")/COUNTA(A8:A21)', numFmt: '0.0%' }
    ],
    [
      { name: 'Order Number', width: 14, align: 'center' },
      { name: 'Customer Name', width: 18 },
      { name: 'Destination State', width: 16, align: 'center' },
      { name: 'Order Value', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Carrier Service', width: 15 },
      { name: 'Tracking Number', width: 18 },
      { name: 'Shipping Cost', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Delivery Status', width: 16, align: 'center' }
    ],
    [
      ['#SH-10842', 'Marcus Vance', 'California', 142.50, 'UPS Ground', '1Z9999999999999901', 9.85, 'Delivered'],
      ['#SH-10843', 'Elena Rostova', 'New York', 89.00, 'USPS Priority', '940011189956000002', 8.20, 'Delivered'],
      ['#SH-10844', 'Jordan Taylor', 'Texas', 215.40, 'FedEx Home', '789123456789000003', 12.50, 'In Transit'],
      ['#SH-10845', 'Amina El-Amrani', 'Florida', 64.95, 'USPS Ground', '940011189956000004', 6.40, 'Delivered'],
      ['#SH-10846', 'Carlos Santana', 'Illinois', 178.00, 'UPS 2nd Day', '1Z9999999999999905', 18.20, 'Delivered'],
      ['#SH-10847', 'Chloe Dupont', 'Washington', 95.20, 'USPS Priority', '940011189956000006', 8.60, 'Delivered'],
      ['#SH-10848', 'David Kim', 'Georgia', 310.00, 'FedEx Express', '789123456789000007', 24.50, 'Out for Delivery'],
      ['#SH-10849', 'Sarah Jenkins', 'Colorado', 125.80, 'UPS Ground', '1Z9999999999999908', 10.40, 'Delivered'],
      ['#SH-10850', 'Tariq Mansour', 'Michigan', 79.50, 'USPS Ground', '940011189956000009', 6.80, 'Delivered'],
      ['#SH-10851', 'Rachel Green', 'North Carolina', 190.00, 'FedEx Home', '789123456789000010', 11.90, 'Delivered'],
      ['#SH-10852', 'Kevin O\'Connor', 'Arizona', 112.40, 'USPS Priority', '940011189956000011', 8.90, 'Delivered'],
      ['#SH-10853', 'Yuki Tanaka', 'Oregon', 245.00, 'UPS Ground', '1Z9999999999999912', 11.20, 'In Transit'],
      ['#SH-10854', 'Liam Hemsworth', 'Ohio', 85.00, 'USPS Ground', '940011189956000013', 6.90, 'Delivered'],
      ['#SH-10855', 'Zoe Kravitz', 'Massachusetts', 168.00, 'UPS 2nd Day', '1Z9999999999999914', 17.50, 'Delivered']
    ],
    ['DISPATCH TOTAL', '', '', { formula: 'SUM(D8:D21)' }, '', '', { formula: 'SUM(G8:G21)' }, '92.8% Complete']
  );

  // 9. Product-Launch-Checklist-Roadmap.xlsx
  await createWorkbook(
    'Product-Launch-Checklist-Roadmap.xlsx',
    'Go-To-Market (GTM) Product Launch Master Milestone Roadmap',
    [
      { label: 'Total Launch Tasks', formula: 'COUNTA(A8:A21)', numFmt: '#,##0' },
      { label: 'Completed Deliverables', formula: 'COUNTIF(G8:G21,"Completed")', numFmt: '#,##0' },
      { label: 'Launch Progress %', formula: 'C5/A5', numFmt: '0.0%' },
      { label: 'Budget Expended', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' }
    ],
    [
      { name: 'Launch Phase', width: 16 },
      { name: 'Milestone / Deliverable', width: 26 },
      { name: 'Owner', width: 14 },
      { name: 'Due Date', width: 14, align: 'center' },
      { name: 'Est. Budget', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Actual Cost', width: 14, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Execution Status', width: 16, align: 'center' },
      { name: 'Priority', width: 12, align: 'center' }
    ],
    [
      ['Phase 1: Discovery', 'Competitive Pricing & Positioning Matrix', 'Product Lead', '2026-11-01', 3500, 3200, 'Completed', 'High'],
      ['Phase 1: Discovery', 'User Persona & Jobs-To-Be-Done Map', 'UX Lead', '2026-11-05', 4000, 4100, 'Completed', 'High'],
      ['Phase 2: Validation', 'High-Converting Landing Page Design', 'Design Lead', '2026-11-12', 6500, 6200, 'Completed', 'High'],
      ['Phase 2: Validation', 'Waitlist Email Sequence & Lead Magnet', 'Copywriter', '2026-11-18', 2500, 2400, 'Completed', 'Medium'],
      ['Phase 3: Production', 'Core MVP Feature Freeze & QA Audit', 'Tech Lead', '2026-11-25', 12000, 11800, 'Completed', 'Critical'],
      ['Phase 3: Production', 'Stripe & PayPal Checkout Integration', 'Backend Dev', '2026-11-28', 3000, 3000, 'Completed', 'Critical'],
      ['Phase 4: Marketing', 'Product Hunt Pre-Launch & Teaser Page', 'Growth Lead', '2026-12-02', 1500, 1400, 'In Progress', 'High'],
      ['Phase 4: Marketing', 'Influencer Seed Kit & Demo Outreach', 'PR Specialist', '2026-12-05', 4500, 4800, 'In Progress', 'Medium'],
      ['Phase 4: Marketing', 'Paid Meta & Google Search Ad Creatives', 'Media Buyer', '2026-12-08', 5000, 4600, 'In Progress', 'High'],
      ['Phase 5: Launch Day', 'Product Hunt Launch & Community Blitz', 'Founder / CEO', '2026-12-12', 2000, 1500, 'Scheduled', 'Critical'],
      ['Phase 5: Launch Day', 'Live Demo Webinar & Q&A Stream', 'Growth Lead', '2026-12-12', 1000, 800, 'Scheduled', 'High'],
      ['Phase 6: Retention', 'Onboarding Email Drip Automation', 'Lifecycle Lead', '2026-12-16', 2000, 1900, 'Scheduled', 'High'],
      ['Phase 6: Retention', 'Referral & Affiliate Program Activation', 'Partnerships', '2026-12-20', 3500, 3100, 'Scheduled', 'Medium'],
      ['Phase 6: Retention', 'Customer CSAT Survey & Feature Voting', 'Product Lead', '2026-12-28', 1500, 1200, 'Scheduled', 'Low']
    ],
    ['GTM TOTAL', '', '', '', { formula: 'SUM(E8:E21)' }, { formula: 'SUM(F8:F21)' }, '92% On-Schedule', '']
  );

  // 10. Supplier-Vendor-Evaluation-Matrix.xlsx
  await createWorkbook(
    'Supplier-Vendor-Evaluation-Matrix.xlsx',
    'Strategic Vendor RFP Evaluation & Procurement Scoring Matrix',
    [
      { label: 'Evaluated Vendors', formula: 'COUNTA(A8:A21)', numFmt: '0' },
      { label: 'Highest Vendor Score', formula: 'MAX(G8:G21)', numFmt: '0.0 / 100' },
      { label: 'Avg Proposed Price', formula: 'AVERAGE(C8:C21)', numFmt: '$#,##0.00' },
      { label: 'Shortlisted Vendors', formula: 'COUNTIF(H8:H21,"Preferred Vendor")', numFmt: '0' }
    ],
    [
      { name: 'Supplier / Vendor', width: 20 },
      { name: 'Category Service', width: 16 },
      { name: 'Annual Contract ($)', width: 18, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Quality Score (35%)', width: 17, align: 'right', numFmt: '0.0' },
      { name: 'SLA Score (25%)', width: 15, align: 'right', numFmt: '0.0' },
      { name: 'Pricing Score (40%)', width: 17, align: 'right', numFmt: '0.0' },
      { name: 'Weighted Total', width: 16, align: 'right', numFmt: '0.0' },
      { name: 'Procurement Status', width: 18, align: 'center' }
    ],
    [
      ['Apex Cloud Services', 'Cloud Hosting', 48000, 94, 96, 88, { formula: 'D8*0.35 + E8*0.25 + F8*0.4' }, 'Preferred Vendor'],
      ['Vanguard 3PL Express', 'Warehousing & 3PL', 115000, 91, 88, 92, { formula: 'D9*0.35 + E9*0.25 + F9*0.4' }, 'Preferred Vendor'],
      ['Quantum Security Audit', 'Cybersecurity', 35000, 96, 95, 84, { formula: 'D10*0.35 + E10*0.25 + F10*0.4' }, 'Preferred Vendor'],
      ['Nexus Logistics Corp', 'Freight Transport', 82000, 85, 82, 86, { formula: 'D11*0.35 + E11*0.25 + F11*0.4' }, 'Alternative'],
      ['Swift Packaging Co.', 'Custom Boxes / Eco', 28000, 89, 92, 94, { formula: 'D12*0.35 + E12*0.25 + F12*0.4' }, 'Preferred Vendor'],
      ['Precision Tooling Ltd', 'CNC Hardware', 95000, 92, 85, 79, { formula: 'D13*0.35 + E13*0.25 + F13*0.4' }, 'Alternative'],
      ['Zenith Payment Gateway', 'Fintech Processing', 54000, 95, 98, 91, { formula: 'D14*0.35 + E14*0.25 + F14*0.4' }, 'Preferred Vendor'],
      ['Starlight Office Supplies', 'Workplace Supplies', 16000, 82, 80, 85, { formula: 'D15*0.35 + E15*0.25 + F15*0.4' }, 'Backup Only'],
      ['Atlas Global Legal LLP', 'Corporate Legal', 72000, 96, 94, 76, { formula: 'D16*0.35 + E16*0.25 + F16*0.4' }, 'Preferred Vendor'],
      ['MetricPulse Analytics', 'BI Data Pipeline', 32000, 90, 88, 90, { formula: 'D17*0.35 + E17*0.25 + F17*0.4' }, 'Preferred Vendor'],
      ['CleanPro Facilities', 'Commercial Cleaning', 24000, 84, 82, 88, { formula: 'D18*0.35 + E18*0.25 + F18*0.4' }, 'Alternative'],
      ['Horizon Marketing Studio', 'Creative Production', 65000, 93, 86, 85, { formula: 'D19*0.35 + E19*0.25 + F19*0.4' }, 'Preferred Vendor'],
      ['Titan Fleet Services', 'Vehicle Maintenance', 38000, 86, 84, 82, { formula: 'D20*0.35 + E20*0.25 + F20*0.4' }, 'Alternative'],
      ['SafeGuard Insurance Inc.', 'General Liability', 44000, 92, 95, 89, { formula: 'D21*0.35 + E21*0.25 + F21*0.4' }, 'Preferred Vendor']
    ],
    ['PROCUREMENT TOTAL', '', { formula: 'SUM(C8:C21)' }, { formula: 'AVERAGE(D8:D21)' }, { formula: 'AVERAGE(E8:E21)' }, { formula: 'AVERAGE(F8:F21)' }, { formula: 'AVERAGE(G8:G21)' }, 'Evaluated']
  );

  // 11. Warehouse-Space-Bin-Locator.xlsx
  await createWorkbook(
    'Warehouse-Space-Bin-Locator.xlsx',
    'Warehouse Inventory Bin Locations, Pallet Slots & Capacity Model',
    [
      { label: 'Total Pallet Slots', formula: 'SUM(C8:C21)', numFmt: '#,##0' },
      { label: 'Occupied Bins', formula: 'SUM(D8:D21)', numFmt: '#,##0' },
      { label: 'Warehouse Utilization', formula: 'C5/A5', numFmt: '0.0%' },
      { label: 'Stored SKU Value', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' }
    ],
    [
      { name: 'Aisle / Zone', width: 14, align: 'center' },
      { name: 'Product Category', width: 18 },
      { name: 'Total Bin Capacity', width: 17, align: 'right', numFmt: '#,##0' },
      { name: 'Occupied Bins', width: 15, align: 'right', numFmt: '#,##0' },
      { name: 'Available Bins', width: 15, align: 'right', numFmt: '#,##0' },
      { name: 'Estimated Inventory $', width: 20, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Zone Status', width: 15, align: 'center' },
      { name: 'Turnover Rate', width: 14, align: 'center' }
    ],
    [
      ['Zone A-01', 'High-Velocity Electronics', 240, 215, { formula: 'C8-D8' }, 285000, 'Near Capacity', 'Fast (Weekly)'],
      ['Zone A-02', 'Audio & Wearables', 240, 190, { formula: 'C9-D9' }, 195000, 'Optimal', 'Fast (Weekly)'],
      ['Zone B-01', 'Ergonomic Furniture', 180, 160, { formula: 'C10-D10' }, 145000, 'Optimal', 'Medium'],
      ['Zone B-02', 'Standing Desks & Arms', 180, 140, { formula: 'C11-D11' }, 130000, 'Healthy', 'Medium'],
      ['Zone C-01', 'Apparel & Textiles', 320, 290, { formula: 'C12-D12' }, 165000, 'Near Capacity', 'Fast (Bi-Weekly)'],
      ['Zone C-02', 'Fitness & Resistance', 320, 220, { formula: 'C13-D13' }, 98000, 'Healthy', 'Medium'],
      ['Zone D-01', 'Kitchenware & Glass', 200, 175, { formula: 'C14-D14' }, 112000, 'Optimal', 'Medium'],
      ['Zone D-02', 'Food Containers / Eco', 200, 130, { formula: 'C15-D15' }, 74000, 'Available Space', 'Medium'],
      ['Zone E-01', 'Cosmetics & Skincare', 280, 260, { formula: 'C16-D16' }, 210000, 'Near Capacity', 'Fast (Weekly)'],
      ['Zone E-02', 'Supplements & Vitamins', 280, 245, { formula: 'C17-D17' }, 185000, 'Near Capacity', 'Fast (Weekly)'],
      ['Zone F-01', 'Outdoor & Camping', 160, 110, { formula: 'C18-D18' }, 82000, 'Available Space', 'Slow (Seasonal)'],
      ['Zone F-02', 'Travel Bags & Luggage', 160, 125, { formula: 'C19-D19' }, 95000, 'Healthy', 'Medium'],
      ['Zone G-01', 'Bulk Packaging Supplies', 350, 310, { formula: 'C20-D20' }, 45000, 'Near Capacity', 'Fast (Weekly)'],
      ['Zone G-02', 'Returns & Inspection', 150, 65, { formula: 'C21-D21' }, 32000, 'Open Processing', 'Daily Flush']
    ],
    ['WAREHOUSE TOTAL', '', { formula: 'SUM(C8:C21)' }, { formula: 'SUM(D8:D21)' }, { formula: 'SUM(E8:E21)' }, { formula: 'SUM(F8:F21)' }, '85.4% Utilized', '']
  );

  // 12. Customer-Support-SLA-Ticket-Log.xlsx
  await createWorkbook(
    'Customer-Support-SLA-Ticket-Log.xlsx',
    'Customer Support Helpdesk SLA Response & CSAT Performance Matrix',
    [
      { label: 'Total Tickets Analyzed', formula: 'COUNTA(A8:A21)', numFmt: '#,##0' },
      { label: 'SLA Compliance %', formula: 'COUNTIF(G8:G21,"Met SLA")/COUNTA(A8:A21)', numFmt: '0.0%' },
      { label: 'Average CSAT Score', formula: 'AVERAGE(H8:H21)', numFmt: '0.0 / 5.0' },
      { label: 'Avg First Reply (Hrs)', formula: 'AVERAGE(E8:E21)', numFmt: '0.0h' }
    ],
    [
      { name: 'Ticket ID', width: 14, align: 'center' },
      { name: 'Customer Email', width: 22 },
      { name: 'Issue Category', width: 16 },
      { name: 'Priority Tier', width: 14, align: 'center' },
      { name: 'First Response (h)', width: 18, align: 'right', numFmt: '0.0' },
      { name: 'Resolution Time (h)', width: 18, align: 'right', numFmt: '0.0' },
      { name: 'SLA Status', width: 15, align: 'center' },
      { name: 'CSAT Rating (1-5)', width: 17, align: 'right', numFmt: '0.0' }
    ],
    [
      ['#TCK-901', 'm.johnson@client.com', 'Billing & Invoice', 'Urgent', 0.4, 2.5, 'Met SLA', 5.0],
      ['#TCK-902', 's.miller@retail.org', 'API Webhook Error', 'Urgent', 0.6, 3.8, 'Met SLA', 4.8],
      ['#TCK-903', 'd.chen@logistics.net', 'Account Access', 'Medium', 1.2, 4.5, 'Met SLA', 5.0],
      ['#TCK-904', 'h.al-mansoor@corp.ae', 'Data Export CSV', 'Low', 3.5, 12.0, 'Met SLA', 4.5],
      ['#TCK-905', 'e.rodriguez@studio.es', 'Subscription Upgrade', 'High', 0.8, 1.8, 'Met SLA', 5.0],
      ['#TCK-906', 't.becker@automotive.de', 'Bug Report / UI', 'Medium', 2.1, 14.5, 'Met SLA', 4.0],
      ['#TCK-907', 'k.takahashi@tech.jp', 'SSO SAML Setup', 'High', 1.1, 5.2, 'Met SLA', 5.0],
      ['#TCK-908', 'l.smith@consulting.uk', 'Payment Failed', 'Urgent', 0.3, 1.2, 'Met SLA', 5.0],
      ['#TCK-909', 'a.novak@agency.cz', 'Custom Domain DNS', 'Medium', 2.8, 16.0, 'Met SLA', 4.2],
      ['#TCK-910', 'b.dubois@fashion.fr', 'Order Tracking Lag', 'Low', 4.2, 18.0, 'Breached SLA', 3.5],
      ['#TCK-911', 'g.rossi@design.it', 'Template Download', 'Low', 1.5, 4.0, 'Met SLA', 4.9],
      ['#TCK-912', 'w.vandijk@shipping.nl', 'Webhook Payload 500', 'Urgent', 0.5, 2.8, 'Met SLA', 5.0],
      ['#TCK-913', 'p.santos@fintech.br', 'Invoice Currency CAD', 'Medium', 1.4, 6.2, 'Met SLA', 4.7],
      ['#TCK-914', 'j.larsson@nordic.se', 'Multi-Seat License', 'High', 0.9, 3.4, 'Met SLA', 5.0]
    ],
    ['HELPDESK TOTAL', '', '14 Tickets', '', { formula: 'AVERAGE(E8:E21)' }, { formula: 'AVERAGE(F8:F21)' }, '92.9% SLA', { formula: 'AVERAGE(H8:H21)' }]
  );

  // 13. Social-Media-Influencer-Contract-Tracker.xlsx
  await createWorkbook(
    'Social-Media-Influencer-Contract-Tracker.xlsx',
    'Influencer Marketing Sponsorship ROI & Affiliate Campaign Model',
    [
      { label: 'Total Campaign Spend', formula: 'SUM(E8:E21)', numFmt: '$#,##0.00' },
      { label: 'Total Tracked Revenue', formula: 'SUM(G8:G21)', numFmt: '$#,##0.00' },
      { label: 'Campaign ROAS', formula: 'IF(A5>0,C5/A5,0)', numFmt: '0.00x' },
      { label: 'Total Social Impressions', formula: 'SUM(D8:D21)', numFmt: '#,##0' }
    ],
    [
      { name: 'Creator / Handle', width: 18 },
      { name: 'Primary Platform', width: 16, align: 'center' },
      { name: 'Followers', width: 13, align: 'right', numFmt: '#,##0' },
      { name: 'Campaign Views', width: 16, align: 'right', numFmt: '#,##0' },
      { name: 'Contract Fee ($)', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Promo Code Orders', width: 18, align: 'right', numFmt: '#,##0' },
      { name: 'Attributed Sales', width: 17, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Campaign ROAS', width: 15, align: 'right', numFmt: '0.00x' }
    ],
    [
      ['@TechReviewDaily', 'YouTube', 450000, 185000, 4500, 310, 21700, { formula: 'G8/E8' }],
      ['@FitnessWithSarah', 'Instagram', 280000, 120000, 2800, 240, 14400, { formula: 'G9/E9' }],
      ['@CodeWithAlex', 'TikTok', 620000, 410000, 3200, 450, 27000, { formula: 'G10/E10' }],
      ['@MinimalistHome', 'Pinterest / Blog', 190000, 95000, 1800, 160, 9600, { formula: 'G11/E11' }],
      ['@FinanceGuruOfficial', 'YouTube', 520000, 240000, 6000, 490, 39200, { formula: 'G12/E12' }],
      ['@BeautyByMaya', 'TikTok', 850000, 620000, 4000, 580, 29000, { formula: 'G13/E13' }],
      ['@OutdoorAdventurePro', 'Instagram', 210000, 88000, 2200, 140, 9800, { formula: 'G14/E14' }],
      ['@DeskSetupInspo', 'Twitter / X', 160000, 75000, 1500, 120, 8400, { formula: 'G15/E15' }],
      ['@ChefMarcoKitchen', 'YouTube', 340000, 160000, 3500, 280, 19600, { formula: 'G16/E16' }],
      ['@TravelWithLina', 'Instagram', 390000, 175000, 3800, 260, 18200, { formula: 'G17/E17' }],
      ['@StudySmartVibes', 'TikTok', 480000, 320000, 2600, 390, 19500, { formula: 'G18/E18' }],
      ['@ProductivityHacks', 'LinkedIn', 125000, 64000, 2000, 190, 17100, { formula: 'G19/E19' }],
      ['@GamerStationReview', 'Twitch / YT', 310000, 140000, 3000, 220, 15400, { formula: 'G20/E20' }],
      ['@CleanEatsDaily', 'Instagram', 240000, 110000, 2400, 210, 12600, { formula: 'G21/E21' }]
    ],
    ['CAMPAIGN TOTAL', '', { formula: 'SUM(C8:C21)' }, { formula: 'SUM(D8:D21)' }, { formula: 'SUM(E8:E21)' }, { formula: 'SUM(F8:F21)' }, { formula: 'SUM(G8:G21)' }, { formula: 'G22/E22' }]
  );

  // 14. Corporate-Equipment-Maintenance-Log.xlsx
  await createWorkbook(
    'Corporate-Equipment-Maintenance-Log.xlsx',
    'Industrial & Corporate Equipment Maintenance (GMAO) Logbook',
    [
      { label: 'Total Tracked Assets', formula: 'COUNTA(A8:A21)', numFmt: '#,##0' },
      { label: 'YTD Maintenance Cost', formula: 'SUM(F8:F21)', numFmt: '$#,##0.00' },
      { label: 'Operational Health %', formula: 'COUNTIF(G8:G21,"Operational")/COUNTA(A8:A21)', numFmt: '0.0%' },
      { label: 'Overdue Inspections', formula: 'COUNTIF(H8:H21,"Action Required")', numFmt: '0' }
    ],
    [
      { name: 'Asset Tag ID', width: 14, align: 'center' },
      { name: 'Equipment Name', width: 22 },
      { name: 'Location / Line', width: 16 },
      { name: 'Service Interval', width: 16, align: 'center' },
      { name: 'Last Service Date', width: 16, align: 'center' },
      { name: 'YTD Service Cost', width: 16, align: 'right', numFmt: '$#,##0.00' },
      { name: 'Machine Status', width: 16, align: 'center' },
      { name: 'Inspection Health', width: 18, align: 'center' }
    ],
    [
      ['EQ-3001', 'CNC Milling Machine 5-Axis', 'Plant Floor Line 1', 'Monthly', '2026-10-02', 4200, 'Operational', 'Good Standing'],
      ['EQ-3002', 'Hydraulic Press 200T', 'Stamping Bay', 'Quarterly', '2026-09-15', 3100, 'Operational', 'Good Standing'],
      ['EQ-3003', 'Automated Packaging Line', 'Packaging Hub', 'Bi-Weekly', '2026-10-10', 5800, 'Operational', 'Good Standing'],
      ['EQ-3004', 'Air Compressor Rotary 50HP', 'Utility Room A', 'Quarterly', '2026-08-20', 1850, 'Degraded', 'Action Required'],
      ['EQ-3005', 'Electric Forklift 5000lb', 'Warehouse Zone B', 'Monthly', '2026-10-05', 1200, 'Operational', 'Good Standing'],
      ['EQ-3006', 'SMT Pick-and-Place Robot', 'Cleanroom Line 3', 'Monthly', '2026-10-08', 6400, 'Operational', 'Good Standing'],
      ['EQ-3007', 'Reflow Soldering Oven', 'Cleanroom Line 3', 'Quarterly', '2026-09-18', 2900, 'Operational', 'Good Standing'],
      ['EQ-3008', 'Industrial Chiller 100-Ton', 'HVAC Roof Bay', 'Quarterly', '2026-07-15', 4100, 'Under Repair', 'Action Required'],
      ['EQ-3009', 'Laser Cutting System 6kW', 'Fabrication Shop', 'Bi-Weekly', '2026-10-12', 7200, 'Operational', 'Good Standing'],
      ['EQ-3010', 'Injection Molding Machine', 'Plastics Line 2', 'Monthly', '2026-10-01', 5100, 'Operational', 'Good Standing'],
      ['EQ-3011', 'Robotic Welding Arm', 'Assembly Cell 4', 'Monthly', '2026-09-28', 3800, 'Operational', 'Good Standing'],
      ['EQ-3012', 'Backup Diesel Generator 500kW', 'Power Substation', 'Annual', '2026-06-10', 2400, 'Operational', 'Good Standing'],
      ['EQ-3013', 'Automated Conveyor Loop', 'Sorting Center', 'Bi-Weekly', '2026-10-11', 2700, 'Operational', 'Good Standing'],
      ['EQ-3014', 'Spectrometer Lab Analyzer', 'Quality Control Lab', 'Semi-Annual', '2026-08-01', 1900, 'Operational', 'Good Standing']
    ],
    ['GMAO TOTAL', '', '14 Production Units', '', '', { formula: 'SUM(F8:F21)' }, '85.7% Uptime', '2 Alerts']
  );

  console.log('Successfully generated all 14 Excel workbooks!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
