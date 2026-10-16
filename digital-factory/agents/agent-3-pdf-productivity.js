const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'downloads', 'planners');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const THEMES = {
  ocean: {
    name: 'Ocean Edition',
    primary: '#0284c7',
    secondary: '#0369a1',
    accent: '#38bdf8',
    bgLight: '#f0f9ff',
    zebra: '#f8fafc',
    border: '#bae6fd',
    textDark: '#0f172a',
    textMuted: '#475569'
  },
  sage: {
    name: 'Sage Edition',
    primary: '#0f9d58',
    secondary: '#0b8043',
    accent: '#34a853',
    bgLight: '#f0fdf4',
    zebra: '#f8fafc',
    border: '#bbf7d0',
    textDark: '#0f172a',
    textMuted: '#475569'
  },
  rose: {
    name: 'Rose Edition',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#fb7185',
    bgLight: '#fff1f2',
    zebra: '#f8fafc',
    border: '#fecdd3',
    textDark: '#0f172a',
    textMuted: '#475569'
  }
};

const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const MARGIN = 36;
const CONTENT_W = PAGE_W - MARGIN * 2;

function drawHeader(doc, theme, title, subtitle, pageNum, totalPages) {
  // Top Banner
  doc.save();
  doc.rect(0, 0, PAGE_W, 64).fill(theme.primary);
  doc.rect(0, 60, PAGE_W, 4).fill(theme.secondary);

  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(16)
     .text(title.toUpperCase(), MARGIN, 18, { width: CONTENT_W - 140, lineBreak: false });
  doc.fillColor('#ffffff').font('Helvetica').fontSize(9)
     .text(subtitle, MARGIN, 39, { width: CONTENT_W - 140, lineBreak: false });

  // Date / Theme Badge on Right
  doc.roundedRect(PAGE_W - MARGIN - 130, 16, 130, 32, 4).fill(theme.secondary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
     .text('DATE: ____ / ____ / 202__', PAGE_W - MARGIN - 122, 23, { lineBreak: false });
  doc.fillColor('#e2e8f0').font('Helvetica').fontSize(7.5)
     .text(`${theme.name} • Day ___`, PAGE_W - MARGIN - 122, 35, { lineBreak: false });
  doc.restore();
}

function drawFooter(doc, theme, pageNum, totalPages, docTitle) {
  doc.save();
  const footerY = PAGE_H - 28;
  doc.moveTo(MARGIN, footerY - 6).lineTo(PAGE_W - MARGIN, footerY - 6)
     .lineWidth(0.75).strokeColor(theme.border).stroke();

  doc.fillColor(theme.textMuted).font('Helvetica').fontSize(8)
     .text(`${docTitle} (${theme.name})`, MARGIN, footerY, { lineBreak: false });

  const rightText = `Page ${pageNum} of ${totalPages} • BizTools Executive Collection`;
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
     .text(rightText, MARGIN, footerY, { width: CONTENT_W, align: 'right', lineBreak: false });
  doc.restore();
}

function drawSectionBox(doc, theme, x, y, w, h, title) {
  doc.save();
  doc.roundedRect(x, y, w, h, 4).lineWidth(1).strokeColor(theme.border).fillAndStroke('#ffffff', theme.border);
  doc.roundedRect(x, y, w, 22, 4).fill(theme.bgLight);
  doc.rect(x, y + 18, w, 4).fill(theme.bgLight);
  doc.moveTo(x, y + 22).lineTo(x + w, y + 22).lineWidth(0.75).strokeColor(theme.border).stroke();
  doc.rect(x, y, 4, 22).fill(theme.primary);
  doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(9.5)
     .text(title.toUpperCase(), x + 10, y + 6, { width: w - 16, lineBreak: false });
  doc.restore();
}

function drawCheckboxLine(doc, theme, x, y, w, rowH, isZebra = false, label = '') {
  doc.save();
  if (isZebra) {
    doc.rect(x + 1, y, w - 2, rowH).fill(theme.zebra);
  }
  const boxSize = 9;
  const boxY = y + (rowH - boxSize) / 2;
  doc.roundedRect(x + 8, boxY, boxSize, boxSize, 1.5).lineWidth(0.8).strokeColor(theme.primary).stroke();
  if (label) {
    doc.fillColor(theme.textMuted).font('Helvetica').fontSize(8)
       .text(label, x + 22, y + (rowH - 8) / 2, { lineBreak: false });
  }
  doc.moveTo(x + 22, y + rowH - 3).lineTo(x + w - 8, y + rowH - 3)
     .lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  doc.restore();
}

function drawRuledLines(doc, theme, x, y, w, numLines, rowH) {
  doc.save();
  for (let i = 0; i < numLines; i++) {
    const curY = y + i * rowH;
    if (i % 2 === 1) {
      doc.rect(x + 1, curY, w - 2, rowH).fill(theme.zebra);
    }
    doc.moveTo(x + 8, curY + rowH - 2).lineTo(x + w - 8, curY + rowH - 2)
       .lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  }
  doc.restore();
}

// ============================================================================
// 1. ADHD Focus Planner (20 Pages)
// ============================================================================
function renderADHDFocusPage(doc, theme, pageNum, totalPages) {
  drawHeader(doc, theme, 'ADHD Focus & Executive Function Planner', 'Neuro-Inclusive Daily Structure • Dopamine Menu • Time-Blindness Anchors', pageNum, totalPages);

  const topY = 78;
  const colGap = 12;
  const leftW = 245;
  const rightW = CONTENT_W - leftW - colGap;
  const rightX = MARGIN + leftW + colGap;

  // Box 1: Energy & Sensory Check-in (Top Left)
  drawSectionBox(doc, theme, MARGIN, topY, leftW, 118, '1. Energy & Sensory Check-In');
  const checkLabels = [
    'Battery Level:  [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]',
    'Focus State:   [ Hyper ] [ Scattered ] [ Steady ]',
    'Sensory Need:  [ Quiet ] [ Lo-Fi/Brown Noise ]',
    'Body Check:    [ Hydrated ] [ Fed ] [ Meds/Vits ]',
    'Overwhelm Trigger Today: _____________________'
  ];
  checkLabels.forEach((lbl, idx) => {
    const ry = topY + 26 + idx * 17.5;
    if (idx % 2 === 1) doc.rect(MARGIN + 2, ry - 2, leftW - 4, 17).fill(theme.zebra);
    doc.fillColor(theme.textDark).font('Helvetica').fontSize(8)
       .text(lbl, MARGIN + 8, ry + 2, { lineBreak: false });
  });

  // Box 2: Top 3 Micro-Steps (Top Right)
  drawSectionBox(doc, theme, rightX, topY, rightW, 118, '2. Top 3 Priority Tasks & Micro-Steps');
  for (let t = 0; t < 3; t++) {
    const ty = topY + 26 + t * 30;
    if (t % 2 === 1) doc.rect(rightX + 2, ty - 2, rightW - 4, 29).fill(theme.zebra);
    doc.roundedRect(rightX + 8, ty + 2, 14, 14, 3).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5)
       .text(`${t + 1}`, rightX + 12.5, ty + 5, { lineBreak: false });
    doc.fillColor(theme.textDark).font('Helvetica-Bold').fontSize(8)
       .text('Main Task:', rightX + 28, ty + 2, { lineBreak: false });
    doc.moveTo(rightX + 75, ty + 11).lineTo(rightX + rightW - 8, ty + 11).lineWidth(0.5).strokeColor('#94a3b8').stroke();
    doc.fillColor(theme.textMuted).font('Helvetica').fontSize(7.5)
       .text('2-Min Starter Step:', rightX + 28, ty + 15, { lineBreak: false });
    doc.moveTo(rightX + 105, ty + 23).lineTo(rightX + rightW - 8, ty + 23).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  }

  // Box 3: Dopamine Menu (Middle Left)
  const midY = topY + 128;
  drawSectionBox(doc, theme, MARGIN, midY, leftW, 210, '3. Dopamine Menu (Recharge)');
  const menuCats = [
    { cat: 'APPETIZERS (2-5 Min Quick Boost)', rows: 2 },
    { cat: 'ENTREES (15-30 Min Restorative)', rows: 2 },
    { cat: 'SIDES (Pair with Boring Tasks)', rows: 2 },
    { cat: 'DESSERTS (Use Mindfully / Timed)', rows: 2 }
  ];
  let curMenuY = midY + 26;
  menuCats.forEach((m) => {
    doc.rect(MARGIN + 4, curMenuY, leftW - 8, 13).fill(theme.bgLight);
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
       .text(m.cat, MARGIN + 8, curMenuY + 3, { lineBreak: false });
    curMenuY += 14;
    for (let r = 0; r < m.rows; r++) {
      drawCheckboxLine(doc, theme, MARGIN, curMenuY, leftW, 15, r % 2 === 1);
      curMenuY += 15;
    }
    curMenuY += 2;
  });

  // Box 4: Time-Blindness Visual Anchors (Middle Right)
  drawSectionBox(doc, theme, rightX, midY, rightW, 210, '4. Time-Blindness Visual Anchors');
  const timeBlocks = [
    '08:00 - 10:00  Morning Launch & Anchor',
    '10:00 - 12:00  High-Focus Sprint Block',
    '12:00 - 14:00  Midday Reset & Fuel',
    '14:00 - 16:00  Collaborative / Admin Zone',
    '16:00 - 18:00  Wrap-Up & Transition Ritual',
    '18:00 - 20:00  Evening Wind-Down & Rest'
  ];
  timeBlocks.forEach((tb, idx) => {
    const by = midY + 28 + idx * 29;
    if (idx % 2 === 1) doc.rect(rightX + 2, by - 2, rightW - 4, 28).fill(theme.zebra);
    doc.roundedRect(rightX + 8, by + 2, 10, 10, 2).lineWidth(0.9).strokeColor(theme.primary).stroke();
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(8)
       .text(tb.slice(0, 13), rightX + 23, by + 3, { lineBreak: false });
    doc.fillColor(theme.textMuted).font('Helvetica').fontSize(7.5)
       .text(tb.slice(14), rightX + 92, by + 3, { lineBreak: false });
    doc.moveTo(rightX + 23, by + 21).lineTo(rightX + rightW - 8, by + 21).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  });

  // Box 5: Brain Dump Grid (Bottom Full Width)
  const botY = midY + 220;
  const botH = PAGE_H - botY - 40;
  drawSectionBox(doc, theme, MARGIN, botY, CONTENT_W, botH, '5. Unfiltered Brain Dump Grid & Parking Lot (Get It Out of Your Head)');

  const halfW = (CONTENT_W - 16) / 2;
  doc.fillColor(theme.textMuted).font('Helvetica-Bold').fontSize(8)
     .text('URGENT THOUGHTS / TO-DO LATER', MARGIN + 10, botY + 28, { lineBreak: false })
     .text('RANDOM IDEAS / RABBIT HOLES TO PARK', MARGIN + 14 + halfW, botY + 28, { lineBreak: false });

  const dumpRows = Math.floor((botH - 46) / 18);
  for (let r = 0; r < dumpRows; r++) {
    const ry = botY + 42 + r * 18;
    drawCheckboxLine(doc, theme, MARGIN + 4, ry, halfW, 18, r % 2 === 1);
    drawCheckboxLine(doc, theme, MARGIN + 8 + halfW, ry, halfW, 18, r % 2 === 1);
  }

  drawFooter(doc, theme, pageNum, totalPages, 'ADHD Focus Planner');
}

// ============================================================================
// 2. CEO OKR Blueprint (16 Pages)
// ============================================================================
function renderCEOOKRPage(doc, theme, pageNum, totalPages) {
  drawHeader(doc, theme, 'CEO Quarterly OKR & Execution Blueprint', 'North Star Strategy • Key Result Scorecards • Bottleneck Resolver • Delegation Matrix', pageNum, totalPages);

  const topY = 76;
  // Section 1: Quarterly North Star Vision
  drawSectionBox(doc, theme, MARGIN, topY, CONTENT_W, 74, '1. Quarterly North Star Vision & Executive Thesis');
  doc.fillColor(theme.textMuted).font('Helvetica-Bold').fontSize(8)
     .text('NORTH STAR METRIC:', MARGIN + 10, topY + 28, { lineBreak: false })
     .text('TARGET:', MARGIN + 280, topY + 28, { lineBreak: false })
     .text('DEADLINE:', MARGIN + 410, topY + 28, { lineBreak: false });
  doc.moveTo(MARGIN + 105, topY + 37).lineTo(MARGIN + 270, topY + 37).lineWidth(0.6).strokeColor(theme.primary).stroke();
  doc.moveTo(MARGIN + 322, topY + 37).lineTo(MARGIN + 400, topY + 37).lineWidth(0.6).strokeColor(theme.primary).stroke();
  doc.moveTo(MARGIN + 462, topY + 37).lineTo(MARGIN + CONTENT_W - 10, topY + 37).lineWidth(0.6).strokeColor(theme.primary).stroke();

  doc.fillColor(theme.textMuted).font('Helvetica-Bold').fontSize(8)
     .text('STRATEGIC THESIS:', MARGIN + 10, topY + 50, { lineBreak: false });
  doc.moveTo(MARGIN + 100, topY + 59).lineTo(MARGIN + CONTENT_W - 10, topY + 59).lineWidth(0.6).strokeColor('#cbd5e1').stroke();

  // Section 2: 4 OKR Scorecards (2x2 Grid)
  const okrTop = topY + 84;
  const cardW = (CONTENT_W - 12) / 2;
  const cardH = 158;

  for (let idx = 0; idx < 4; idx++) {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = MARGIN + col * (cardW + 12);
    const cy = okrTop + row * (cardH + 10);

    drawSectionBox(doc, theme, cx, cy, cardW, cardH, `Objective 0${idx + 1} Scorecard`);
    doc.fillColor(theme.textDark).font('Helvetica-Bold').fontSize(8)
       .text('Objective:', cx + 8, cy + 27, { lineBreak: false })
       .text('Conf: ___/10', cx + cardW - 62, cy + 27, { lineBreak: false });
    doc.moveTo(cx + 52, cy + 36).lineTo(cx + cardW - 68, cy + 36).lineWidth(0.6).strokeColor('#94a3b8').stroke();

    // Table header for Key Results
    const thY = cy + 43;
    doc.rect(cx + 4, thY, cardW - 8, 14).fill(theme.bgLight);
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
       .text('KEY RESULT (MEASURABLE OUTCOME)', cx + 8, thY + 3.5, { lineBreak: false })
       .text('TARGET', cx + cardW - 78, thY + 3.5, { lineBreak: false })
       .text('SCORE', cx + cardW - 38, thY + 3.5, { lineBreak: false });

    for (let kr = 0; kr < 4; kr++) {
      const kry = thY + 16 + kr * 23;
      if (kr % 2 === 1) doc.rect(cx + 4, kry, cardW - 8, 22).fill(theme.zebra);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(7.5)
         .text(`KR${kr + 1}`, cx + 8, kry + 6, { lineBreak: false });
      doc.moveTo(cx + 28, kry + 16).lineTo(cx + cardW - 82, kry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
      doc.roundedRect(cx + cardW - 76, kry + 4, 34, 14, 2).lineWidth(0.5).strokeColor(theme.border).stroke();
      doc.roundedRect(cx + cardW - 38, kry + 4, 30, 14, 2).lineWidth(0.5).strokeColor(theme.primary).stroke();
    }
  }

  // Section 3: Bottom Split — Weekly Executive Bottleneck Resolver & Delegation Matrix
  const botY = okrTop + (cardH + 10) * 2 + 2;
  const botH = PAGE_H - botY - 38;

  // Left: Weekly Executive Bottleneck Resolver
  drawSectionBox(doc, theme, MARGIN, botY, cardW, botH, '3. Executive Bottleneck Resolver');
  const bPrompts = [
    'Critical Constraint Slowing Growth:',
    'Root Cause (People / Process / Tech):',
    'Immediate Lever to Unblock Today:',
    'Owner Accountable for Resolution:',
    'Verification Metric & Check-In Date:'
  ];
  const bpRowH = Math.floor((botH - 30) / bPrompts.length);
  bPrompts.forEach((p, i) => {
    const py = botY + 26 + i * bpRowH;
    if (i % 2 === 1) doc.rect(MARGIN + 2, py, cardW - 4, bpRowH).fill(theme.zebra);
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
       .text(p, MARGIN + 8, py + 4, { lineBreak: false });
    doc.moveTo(MARGIN + 8, py + bpRowH - 4).lineTo(MARGIN + cardW - 8, py + bpRowH - 4)
       .lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  });

  // Right: Delegation Matrix
  const rightX = MARGIN + cardW + 12;
  drawSectionBox(doc, theme, rightX, botY, cardW, botH, '4. Executive Delegation Matrix');
  const delThY = botY + 25;
  doc.rect(rightX + 4, delThY, cardW - 8, 15).fill(theme.bgLight);
  doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
     .text('DELIVERABLE / INITIATIVE', rightX + 8, delThY + 4, { lineBreak: false })
     .text('OWNER', rightX + cardW - 88, delThY + 4, { lineBreak: false })
     .text('AUTHORITY', rightX + cardW - 48, delThY + 4, { lineBreak: false });

  const delRows = Math.floor((botH - 44) / 20);
  for (let r = 0; r < delRows; r++) {
    const ry = delThY + 17 + r * 20;
    drawCheckboxLine(doc, theme, rightX + 2, ry, cardW - 94, 20, r % 2 === 1);
    doc.moveTo(rightX + cardW - 88, ry + 17).lineTo(rightX + cardW - 52, ry + 17).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
    doc.moveTo(rightX + cardW - 48, ry + 17).lineTo(rightX + cardW - 8, ry + 17).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  }

  drawFooter(doc, theme, pageNum, totalPages, 'CEO OKR Blueprint');
}

// ============================================================================
// 3. Deep Work Log (24 Pages)
// ============================================================================
function renderDeepWorkPage(doc, theme, pageNum, totalPages) {
  drawHeader(doc, theme, 'Deep Work & Cognitive Flow Architecture Log', '4x90-Minute High-Cognition Blocks • Distraction Tally • Shutdown Ritual', pageNum, totalPages);

  const topY = 76;
  const leftW = 340;
  const rightW = CONTENT_W - leftW - 12;
  const rightX = MARGIN + leftW + 12;

  // Left: 4x90-Minute Deep Work Session Blocks
  const blockH = 122;
  for (let b = 0; b < 4; b++) {
    const by = topY + b * (blockH + 8);
    drawSectionBox(doc, theme, MARGIN, by, leftW, blockH, `Session Block 0${b + 1} • 90-Minute Deep Work Sprint`);

    doc.fillColor(theme.textDark).font('Helvetica-Bold').fontSize(8)
       .text('Time Window: ____:____ to ____:____', MARGIN + 10, by + 28, { lineBreak: false })
       .text('Depth: [ L1 ] [ L2 ] [ L3 ]', MARGIN + leftW - 115, by + 28, { lineBreak: false });

    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(8)
       .text('Single Wildly Important Deliverable:', MARGIN + 10, by + 44, { lineBreak: false });
    doc.moveTo(MARGIN + 160, by + 53).lineTo(MARGIN + leftW - 10, by + 53).lineWidth(0.5).strokeColor('#94a3b8').stroke();

    drawCheckboxLine(doc, theme, MARGIN + 2, by + 58, leftW - 4, 18, true, 'Milestone 1 (0-30m):');
    drawCheckboxLine(doc, theme, MARGIN + 2, by + 76, leftW - 4, 18, false, 'Milestone 2 (30-60m):');
    drawCheckboxLine(doc, theme, MARGIN + 2, by + 94, leftW - 4, 18, true, 'Milestone 3 (60-90m):');
  }

  // Right Top: Distraction Tally Box
  drawSectionBox(doc, theme, rightX, topY, rightW, 200, 'Impulse & Distraction Tally Box');
  const distTriggers = [
    'Slack / Email Check Urge',
    'Social Media / News Tab',
    'Context-Switching Impulse',
    'Phone Notification Glance',
    'Unplanned Colleague Ping',
    'Internal Random Thought'
  ];
  distTriggers.forEach((tr, idx) => {
    const dy = topY + 26 + idx * 27;
    if (idx % 2 === 1) doc.rect(rightX + 2, dy, rightW - 4, 26).fill(theme.zebra);
    doc.fillColor(theme.textDark).font('Helvetica-Bold').fontSize(7.5)
       .text(tr, rightX + 8, dy + 3, { lineBreak: false });
    doc.fillColor(theme.textMuted).font('Helvetica').fontSize(7)
       .text('Tally: [   ] [   ] [   ] [   ] [   ]', rightX + 8, dy + 14, { lineBreak: false });
  });

  // Right Middle: Deep Focus Score
  const scoreY = topY + 210;
  drawSectionBox(doc, theme, rightX, scoreY, rightW, 130, 'Daily Deep Focus Scorecard');
  const metrics = [
    'Total Deep Work Hours Logged: ______ hrs',
    'Phone Kept in Another Room:   [ Yes ] [ No ]',
    'Zero Inbox Until First 90m:   [ Yes ] [ No ]',
    'Cognitive Intensity Score:',
    '  [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]'
  ];
  metrics.forEach((m, i) => {
    const my = scoreY + 28 + i * 19;
    if (i % 2 === 1) doc.rect(rightX + 2, my - 2, rightW - 4, 18).fill(theme.zebra);
    doc.fillColor(theme.textDark).font('Helvetica-Bold').fontSize(8)
       .text(m, rightX + 8, my + 2, { lineBreak: false });
  });

  // Right Bottom: Shutdown Ritual Checklist
  const shutY = scoreY + 140;
  const shutH = 4 * (blockH + 8) - 8 - 340;
  drawSectionBox(doc, theme, rightX, shutY, rightW, shutH, 'Evening Shutdown Ritual');
  const shutSteps = [
    'Triage open loops & loose notes',
    'Review calendar for tomorrow morning',
    'Define tomorrow’s #1 Deep Work block',
    'Close all browser tabs & work apps',
    'Speak phrase: "Shutdown Complete"'
  ];
  shutSteps.forEach((st, i) => {
    const sy = shutY + 26 + i * 26;
    drawCheckboxLine(doc, theme, rightX + 2, sy, rightW - 4, 24, i % 2 === 1, st);
  });

  // Bottom Full-Width Reflection Notes
  const botY = topY + 4 * (blockH + 8) + 2;
  const botH = PAGE_H - botY - 38;
  drawSectionBox(doc, theme, MARGIN, botY, CONTENT_W, botH, 'End-of-Day Flow State Reflection & Key Breakthroughs');
  const numLines = Math.floor((botH - 28) / 18);
  drawRuledLines(doc, theme, MARGIN + 2, botY + 26, CONTENT_W - 4, numLines, 18);

  drawFooter(doc, theme, pageNum, totalPages, 'Deep Work Log');
}

// ============================================================================
// 4. Eisenhower Matrix Workbook (16 Pages)
// ============================================================================
function renderEisenhowerPage(doc, theme, pageNum, totalPages) {
  drawHeader(doc, theme, 'Eisenhower Priority Matrix & Triage Workbook', '4-Quadrant Urgent vs. Important Decision Grid • Action Execution Table', pageNum, totalPages);

  const topY = 76;
  const quadW = (CONTENT_W - 12) / 2;
  const quadH = 215;

  const quadrants = [
    {
      title: 'Q1: DO FIRST (Urgent & Important)',
      sub: 'High-impact crises, hard deadlines & mission-critical deliverables',
      col: 0, row: 0
    },
    {
      title: 'Q2: SCHEDULE (Not Urgent & Important)',
      sub: 'Strategic compounding, deep work, system building & relationships',
      col: 1, row: 0
    },
    {
      title: 'Q3: DELEGATE (Urgent & Not Important)',
      sub: 'Interruptions, routine admin, standard reporting & tactical requests',
      col: 0, row: 1
    },
    {
      title: 'Q4: ELIMINATE (Not Urgent & Not Important)',
      sub: 'Time-wasters, busywork, vanity tasks & low-leverage distractions',
      col: 1, row: 1
    }
  ];

  quadrants.forEach((q) => {
    const qx = MARGIN + q.col * (quadW + 12);
    const qy = topY + q.row * (quadH + 10);
    drawSectionBox(doc, theme, qx, qy, quadW, quadH, q.title);
    doc.fillColor(theme.textMuted).font('Helvetica-Oblique').fontSize(7.5)
       .text(q.sub, qx + 8, qy + 25, { width: quadW - 16, lineBreak: false });

    const rows = 9;
    for (let r = 0; r < rows; r++) {
      const ry = qy + 39 + r * 19;
      drawCheckboxLine(doc, theme, qx + 2, ry, quadW - 4, 19, r % 2 === 1);
    }
  });

  // Bottom: Action Execution Table
  const botY = topY + (quadH + 10) * 2 + 4;
  const botH = PAGE_H - botY - 38;
  drawSectionBox(doc, theme, MARGIN, botY, CONTENT_W, botH, 'Committed Action Execution Table (Time-Blocked Implementation)');

  const thY = botY + 24;
  doc.rect(MARGIN + 4, thY, CONTENT_W - 8, 16).fill(theme.bgLight);
  doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
     .text('DONE', MARGIN + 8, thY + 4, { lineBreak: false })
     .text('PRIORITY ACTION STEP', MARGIN + 42, thY + 4, { lineBreak: false })
     .text('QUAD', MARGIN + 305, thY + 4, { lineBreak: false })
     .text('OWNER / ASSIGNEE', MARGIN + 350, thY + 4, { lineBreak: false })
     .text('TIME BLOCK / DUE', MARGIN + 445, thY + 4, { lineBreak: false });

  const tableRows = Math.floor((botH - 44) / 20);
  for (let r = 0; r < tableRows; r++) {
    const ry = thY + 18 + r * 20;
    if (r % 2 === 1) doc.rect(MARGIN + 4, ry, CONTENT_W - 8, 20).fill(theme.zebra);
    doc.roundedRect(MARGIN + 12, ry + 5, 10, 10, 1.5).lineWidth(0.8).strokeColor(theme.primary).stroke();
    doc.moveTo(MARGIN + 42, ry + 16).lineTo(MARGIN + 295, ry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
    doc.roundedRect(MARGIN + 305, ry + 3, 34, 14, 2).lineWidth(0.5).strokeColor(theme.border).stroke();
    doc.moveTo(MARGIN + 350, ry + 16).lineTo(MARGIN + 435, ry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
    doc.moveTo(MARGIN + 445, ry + 16).lineTo(MARGIN + CONTENT_W - 10, ry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  }

  drawFooter(doc, theme, pageNum, totalPages, 'Eisenhower Matrix Workbook');
}

// ============================================================================
// 5. Cornell Meeting Notes (24 Pages)
// ============================================================================
function renderCornellNotesPage(doc, theme, pageNum, totalPages) {
  drawHeader(doc, theme, 'Executive Cornell Meeting & Strategy Notes', 'Structured Cue Column • Detailed Discussion Record • Action Items & Owners', pageNum, totalPages);

  const topY = 76;
  // Header Metadata Box
  drawSectionBox(doc, theme, MARGIN, topY, CONTENT_W, 82, '1. Meeting Context, Attendees & Core Objective');
  const fields = [
    { label: 'MEETING / PROJECT:', x: MARGIN + 10, y: topY + 28, lineX: MARGIN + 105, lineEnd: MARGIN + 330 },
    { label: 'FACILITATOR:', x: MARGIN + 340, y: topY + 28, lineX: MARGIN + 405, lineEnd: MARGIN + CONTENT_W - 10 },
    { label: 'ATTENDEES:', x: MARGIN + 10, y: topY + 46, lineX: MARGIN + 72, lineEnd: MARGIN + 330 },
    { label: 'DECISION NEEDED:', x: MARGIN + 340, y: topY + 46, lineX: MARGIN + 422, lineEnd: MARGIN + CONTENT_W - 10 },
    { label: 'AGENDA PILLARS:', x: MARGIN + 10, y: topY + 64, lineX: MARGIN + 92, lineEnd: MARGIN + CONTENT_W - 10 }
  ];
  fields.forEach((f) => {
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
       .text(f.label, f.x, f.y, { lineBreak: false });
    doc.moveTo(f.lineX, f.y + 8).lineTo(f.lineEnd, f.y + 8).lineWidth(0.5).strokeColor('#94a3b8').stroke();
  });

  // Main Cornell Split: Left Cues Column + Right Notes Column
  const midY = topY + 90;
  const midH = 468;
  const cueW = 165;
  const notesW = CONTENT_W - cueW - 10;
  const notesX = MARGIN + cueW + 10;

  drawSectionBox(doc, theme, MARGIN, midY, cueW, midH, '2. Key Cues & Questions');
  drawSectionBox(doc, theme, notesX, midY, notesW, midH, '3. Detailed Meeting Notes, Data & Decisions');

  const numLines = Math.floor((midH - 28) / 20);
  drawRuledLines(doc, theme, MARGIN + 2, midY + 26, cueW - 4, numLines, 20);
  drawRuledLines(doc, theme, notesX + 2, midY + 26, notesW - 4, numLines, 20);

  // Footer Box: Executive Summary + Action Items & Owners
  const botY = midY + midH + 8;
  const botH = PAGE_H - botY - 38;
  drawSectionBox(doc, theme, MARGIN, botY, CONTENT_W, botH, '4. Key Takeaways, Action Items & Accountable Owners');

  const thY = botY + 24;
  doc.rect(MARGIN + 4, thY, CONTENT_W - 8, 15).fill(theme.bgLight);
  doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
     .text('STATUS', MARGIN + 8, thY + 3.5, { lineBreak: false })
     .text('COMMITTED ACTION ITEM / NEXT STEP', MARGIN + 48, thY + 3.5, { lineBreak: false })
     .text('ACCOUNTABLE OWNER', MARGIN + 345, thY + 3.5, { lineBreak: false })
     .text('DEADLINE', MARGIN + 455, thY + 3.5, { lineBreak: false });

  const actRows = Math.floor((botH - 42) / 19);
  for (let r = 0; r < actRows; r++) {
    const ry = thY + 17 + r * 19;
    drawCheckboxLine(doc, theme, MARGIN + 4, ry, 332, 19, r % 2 === 1);
    doc.moveTo(MARGIN + 345, ry + 16).lineTo(MARGIN + 445, ry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
    doc.moveTo(MARGIN + 455, ry + 16).lineTo(MARGIN + CONTENT_W - 10, ry + 16).lineWidth(0.5).strokeColor('#cbd5e1').stroke();
  }

  drawFooter(doc, theme, pageNum, totalPages, 'Cornell Meeting Notes');
}

// ============================================================================
// Master Generator Loop (5 Planners x 3 Themes = 15 PDFs)
// ============================================================================
const PLANNERS = [
  { prefix: 'ADHD-Focus-Planner', pages: 20, renderPage: renderADHDFocusPage },
  { prefix: 'CEO-OKR-Blueprint', pages: 16, renderPage: renderCEOOKRPage },
  { prefix: 'Deep-Work-Log', pages: 24, renderPage: renderDeepWorkPage },
  { prefix: 'Eisenhower-Matrix-Workbook', pages: 16, renderPage: renderEisenhowerPage },
  { prefix: 'Cornell-Meeting-Notes', pages: 24, renderPage: renderCornellNotesPage }
];

async function generateSinglePDF(planner, themeKey, theme) {
  return new Promise((resolve, reject) => {
    const fileName = `${planner.prefix}_${themeKey}.pdf`;
    const filePath = path.join(OUTPUT_DIR, fileName);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      autoFirstPage: false,
      info: {
        Title: `${planner.prefix.replace(/-/g, ' ')} (${theme.name})`,
        Author: 'BizTools Executive Collection',
        Subject: 'Executive Productivity & Focus PDF Planner'
      }
    });

    const stream = fs.createWriteStream(filePath);
    stream.on('finish', () => resolve({ fileName, filePath, pages: planner.pages }));
    stream.on('error', reject);

    doc.pipe(stream);

    for (let p = 1; p <= planner.pages; p++) {
      doc.addPage({ size: 'A4', margin: 0 });
      planner.renderPage(doc, theme, p, planner.pages);
    }

    doc.end();
  });
}

async function runAll() {
  console.log('Starting Agent 3 Executive Productivity & ADHD Focus PDF Generator...');
  const results = [];
  for (const planner of PLANNERS) {
    for (const [themeKey, theme] of Object.entries(THEMES)) {
      const info = await generateSinglePDF(planner, themeKey, theme);
      const stats = fs.statSync(info.filePath);
      console.log(`[OK] ${info.fileName} (${info.pages} pages, ${(stats.size / 1024).toFixed(1)} KB)`);
      results.push({ ...info, sizeKB: (stats.size / 1024).toFixed(1) });
    }
  }
  console.log(`\nSuccessfully generated ${results.length} PDF planners in ${OUTPUT_DIR}`);
}

runAll().catch((err) => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
