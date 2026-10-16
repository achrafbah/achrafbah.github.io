const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, '..', '..', 'downloads', 'excel');
fs.mkdirSync(outDir, { recursive: true });

// Shared styling helpers
const COLORS = {
  navy: 'FF0F172A',
  slate: 'FF1E293B',
  blue: 'FF2563EB',
  indigo: 'FF4F46E5',
  emerald: 'FF059669',
  amber: 'FFD97706',
  rose: 'FFE11D48',
  teal: 'FF0D9488',
  lightBg: 'FFF8FAFC',
  zebraBg: 'FFF1F5F9',
  kpiBg: 'FFEFF6FF',
  border: 'FFCBD5E1',
  white: 'FFFFFFFF',
  textDark: 'FF0F172A',
  textMuted: 'FF475569'
};

const thinBorder = {
  top: { style: 'thin', color: { argb: COLORS.border } },
  left: { style: 'thin', color: { argb: COLORS.border } },
  bottom: { style: 'thin', color: { argb: COLORS.border } },
  right: { style: 'thin', color: { argb: COLORS.border } }
};

const doubleBottomBorder = {
  top: { style: 'thin', color: { argb: COLORS.navy } },
  bottom: { style: 'double', color: { argb: COLORS.navy } },
  left: { style: 'thin', color: { argb: COLORS.border } },
  right: { style: 'thin', color: { argb: COLORS.border } }
};

function setupTitleBanner(ws, title, subtitle, lastColLetter, themeColor = COLORS.navy) {
  ws.mergeCells(`A1:${lastColLetter}1`);
  const tCell = ws.getCell('A1');
  tCell.value = title;
  tCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.white } };
  tCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeColor } };
  tCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(1).height = 34;

  ws.mergeCells(`A2:${lastColLetter}2`);
  const sCell = ws.getCell('A2');
  sCell.value = subtitle;
  sCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: 'FFE2E8F0' } };
  sCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.slate } };
  sCell.alignment = { vertical: 'middle', horizontal: 'left', indent: 1 };
  ws.getRow(2).height = 22;

  ws.getRow(3).height = 10;
}

function addKpiCards(ws, kpis) {
  // kpis: array of { colStart, colEnd, label, formula, numFmt, accentColor }
  ws.getRow(4).height = 18;
  ws.getRow(5).height = 28;
  ws.getRow(6).height = 10;

  for (const k of kpis) {
    ws.mergeCells(`${k.colStart}4:${k.colEnd}4`);
    ws.mergeCells(`${k.colStart}5:${k.colEnd}5`);
    const lCell = ws.getCell(`${k.colStart}4`);
    lCell.value = k.label.toUpperCase();
    lCell.font = { name: 'Segoe UI', size: 8, bold: true, color: { argb: COLORS.textMuted } };
    lCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    lCell.alignment = { vertical: 'middle', horizontal: 'center' };
    lCell.border = { top: thinBorder.top, left: thinBorder.left, right: thinBorder.right };

    const vCell = ws.getCell(`${k.colStart}5`);
    vCell.value = { formula: k.formula };
    if (k.numFmt) vCell.numFmt = k.numFmt;
    vCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: k.accentColor || COLORS.blue } };
    vCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    vCell.alignment = { vertical: 'middle', horizontal: 'center' };
    vCell.border = { bottom: thinBorder.bottom, left: thinBorder.left, right: thinBorder.right };
  }
}

function styleHeaderRow(ws, rowNum, headers, themeColor = COLORS.navy) {
  const row = ws.getRow(rowNum);
  row.height = 26;
  headers.forEach((h, idx) => {
    const cell = row.getCell(idx + 1);
    cell.value = h;
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: themeColor } };
    cell.alignment = { vertical: 'middle', horizontal: idx < 2 ? 'left' : 'center', wrapText: true };
    cell.border = thinBorder;
  });
}

function autoSizeColumns(ws, minWidth = 13, maxWidth = 34) {
  ws.columns.forEach((col) => {
    let maxLen = minWidth;
    col.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
      if (rowNumber <= 5) return; // skip merged title/KPI cells
      let val = cell.value;
      if (val && typeof val === 'object' && val.formula) {
        val = '123,456.78';
      }
      const str = val ? String(val) : '';
      if (str.length + 4 > maxLen) maxLen = str.length + 4;
    });
    col.width = Math.min(maxLen, maxWidth);
  });
}

// ============================================================================
// 1. Ecommerce-ROAS-Pricing.xlsx
// ============================================================================
async function buildEcommerceRoasPricing() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('ROAS & Pricing Matrix', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'E-COMMERCE PRODUCT PRICING, LANDED COGS & BREAK-EVEN ROAS CALCULATOR',
    'Unit Economics, Landed Cost, Target CPA, Break-Even ROAS & Net Profit Margin Model',
    'N',
    COLORS.indigo
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Avg Selling Price (AOV)', formula: 'AVERAGE(D8:D21)', numFmt: '$#,##0.00', accentColor: COLORS.indigo },
    { colStart: 'D', colEnd: 'F', label: 'Avg Gross Margin %', formula: 'AVERAGE(J8:J21)', numFmt: '0.0%', accentColor: COLORS.emerald },
    { colStart: 'G', colEnd: 'I', label: 'Portfolio Break-Even ROAS', formula: 'AVERAGE(K8:K21)', numFmt: '0.00"x"', accentColor: COLORS.amber },
    { colStart: 'J', colEnd: 'L', label: 'Avg Net Profit / Unit', formula: 'AVERAGE(M8:M21)', numFmt: '$#,##0.00', accentColor: COLORS.blue },
    { colStart: 'M', colEnd: 'N', label: 'Profitable SKUs', formula: 'COUNTIF(N8:N21,"SCALE")', numFmt: '#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'SKU Code', 'Product Name', 'Category', 'Retail Price ($)', 'Unit COGS ($)',
    'Shipping & 3PL ($)', 'Payment Fee (2.9%+$0.30)', 'Total Landed Cost ($)', 'Gross Profit ($)',
    'Gross Margin %', 'Break-Even ROAS', 'Actual Ad CPA ($)', 'Net Profit / Unit ($)', 'Pricing Status'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.indigo);

  const items = [
    ['SKU-101', 'AeroFit Pro Massage Gun', 'Fitness', 149.00, 32.50, 9.80, 28.00],
    ['SKU-102', 'LumiGlow LED Therapy Mask', 'Beauty', 189.00, 41.00, 8.50, 38.00],
    ['SKU-103', 'Nordic Brew Pour-Over Kettle', 'Home & Kitchen', 89.00, 21.00, 7.40, 22.50],
    ['SKU-104', 'ErgoCloud Memory Foam Pillow', 'Sleep', 79.00, 16.50, 8.20, 19.00],
    ['SKU-105', 'Titanium MagSafe Travel Charger', 'Tech Accessories', 68.00, 14.20, 4.90, 18.50],
    ['SKU-106', 'Pure Pet Automatic Smart Feeder', 'Pet Care', 129.00, 34.00, 11.50, 31.00],
    ['SKU-107', 'Zenith Cold Plunge Chiller Pod', 'Wellness', 249.00, 68.00, 22.00, 52.00],
    ['SKU-108', 'Botanica Matcha Starter Kit', 'Food & Bev', 54.00, 11.80, 5.50, 16.00],
    ['SKU-109', 'Apex Carbon Fiber Trekking Poles', 'Outdoors', 115.00, 26.00, 8.90, 27.00],
    ['SKU-110', 'Veloce Polarized Cycling Glasses', 'Apparel', 95.00, 18.00, 5.20, 24.00],
    ['SKU-111', 'SonicClean UV Toothbrush Sanitizer', 'Personal Care', 49.00, 10.50, 4.80, 18.00],
    ['SKU-112', 'HydroFlask Insulated Dog Bowl', 'Pet Care', 42.00, 9.20, 5.40, 17.50],
    ['SKU-113', 'SmartPosture Wearable Trainer', 'Health Tech', 109.00, 23.00, 6.10, 25.00],
    ['SKU-114', 'AcoustiPod Studio Desk Mat', 'Home Office', 64.00, 13.50, 6.20, 16.00]
  ];

  items.forEach((item, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const isEven = idx % 2 === 1;
    const bg = isEven ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = item[0];
    row.getCell(2).value = item[1];
    row.getCell(3).value = item[2];
    row.getCell(4).value = item[3];
    row.getCell(5).value = item[4];
    row.getCell(6).value = item[5];
    row.getCell(7).value = { formula: `ROUND(D${r}*0.029+0.30, 2)` };
    row.getCell(8).value = { formula: `SUM(E${r}:G${r})` };
    row.getCell(9).value = { formula: `D${r}-H${r}` };
    row.getCell(10).value = { formula: `IF(D${r}>0, I${r}/D${r}, 0)` };
    row.getCell(11).value = { formula: `IF(I${r}>0, D${r}/I${r}, 0)` };
    row.getCell(12).value = item[6];
    row.getCell(13).value = { formula: `I${r}-L${r}` };
    row.getCell(14).value = { formula: `IF(M${r}/D${r}>=0.22,"SCALE",IF(M${r}>0,"OPTIMIZE","REPRICE"))` };

    for (let c = 1; c <= 14; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([4, 5, 6, 7, 8, 9, 12, 13].includes(c)) {
        cell.numFmt = '$#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 10) {
        cell.numFmt = '0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 11) {
        cell.numFmt = '0.00"x"';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 14) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.indigo } };
      } else {
        cell.alignment = { horizontal: c <= 3 ? 'left' : 'center', vertical: 'middle' };
      }
    }
  });

  // Totals / Averages Row
  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'PORTFOLIO TOTAL / AVG';
  tRow.getCell(4).value = { formula: 'AVERAGE(D8:D21)' };
  tRow.getCell(5).value = { formula: 'AVERAGE(E8:E21)' };
  tRow.getCell(6).value = { formula: 'AVERAGE(F8:F21)' };
  tRow.getCell(7).value = { formula: 'AVERAGE(G8:G21)' };
  tRow.getCell(8).value = { formula: 'AVERAGE(H8:H21)' };
  tRow.getCell(9).value = { formula: 'AVERAGE(I8:I21)' };
  tRow.getCell(10).value = { formula: 'AVERAGE(J8:J21)' };
  tRow.getCell(11).value = { formula: 'AVERAGE(K8:K21)' };
  tRow.getCell(12).value = { formula: 'AVERAGE(L8:L21)' };
  tRow.getCell(13).value = { formula: 'SUM(M8:M21)' };
  tRow.getCell(14).value = { formula: 'IF(AVERAGE(J8:J21)>=0.5,"HEALTHY","REVIEW")' };

  for (let c = 1; c <= 14; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([4, 5, 6, 7, 8, 9, 12, 13].includes(c)) cell.numFmt = '$#,##0.00';
    if (c === 10) cell.numFmt = '0.0%';
    if (c === 11) cell.numFmt = '0.00"x"';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Ecommerce-ROAS-Pricing.xlsx'));
}

// ============================================================================
// 2. Agile-Gantt-Roadmap.xlsx
// ============================================================================
async function buildAgileGanttRoadmap() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Agile Sprint Roadmap', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'AGILE SPRINT BACKLOG, STORY POINTS, VELOCITY & PRODUCT LAUNCH ROADMAP',
    'Engineering & Product Release Tracker with Sprint Capacity, Completion % & Risk Flags',
    'M',
    COLORS.blue
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Total Story Points', formula: 'SUM(F8:F22)', numFmt: '#,##0', accentColor: COLORS.blue },
    { colStart: 'D', colEnd: 'F', label: 'Completed Points (Velocity)', formula: 'SUM(G8:G22)', numFmt: '#,##0', accentColor: COLORS.emerald },
    { colStart: 'G', colEnd: 'I', label: 'Overall Completion %', formula: 'AVERAGE(H8:H22)', numFmt: '0.0%', accentColor: COLORS.indigo },
    { colStart: 'J', colEnd: 'K', label: 'Completed Epics/Stories', formula: 'COUNTIF(K8:K22,"Done")', numFmt: '#,##0', accentColor: COLORS.emerald },
    { colStart: 'L', colEnd: 'M', label: 'Total Est. Eng Hours', formula: 'SUM(I8:I22)', numFmt: '#,##0" hrs"', accentColor: COLORS.amber }
  ]);

  const headers = [
    'Story ID', 'Epic / Workstream', 'User Story / Deliverable', 'Sprint', 'Owner',
    'Story Points', 'Points Completed', 'Completion %', 'Est. Hours', 'Actual Hours',
    'Status', 'Priority', 'Delivery Health'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.blue);

  const stories = [
    ['US-201', 'Auth & SSO', 'OAuth2 + SAML Enterprise Login Flow', 'Sprint 14', 'A. Bahloul', 8, 8, 34, 'P0 - Critical'],
    ['US-202', 'Auth & SSO', 'Role-Based Access Control (RBAC) Matrix', 'Sprint 14', 'S. Chen', 5, 5, 22, 'P0 - Critical'],
    ['US-203', 'Billing Engine', 'Stripe Subscription & Usage Metering Webhook', 'Sprint 14', 'M. Alvarez', 13, 13, 52, 'P0 - Critical'],
    ['US-204', 'Billing Engine', 'Self-Serve Plan Upgrade & Proration UI', 'Sprint 15', 'M. Alvarez', 8, 8, 30, 'P1 - High'],
    ['US-205', 'AI Copilot', 'Vector Embeddings Pipeline & RAG Indexing', 'Sprint 15', 'D. Kumar', 13, 10, 48, 'P0 - Critical'],
    ['US-206', 'AI Copilot', 'Streaming Prompt Response UI with Citations', 'Sprint 15', 'L. Novak', 8, 6, 29, 'P1 - High'],
    ['US-207', 'Analytics Hub', 'Executive Cohort Retention & LTV Charting', 'Sprint 16', 'S. Chen', 8, 5, 26, 'P1 - High'],
    ['US-208', 'Analytics Hub', 'Scheduled CSV/PDF Report Email Dispatcher', 'Sprint 16', 'K. Patel', 5, 5, 19, 'P2 - Medium'],
    ['US-209', 'Mobile App', 'React Native Offline Sync & Local Cache', 'Sprint 16', 'J. Rossi', 13, 7, 45, 'P1 - High'],
    ['US-210', 'Mobile App', 'Biometric FaceID Passkey Quick Unlock', 'Sprint 17', 'J. Rossi', 5, 2, 14, 'P2 - Medium'],
    ['US-211', 'Integrations', 'Bi-Directional HubSpot & Salesforce CRM Sync', 'Sprint 17', 'A. Bahloul', 13, 4, 38, 'P1 - High'],
    ['US-212', 'Integrations', 'Slack & Microsoft Teams Alert Bot', 'Sprint 17', 'K. Patel', 5, 0, 8, 'P2 - Medium'],
    ['US-213', 'Performance', 'Postgres Read-Replica & Redis Query Caching', 'Sprint 18', 'D. Kumar', 8, 0, 12, 'P1 - High'],
    ['US-214', 'Security & SOC2', 'Automated Audit Trail & Penetration Fixes', 'Sprint 18', 'A. Bahloul', 8, 8, 31, 'P0 - Critical'],
    ['US-215', 'Launch Ops', 'Public API v2 Documentation & SDK Release', 'Sprint 18', 'L. Novak', 5, 3, 16, 'P1 - High']
  ];

  stories.forEach((s, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = s[0];
    row.getCell(2).value = s[1];
    row.getCell(3).value = s[2];
    row.getCell(4).value = s[3];
    row.getCell(5).value = s[4];
    row.getCell(6).value = s[5];
    row.getCell(7).value = s[6];
    row.getCell(8).value = { formula: `IF(F${r}>0, G${r}/F${r}, 0)` };
    row.getCell(9).value = { formula: `F${r}*4` };
    row.getCell(10).value = s[7];
    row.getCell(11).value = { formula: `IF(H${r}=1,"Done",IF(H${r}>0,"In Progress","Backlog"))` };
    row.getCell(12).value = s[8];
    row.getCell(13).value = { formula: `IF(J${r}>I${r}*1.15,"Overrun Risk",IF(H${r}=1,"Delivered","On Track"))` };

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([6, 7, 9, 10].includes(c)) {
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 8) {
        cell.numFmt = '0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([1, 4, 11, 12, 13].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (c === 11 || c === 13) cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.blue } };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 23;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'ROADMAP TOTALS';
  tRow.getCell(6).value = { formula: 'SUM(F8:F22)' };
  tRow.getCell(7).value = { formula: 'SUM(G8:G22)' };
  tRow.getCell(8).value = { formula: 'AVERAGE(H8:H22)' };
  tRow.getCell(9).value = { formula: 'SUM(I8:I22)' };
  tRow.getCell(10).value = { formula: 'SUM(J8:J22)' };
  tRow.getCell(11).value = { formula: 'COUNTIF(K8:K22,"Done")&" Done"' };
  tRow.getCell(13).value = { formula: 'IF(SUM(J8:J22)<=SUM(I8:I22),"ON SCHEDULE","WATCH CAPACITY")' };

  for (let c = 1; c <= 13; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([6, 7, 9, 10].includes(c)) cell.numFmt = '#,##0';
    if (c === 8) cell.numFmt = '0.0%';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Agile-Gantt-Roadmap.xlsx'));
}

// ============================================================================
// 3. HR-Recruitment-Salary-Matrix.xlsx
// ============================================================================
async function buildHrRecruitmentSalaryMatrix() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Compensation & Hiring Matrix', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'HR RECRUITMENT PIPELINE, DEPARTMENT HEADCOUNT & COMPENSATION BAND MATRIX',
    'Role Leveling, Compa-Ratio Benchmarking, Total Rewards Cost & Hiring Pipeline Status',
    'M',
    COLORS.teal
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Total Annual Base Payroll', formula: 'SUM(H8:H21)', numFmt: '$#,##0', accentColor: COLORS.teal },
    { colStart: 'D', colEnd: 'F', label: 'Total Loaded Employer Cost', formula: 'SUM(K8:K21)', numFmt: '$#,##0', accentColor: COLORS.navy },
    { colStart: 'G', colEnd: 'I', label: 'Avg Compa-Ratio %', formula: 'AVERAGE(I8:I21)', numFmt: '0.0%', accentColor: COLORS.blue },
    { colStart: 'J', colEnd: 'K', label: 'Active Open Reqs', formula: 'COUNTIF(L8:L21,"Interviewing")+COUNTIF(L8:L21,"Offer Extended")', numFmt: '#,##0', accentColor: COLORS.amber },
    { colStart: 'L', colEnd: 'M', label: 'Filled Positions', formula: 'COUNTIF(L8:L21,"Hired / Filled")', numFmt: '#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'Req ID', 'Department', 'Role Title', 'Level', 'Band Min ($)',
    'Band Midpoint ($)', 'Band Max ($)', 'Proposed / Actual Base ($)', 'Compa-Ratio %',
    'Target Bonus ($)', 'Total Loaded Cost (+22% Tax/Ben)', 'Pipeline Stage', 'Band Alignment'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.teal);

  const roles = [
    ['REQ-401', 'Engineering', 'Staff Backend Engineer', 'L6', 165000, 185000, 205000, 188000, 0.15, 'Hired / Filled'],
    ['REQ-402', 'Engineering', 'Senior Frontend Engineer', 'L5', 140000, 158000, 176000, 155000, 0.12, 'Hired / Filled'],
    ['REQ-403', 'Engineering', 'DevOps & Cloud Architect', 'L5', 145000, 162000, 180000, 168000, 0.12, 'Offer Extended'],
    ['REQ-404', 'Product', 'Director of Product Management', 'D1', 180000, 200000, 225000, 205000, 0.20, 'Hired / Filled'],
    ['REQ-405', 'Product', 'Senior Product Designer (UX)', 'L5', 130000, 145000, 160000, 142000, 0.10, 'Interviewing'],
    ['REQ-406', 'Data & AI', 'Lead Machine Learning Scientist', 'L6', 175000, 195000, 220000, 202000, 0.15, 'Offer Extended'],
    ['REQ-407', 'Data & AI', 'Analytics Engineer (dbt/Snowflake)', 'L4', 115000, 128000, 142000, 126000, 0.10, 'Hired / Filled'],
    ['REQ-408', 'Sales & GTM', 'Enterprise Account Executive', 'L5', 120000, 135000, 150000, 135000, 0.50, 'Hired / Filled'],
    ['REQ-409', 'Sales & GTM', 'Solutions Engineering Manager', 'M1', 145000, 160000, 175000, 158000, 0.20, 'Interviewing'],
    ['REQ-410', 'Marketing', 'Head of Growth & Performance', 'D1', 160000, 178000, 195000, 176000, 0.18, 'Hired / Filled'],
    ['REQ-411', 'Marketing', 'Product Marketing Manager', 'L4', 110000, 122000, 135000, 119000, 0.10, 'Interviewing'],
    ['REQ-412', 'Customer Success', 'Enterprise CS Manager', 'L4', 98000, 110000, 122000, 108000, 0.12, 'Hired / Filled'],
    ['REQ-413', 'Finance & Ops', 'FP&A Senior Manager', 'M1', 135000, 150000, 165000, 152000, 0.15, 'Hired / Filled'],
    ['REQ-414', 'People & Talent', 'Senior Technical Recruiter', 'L4', 95000, 108000, 120000, 106000, 0.10, 'Hired / Filled']
  ];

  roles.forEach((item, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = item[0];
    row.getCell(2).value = item[1];
    row.getCell(3).value = item[2];
    row.getCell(4).value = item[3];
    row.getCell(5).value = item[4];
    row.getCell(6).value = item[5];
    row.getCell(7).value = item[6];
    row.getCell(8).value = item[7];
    row.getCell(9).value = { formula: `IF(F${r}>0, H${r}/F${r}, 0)` };
    row.getCell(10).value = { formula: `ROUND(H${r}*${item[8]}, 0)` };
    row.getCell(11).value = { formula: `ROUND((H${r}+J${r})*1.22, 0)` };
    row.getCell(12).value = item[9];
    row.getCell(13).value = { formula: `IF(H${r}>G${r},"Above Band",IF(H${r}<E${r},"Below Band","In Band"))` };

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([5, 6, 7, 8, 10, 11].includes(c)) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 9) {
        cell.numFmt = '0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([1, 4, 12, 13].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (c === 13) cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.teal } };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'HEADCOUNT TOTAL / AVG';
  tRow.getCell(5).value = { formula: 'AVERAGE(E8:E21)' };
  tRow.getCell(6).value = { formula: 'AVERAGE(F8:F21)' };
  tRow.getCell(7).value = { formula: 'AVERAGE(G8:G21)' };
  tRow.getCell(8).value = { formula: 'SUM(H8:H21)' };
  tRow.getCell(9).value = { formula: 'AVERAGE(I8:I21)' };
  tRow.getCell(10).value = { formula: 'SUM(J8:J21)' };
  tRow.getCell(11).value = { formula: 'SUM(K8:K21)' };
  tRow.getCell(12).value = { formula: 'COUNTIF(L8:L21,"Hired / Filled")&" Filled"' };
  tRow.getCell(13).value = { formula: 'IF(AVERAGE(I8:I21)<=1.05,"BAND COMPLIANT","REVIEW EQUITY")' };

  for (let c = 1; c <= 13; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([5, 6, 7, 8, 10, 11].includes(c)) cell.numFmt = '$#,##0';
    if (c === 9) cell.numFmt = '0.0%';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'HR-Recruitment-Salary-Matrix.xlsx'));
}

// ============================================================================
// 4. Marketing-KPI-ROI-Tracker.xlsx
// ============================================================================
async function buildMarketingKpiRoiTracker() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Multi-Channel ROI Tracker', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'MULTI-CHANNEL MARKETING AD SPEND, CTR, CPC, CONVERSIONS & ROAS TRACKER',
    'Performance Attribution Across Paid Search, Paid Social, Influencer & Lifecycle Channels',
    'N',
    COLORS.emerald
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Total Ad Spend', formula: 'SUM(D8:D21)', numFmt: '$#,##0', accentColor: COLORS.navy },
    { colStart: 'D', colEnd: 'F', label: 'Total Attributed Revenue', formula: 'SUM(K8:K21)', numFmt: '$#,##0', accentColor: COLORS.emerald },
    { colStart: 'G', colEnd: 'I', label: 'Blended Portfolio ROAS', formula: 'IF(SUM(D8:D21)>0,SUM(K8:K21)/SUM(D8:D21),0)', numFmt: '0.00"x"', accentColor: COLORS.blue },
    { colStart: 'J', colEnd: 'L', label: 'Blended CTR %', formula: 'IF(SUM(E8:E21)>0,SUM(F8:F21)/SUM(E8:E21),0)', numFmt: '0.00%', accentColor: COLORS.indigo },
    { colStart: 'M', colEnd: 'N', label: 'Net Ad Contribution', formula: 'SUM(M8:M21)', numFmt: '$#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'Campaign ID', 'Channel', 'Campaign Name', 'Ad Spend ($)', 'Impressions',
    'Clicks', 'CTR %', 'CPC ($)', 'Conversions', 'CPA ($)',
    'Attributed Revenue ($)', 'ROAS (x)', 'Net Contribution ($)', 'Bid Action'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.emerald);

  const campaigns = [
    ['CMP-01', 'Google Search', 'Brand Exact & High-Intent Core', 18500, 290000, 19800, 910, 104650],
    ['CMP-02', 'Google Search', 'Non-Brand Category Solution Keywords', 24000, 520000, 16400, 540, 72900],
    ['CMP-03', 'Meta Ads', 'Prospecting UGC Video Reels (Broad)', 32000, 1850000, 29600, 780, 105300],
    ['CMP-04', 'Meta Ads', 'Dynamic Product Retargeting (DPA 14d)', 14500, 620000, 13900, 610, 76250],
    ['CMP-05', 'TikTok Ads', 'Creator Spark Ads - GenZ Problem/Solution', 19000, 2400000, 31200, 490, 58800],
    ['CMP-06', 'YouTube Ads', 'In-Stream Product Demo & Mid-Roll', 16000, 980000, 11800, 310, 44950],
    ['CMP-07', 'LinkedIn Ads', 'B2B Decision Maker Lead Gen Forms', 21000, 310000, 4200, 195, 68250],
    ['CMP-08', 'Google Shopping', 'Performance Max (PMax) Best Sellers', 27500, 1420000, 25800, 845, 114075],
    ['CMP-09', 'Pinterest Ads', 'Visual Discovery Lifestyle Lookbook', 8500, 740000, 9600, 180, 22500],
    ['CMP-10', 'Influencer / Whitelist', 'Q4 Tier-1 Creator Partnership Bundle', 22000, 1150000, 21400, 620, 89900],
    ['CMP-11', 'Newsletter Sponsors', 'Niche Industry Daily Digest Sponsorship', 9500, 280000, 6900, 215, 32250],
    ['CMP-12', 'Reddit Ads', 'Subreddit Community Promoted Megathread', 6800, 610000, 8200, 110, 13200],
    ['CMP-13', 'Affiliate Network', 'Content & Review Publisher Partners', 12400, 490000, 14500, 520, 67600],
    ['CMP-14', 'SMS & Klaviyo', 'VIP Winback & Cart Abandonment Flows', 4200, 195000, 15200, 690, 82800]
  ];

  campaigns.forEach((cData, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = cData[0];
    row.getCell(2).value = cData[1];
    row.getCell(3).value = cData[2];
    row.getCell(4).value = cData[3];
    row.getCell(5).value = cData[4];
    row.getCell(6).value = cData[5];
    row.getCell(7).value = { formula: `IF(E${r}>0, F${r}/E${r}, 0)` };
    row.getCell(8).value = { formula: `IF(F${r}>0, D${r}/F${r}, 0)` };
    row.getCell(9).value = cData[6];
    row.getCell(10).value = { formula: `IF(I${r}>0, D${r}/I${r}, 0)` };
    row.getCell(11).value = cData[7];
    row.getCell(12).value = { formula: `IF(D${r}>0, K${r}/D${r}, 0)` };
    row.getCell(13).value = { formula: `K${r}-D${r}` };
    row.getCell(14).value = { formula: `IF(L${r}>=3.5,"SCALE BUDGET",IF(L${r}>=2.2,"HOLD / OPTIMIZE","TRIM SPEND"))` };

    for (let c = 1; c <= 14; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([4, 11, 13].includes(c)) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([8, 10].includes(c)) {
        cell.numFmt = '$#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([5, 6, 9].includes(c)) {
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 7) {
        cell.numFmt = '0.00%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 12) {
        cell.numFmt = '0.00"x"';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 14) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.emerald } };
      } else {
        cell.alignment = { horizontal: c === 1 ? 'center' : 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'TOTAL / BLENDED';
  tRow.getCell(4).value = { formula: 'SUM(D8:D21)' };
  tRow.getCell(5).value = { formula: 'SUM(E8:E21)' };
  tRow.getCell(6).value = { formula: 'SUM(F8:F21)' };
  tRow.getCell(7).value = { formula: 'IF(E22>0, F22/E22, 0)' };
  tRow.getCell(8).value = { formula: 'IF(F22>0, D22/F22, 0)' };
  tRow.getCell(9).value = { formula: 'SUM(I8:I21)' };
  tRow.getCell(10).value = { formula: 'IF(I22>0, D22/I22, 0)' };
  tRow.getCell(11).value = { formula: 'SUM(K8:K21)' };
  tRow.getCell(12).value = { formula: 'IF(D22>0, K22/D22, 0)' };
  tRow.getCell(13).value = { formula: 'SUM(M8:M21)' };
  tRow.getCell(14).value = { formula: 'IF(L22>=3,"HIGH ROI","MONITOR")' };

  for (let c = 1; c <= 14; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([4, 11, 13].includes(c)) cell.numFmt = '$#,##0';
    if ([8, 10].includes(c)) cell.numFmt = '$#,##0.00';
    if ([5, 6, 9].includes(c)) cell.numFmt = '#,##0';
    if (c === 7) cell.numFmt = '0.00%';
    if (c === 12) cell.numFmt = '0.00"x"';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Marketing-KPI-ROI-Tracker.xlsx'));
}

// ============================================================================
// 5. Recipe-Margin-Calculator.xlsx
// ============================================================================
async function buildRecipeMarginCalculator() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Menu & Recipe Engineering', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'RESTAURANT & CAFE RECIPE COSTING, PORTION YIELD & MENU ENGINEERING MATRIX',
    'Ingredient Portion Cost, Prep Waste Allowance, Target Food Cost % & Menu Contribution Margin',
    'M',
    COLORS.amber
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Avg Menu Selling Price', formula: 'AVERAGE(I8:I21)', numFmt: '$#,##0.00', accentColor: COLORS.navy },
    { colStart: 'D', colEnd: 'F', label: 'Avg Total Plate Cost', formula: 'AVERAGE(H8:H21)', numFmt: '$#,##0.00', accentColor: COLORS.amber },
    { colStart: 'G', colEnd: 'I', label: 'Actual Food Cost %', formula: 'AVERAGE(J8:J21)', numFmt: '0.0%', accentColor: COLORS.emerald },
    { colStart: 'J', colEnd: 'K', label: 'Total Monthly Gross Profit', formula: 'SUM(L8:L21)', numFmt: '$#,##0', accentColor: COLORS.blue },
    { colStart: 'L', colEnd: 'M', label: 'High-Margin Star Dishes', formula: 'COUNTIF(M8:M21,"STAR - PROMOTE")', numFmt: '#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'Recipe Code', 'Menu Category', 'Dish / Beverage Name', 'Raw Ingredient Cost ($)', 'Prep Waste & Trim (6%)',
    'Packaging / Garnish ($)', 'Total Portion Cost ($)', 'Suggested Price (28% FC)', 'Actual Menu Price ($)',
    'Food Cost %', 'Unit Contribution ($)', 'Monthly Profit (Est. Vol)', 'Menu Matrix Class'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.amber);

  const dishes = [
    ['RCP-01', 'Artisan Mains', 'Truffle Wagyu Smash Burger & Brioche', 4.65, 0.55, 19.50, 620],
    ['RCP-02', 'Artisan Mains', 'Pan-Seared Atlantic Salmon & Quinoa', 6.40, 0.60, 26.00, 410],
    ['RCP-03', 'Artisan Mains', 'Wild Mushroom & Burrata Fresh Tagliatelle', 3.55, 0.45, 21.00, 540],
    ['RCP-04', 'Wood-Fired Pizza', 'Diavola Hot Honey & Calabrian Salami', 3.10, 0.50, 18.50, 780],
    ['RCP-05', 'Wood-Fired Pizza', 'San Marzano Margherita & Fresh Basil', 2.35, 0.45, 16.00, 890],
    ['RCP-06', 'All-Day Brunch', 'Smoked Salmon & Avocado Poached Sourdough', 3.90, 0.40, 17.50, 670],
    ['RCP-07', 'All-Day Brunch', 'Brioche French Toast & Pistachio Mascarpone', 2.80, 0.35, 15.50, 530],
    ['RCP-08', 'Bowls & Salads', 'Crispy Harvest Kale, Halloumi & Tahini Bowl', 3.15, 0.45, 16.50, 610],
    ['RCP-09', 'Shareable Starters', 'Crispy Calamari with Yuzu Aioli', 3.60, 0.35, 15.00, 490],
    ['RCP-10', 'Shareable Starters', 'Whipped Feta, Roasted Grapes & Flatbread', 2.20, 0.30, 13.50, 580],
    ['RCP-11', 'Specialty Coffee', 'Iced Ceremonial Matcha Oat Latte (16oz)', 1.25, 0.32, 6.75, 1450],
    ['RCP-12', 'Specialty Coffee', 'Single-Origin Spanish Cortado & Foam', 0.92, 0.28, 5.75, 1620],
    ['RCP-13', 'Signature Cocktails', 'Smoked Rosemary Mezcal Paloma', 2.45, 0.25, 15.00, 720],
    ['RCP-14', 'Pastry & Dessert', 'Basque Burnt Cheesecake with Berry Compote', 1.95, 0.30, 11.50, 460]
  ];

  dishes.forEach((d, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = d[0];
    row.getCell(2).value = d[1];
    row.getCell(3).value = d[2];
    row.getCell(4).value = d[3];
    row.getCell(5).value = { formula: `ROUND(D${r}*0.06, 2)` };
    row.getCell(6).value = d[4];
    row.getCell(7).value = { formula: `SUM(D${r}:F${r})` };
    row.getCell(8).value = { formula: `ROUND(G${r}/0.28, 2)` };
    row.getCell(9).value = d[5];
    row.getCell(10).value = { formula: `IF(I${r}>0, G${r}/I${r}, 0)` };
    row.getCell(11).value = { formula: `I${r}-G${r}` };
    row.getCell(12).value = { formula: `ROUND(K${r}*${d[6]}, 0)` };
    row.getCell(13).value = { formula: `IF(J${r}<=0.28,"STAR - PROMOTE",IF(J${r}<=0.33,"PLOWHORSE - HOLD","PUZZLE - REPRICE"))` };

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([4, 5, 6, 7, 8, 9, 11].includes(c)) {
        cell.numFmt = '$#,##0.00';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 12) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 10) {
        cell.numFmt = '0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 13) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.amber } };
      } else {
        cell.alignment = { horizontal: c === 1 ? 'center' : 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'MENU AVERAGES / TOTAL';
  tRow.getCell(4).value = { formula: 'AVERAGE(D8:D21)' };
  tRow.getCell(5).value = { formula: 'AVERAGE(E8:E21)' };
  tRow.getCell(6).value = { formula: 'AVERAGE(F8:F21)' };
  tRow.getCell(7).value = { formula: 'AVERAGE(G8:G21)' };
  tRow.getCell(8).value = { formula: 'AVERAGE(H8:H21)' };
  tRow.getCell(9).value = { formula: 'AVERAGE(I8:I21)' };
  tRow.getCell(10).value = { formula: 'AVERAGE(J8:J21)' };
  tRow.getCell(11).value = { formula: 'AVERAGE(K8:K21)' };
  tRow.getCell(12).value = { formula: 'SUM(L8:L21)' };
  tRow.getCell(13).value = { formula: 'IF(AVERAGE(J8:J21)<=0.28,"TARGET MET","REVIEW PORTIONS")' };

  for (let c = 1; c <= 13; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([4, 5, 6, 7, 8, 9, 11].includes(c)) cell.numFmt = '$#,##0.00';
    if (c === 12) cell.numFmt = '$#,##0';
    if (c === 10) cell.numFmt = '0.0%';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Recipe-Margin-Calculator.xlsx'));
}

// ============================================================================
// 6. Agency-Capacity-Tracker.xlsx
// ============================================================================
async function buildAgencyCapacityTracker() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Agency Capacity & Margin', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'AGENCY CLIENT RETAINER CAPACITY, TEAM UTILIZATION & PROFITABILITY TRACKER',
    'Billable vs Non-Billable Hours, Utilization Rate %, Effective Hourly Rate & Client Delivery Margin',
    'M',
    COLORS.navy
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Total Monthly Retainer Rev', formula: 'SUM(I8:I21)', numFmt: '$#,##0', accentColor: COLORS.navy },
    { colStart: 'D', colEnd: 'F', label: 'Team Billable Utilization %', formula: 'AVERAGE(G8:G21)', numFmt: '0.0%', accentColor: COLORS.blue },
    { colStart: 'G', colEnd: 'I', label: 'Total Agency Gross Profit', formula: 'SUM(K8:K21)', numFmt: '$#,##0', accentColor: COLORS.emerald },
    { colStart: 'J', colEnd: 'K', label: 'Avg Delivery Margin %', formula: 'AVERAGE(L8:L21)', numFmt: '0.0%', accentColor: COLORS.indigo },
    { colStart: 'L', colEnd: 'M', label: 'Optimal Utilization Staff', formula: 'COUNTIF(M8:M21,"OPTIMAL BAND")', numFmt: '#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'Staff ID', 'Team Member', 'Practice Area', 'Monthly Capacity (Hrs)', 'Billable Client Hrs',
    'Internal / Bench Hrs', 'Utilization Rate %', 'Blended Bill Rate ($/Hr)', 'Billed Revenue ($)',
    'Fully Loaded Cost ($)', 'Net Margin ($)', 'Profit Margin %', 'Capacity Status'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.navy);

  const staff = [
    ['EMP-01', 'Elena Rostova', 'Strategy & Advisory', 160, 134, 195, 11800],
    ['EMP-02', 'Marcus Vance', 'Paid Media & ROAS', 160, 142, 165, 9600],
    ['EMP-03', 'Chloe Lindqvist', 'Brand & UI/UX Design', 160, 138, 160, 9200],
    ['EMP-04', 'Tariq Al-Mansoor', 'Full-Stack Web Dev', 160, 146, 175, 10800],
    ['EMP-05', 'Hannah Abbott', 'Lifecycle & CRM Ops', 160, 128, 150, 8600],
    ['EMP-06', 'Devon Brooks', 'Paid Social & Creative', 160, 152, 155, 8900],
    ['EMP-07', 'Sofia Mendoza', 'SEO & Content Studio', 160, 132, 145, 8200],
    ['EMP-08', 'Liam O\'Connor', 'Analytics & Attribution', 160, 136, 180, 10500],
    ['EMP-09', 'Nadia Kouri', 'Client Account Director', 160, 124, 185, 11200],
    ['EMP-10', 'Lucas Meyer', 'Webflow & Shopify Dev', 160, 140, 165, 9400],
    ['EMP-11', 'Grace Takahashi', 'Motion & Video Editor', 160, 116, 140, 7900],
    ['EMP-12', 'Julian Sterling', 'CRO & Landing Pages', 160, 135, 170, 9800],
    ['EMP-13', 'Amara Okafor', 'Account Manager', 160, 130, 145, 8100],
    ['EMP-14', 'Ryan Kowalski', 'AI Automation Architect', 160, 144, 190, 11500]
  ];

  staff.forEach((m, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = m[0];
    row.getCell(2).value = m[1];
    row.getCell(3).value = m[2];
    row.getCell(4).value = m[3];
    row.getCell(5).value = m[4];
    row.getCell(6).value = { formula: `D${r}-E${r}` };
    row.getCell(7).value = { formula: `IF(D${r}>0, E${r}/D${r}, 0)` };
    row.getCell(8).value = m[5];
    row.getCell(9).value = { formula: `E${r}*H${r}` };
    row.getCell(10).value = m[6];
    row.getCell(11).value = { formula: `I${r}-J${r}` };
    row.getCell(12).value = { formula: `IF(I${r}>0, K${r}/I${r}, 0)` };
    row.getCell(13).value = { formula: `IF(G${r}>0.90,"BURNOUT RISK",IF(G${r}>=0.78,"OPTIMAL BAND","ADD CLIENT LOAD"))` };

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([4, 5, 6].includes(c)) {
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([8, 9, 10, 11].includes(c)) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([7, 12].includes(c)) {
        cell.numFmt = '0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 13) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.blue } };
      } else {
        cell.alignment = { horizontal: c === 1 ? 'center' : 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'AGENCY TOTAL / AVG';
  tRow.getCell(4).value = { formula: 'SUM(D8:D21)' };
  tRow.getCell(5).value = { formula: 'SUM(E8:E21)' };
  tRow.getCell(6).value = { formula: 'SUM(F8:F21)' };
  tRow.getCell(7).value = { formula: 'AVERAGE(G8:G21)' };
  tRow.getCell(8).value = { formula: 'AVERAGE(H8:H21)' };
  tRow.getCell(9).value = { formula: 'SUM(I8:I21)' };
  tRow.getCell(10).value = { formula: 'SUM(J8:J21)' };
  tRow.getCell(11).value = { formula: 'SUM(K8:K21)' };
  tRow.getCell(12).value = { formula: 'IF(I22>0, K22/I22, 0)' };
  tRow.getCell(13).value = { formula: 'IF(L22>=0.5,"HIGH PROFITABILITY","REVIEW RATES")' };

  for (let c = 1; c <= 13; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([4, 5, 6].includes(c)) cell.numFmt = '#,##0';
    if ([8, 9, 10, 11].includes(c)) cell.numFmt = '$#,##0';
    if ([7, 12].includes(c)) cell.numFmt = '0.0%';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Agency-Capacity-Tracker.xlsx'));
}

// ============================================================================
// 7. Renovation-Cost-Estimator.xlsx
// ============================================================================
async function buildRenovationCostEstimator() {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Renovation Budget & Variance', { views: [{ state: 'frozen', ySplit: 7 }] });

  setupTitleBanner(
    ws,
    'HOME REMODEL & CONSTRUCTION ROOM-BY-ROOM LABOR, MATERIALS & VARIANCE TRACKER',
    'Contractor Trade Estimates, 10% Contingency Reserve, Actual Spend & Budget Variance Control',
    'M',
    COLORS.rose
  );

  addKpiCards(ws, [
    { colStart: 'A', colEnd: 'C', label: 'Total Approved Budget', formula: 'SUM(H8:H21)', numFmt: '$#,##0', accentColor: COLORS.navy },
    { colStart: 'D', colEnd: 'F', label: 'Total Actual Spend to Date', formula: 'SUM(I8:I21)', numFmt: '$#,##0', accentColor: COLORS.blue },
    { colStart: 'G', colEnd: 'I', label: 'Total Contingency Reserve', formula: 'SUM(G8:G21)', numFmt: '$#,##0', accentColor: COLORS.amber },
    { colStart: 'J', colEnd: 'K', label: 'Net Budget Variance ($)', formula: 'SUM(J8:J21)', numFmt: '$#,##0', accentColor: COLORS.emerald },
    { colStart: 'L', colEnd: 'M', label: 'Scopes Under/On Budget', formula: 'COUNTIF(M8:M21,"UNDER / ON BUDGET")', numFmt: '#,##0', accentColor: COLORS.emerald }
  ]);

  const headers = [
    'Scope ID', 'Room / Zone', 'Trade & Work Package', 'Contractor / Vendor', 'Materials Est ($)',
    'Labor Est ($)', 'Contingency (10%)', 'Total Approved Budget ($)', 'Actual Spend ($)',
    'Variance ($ Saved/Over)', 'Variance %', 'Completion Stage', 'Budget Status'
  ];
  styleHeaderRow(ws, 7, headers, COLORS.rose);

  const scopes = [
    ['RNV-01', 'Site & Demo', 'Architectural Plans, Permits & Interior Demo', 'Apex Structural', 3200, 6800, 10400, '100% Complete'],
    ['RNV-02', 'Chef Kitchen', 'Custom White Oak Cabinetry & Soft-Close Millwork', 'Nordic Millworks', 16500, 7200, 25400, '100% Complete'],
    ['RNV-03', 'Chef Kitchen', 'Calacatta Quartz Countertops & Waterfall Island', 'StoneCraft Lab', 7800, 3400, 11900, '100% Complete'],
    ['RNV-04', 'Chef Kitchen', 'Pro-Grade Induction Range, Hood & Panel Fridge', 'Luxe Appliances', 12400, 1800, 14800, '100% Complete'],
    ['RNV-05', 'Primary Suite Bath', 'Frameless Glass Wet-Room, Freestanding Tub & Tile', 'Oasis Bath Co.', 8900, 9400, 19600, '90% In Progress'],
    ['RNV-06', 'Primary Suite Bath', 'Floating Double Vanity, Brushed Brass Fixtures', 'Oasis Bath Co.', 4600, 2900, 8100, '100% Complete'],
    ['RNV-07', 'Whole House Flooring', 'Wide-Plank European White Oak Hardwood & Leveling', 'Timberline Floors', 11200, 6800, 19200, '100% Complete'],
    ['RNV-08', 'Electrical & Lighting', '200A Panel Upgrade, Recessed LEDs & Smart Dimmers', 'VoltMaster Electric', 4800, 7500, 13400, '100% Complete'],
    ['RNV-09', 'Plumbing & MEP', 'PEX Repipe, Tankless Water Heater & Rough-Ins', 'ClearFlow Plumbing', 4200, 6400, 11800, '100% Complete'],
    ['RNV-10', 'HVAC & Climate', 'High-Efficiency Heat Pump & Smart Zoning Ductwork', 'AeroClimate Systems', 7900, 5600, 14500, '80% In Progress'],
    ['RNV-11', 'Living & Dining', 'Drywall Skim Coat, Acoustic Insulation & Paint', 'Precision Finishes', 2900, 6200, 9600, '75% In Progress'],
    ['RNV-12', 'Windows & Doors', 'Low-E Black Aluminum Casement Windows & Bi-Fold', 'Vista Glazing', 13500, 5200, 20100, '100% Complete'],
    ['RNV-13', 'Guest Powder Room', 'Herringbone Mosaic Wall, Pedestal Sink & Sconces', 'Oasis Bath Co.', 2600, 2800, 5800, '60% In Progress'],
    ['RNV-14', 'Exterior & Deck', 'Composite Cedar Decking, Pergola & Landscape LED', 'Evergreen Outdoor', 8400, 6100, 15200, '40% In Progress']
  ];

  scopes.forEach((sc, idx) => {
    const r = 8 + idx;
    const row = ws.getRow(r);
    row.height = 20;
    const bg = idx % 2 === 1 ? COLORS.zebraBg : COLORS.white;

    row.getCell(1).value = sc[0];
    row.getCell(2).value = sc[1];
    row.getCell(3).value = sc[2];
    row.getCell(4).value = sc[3];
    row.getCell(5).value = sc[4];
    row.getCell(6).value = sc[5];
    row.getCell(7).value = { formula: `ROUND((E${r}+F${r})*0.10, 0)` };
    row.getCell(8).value = { formula: `SUM(E${r}:G${r})` };
    row.getCell(9).value = sc[6];
    row.getCell(10).value = { formula: `H${r}-I${r}` };
    row.getCell(11).value = { formula: `IF(H${r}>0, J${r}/H${r}, 0)` };
    row.getCell(12).value = sc[7];
    row.getCell(13).value = { formula: `IF(J${r}>=0,"UNDER / ON BUDGET","OVER BUDGET")` };

    for (let c = 1; c <= 13; c++) {
      const cell = row.getCell(c);
      cell.font = { name: 'Segoe UI', size: 10, color: { argb: COLORS.textDark } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.border = thinBorder;
      if ([5, 6, 7, 8, 9, 10].includes(c)) {
        cell.numFmt = '$#,##0';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (c === 11) {
        cell.numFmt = '+0.0%;-0.0%;0.0%';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if ([1, 12, 13].includes(c)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        if (c === 13) cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: COLORS.rose } };
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    }
  });

  const tr = 22;
  const tRow = ws.getRow(tr);
  tRow.height = 24;
  tRow.getCell(1).value = 'PROJECT TOTALS';
  tRow.getCell(5).value = { formula: 'SUM(E8:E21)' };
  tRow.getCell(6).value = { formula: 'SUM(F8:F21)' };
  tRow.getCell(7).value = { formula: 'SUM(G8:G21)' };
  tRow.getCell(8).value = { formula: 'SUM(H8:H21)' };
  tRow.getCell(9).value = { formula: 'SUM(I8:I21)' };
  tRow.getCell(10).value = { formula: 'SUM(J8:J21)' };
  tRow.getCell(11).value = { formula: 'IF(H22>0, J22/H22, 0)' };
  tRow.getCell(12).value = 'ACTIVE REMODEL';
  tRow.getCell(13).value = { formula: 'IF(J22>=0,"WITHIN CONTINGENCY","OVERRUN ALERT")' };

  for (let c = 1; c <= 13; c++) {
    const cell = tRow.getCell(c);
    cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: COLORS.navy } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.kpiBg } };
    cell.border = doubleBottomBorder;
    if ([5, 6, 7, 8, 9, 10].includes(c)) cell.numFmt = '$#,##0';
    if (c === 11) cell.numFmt = '+0.0%;-0.0%;0.0%';
  }

  autoSizeColumns(ws);
  await wb.xlsx.writeFile(path.join(outDir, 'Renovation-Cost-Estimator.xlsx'));
}

async function main() {
  console.log('Generating Agent 2 E-Commerce, Operations, HR & PM Excel templates...');
  await buildEcommerceRoasPricing();
  await buildAgileGanttRoadmap();
  await buildHrRecruitmentSalaryMatrix();
  await buildMarketingKpiRoiTracker();
  await buildRecipeMarginCalculator();
  await buildAgencyCapacityTracker();
  await buildRenovationCostEstimator();
  console.log('All 7 Excel workbooks generated successfully in:', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
