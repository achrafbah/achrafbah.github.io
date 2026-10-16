const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(
  'c:\\Users\\bahloul.a\\Downloads\\Ai studio\\achrafbah.github.io-main\\downloads\\planners'
);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const THEMES = {
  ocean: {
    name: 'Ocean',
    primary: '#0284c7',
    secondary: '#0369a1',
    accent: '#38bdf8',
    light: '#f0f9ff',
    border: '#bae6fd',
    dark: '#0f172a',
    muted: '#64748b'
  },
  sage: {
    name: 'Sage',
    primary: '#0f9d58',
    secondary: '#0b8043',
    accent: '#34a853',
    light: '#f0fdf4',
    border: '#bbf7d0',
    dark: '#064e3b',
    muted: '#64748b'
  },
  rose: {
    name: 'Rose',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#fb7185',
    light: '#fff1f2',
    border: '#fecdd3',
    dark: '#4c0519',
    muted: '#64748b'
  }
};

// Page Constants (A4: 595.28 x 841.89)
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 36;
const CONTENT_W = PAGE_W - MARGIN * 2;

// Helper Drawing Utilities
function drawPageChrome(doc, theme, plannerTitle, sectionTitle, pageNum, totalPages) {
  doc.save();
  // Top Header Bar
  doc.rect(MARGIN, 24, CONTENT_W, 28).fill(theme.primary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
    .text(plannerTitle.toUpperCase(), MARGIN + 12, 33, { width: 280, lineBreak: false });
  doc.fillColor('#ffffff').font('Helvetica').fontSize(9)
    .text(sectionTitle, MARGIN + 290, 33, { width: CONTENT_W - 302, align: 'right', lineBreak: false });

  // Bottom Footer
  doc.moveTo(MARGIN, PAGE_H - 36).lineTo(PAGE_W - MARGIN, PAGE_H - 36)
    .lineWidth(0.75).strokeColor(theme.border).stroke();
  doc.fillColor(theme.muted).font('Helvetica').fontSize(8)
    .text(`Wellness & Performance Collection • ${theme.name} Edition`, MARGIN, PAGE_H - 28, { width: 300, lineBreak: false });
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN - 120, PAGE_H - 28, { width: 120, align: 'right', lineBreak: false });
  doc.restore();
}

function drawCoverPage(doc, theme, title, subtitle, badgeText, features, totalPages) {
  doc.save();
  // Full background tint
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(theme.light);

  // Left vertical decorative accent bar
  doc.rect(0, 0, 28, PAGE_H).fill(theme.primary);
  doc.rect(28, 0, 6, PAGE_H).fill(theme.accent);

  // Top Geometric Banner
  doc.rect(64, 70, CONTENT_W - 36, 260). lineWidth(1.5).fillAndStroke('#ffffff', theme.border);
  doc.rect(64, 70, CONTENT_W - 36, 40).fill(theme.primary);

  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
    .text(badgeText.toUpperCase(), 80, 85, { width: CONTENT_W - 68, characterSpacing: 1.5, lineBreak: false });

  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(28)
    .text(title, 84, 140, { width: CONTENT_W - 76 });

  doc.fillColor(theme.secondary).font('Helvetica').fontSize(13)
    .text(subtitle, 84, 215, { width: CONTENT_W - 76 });

  // Theme Pill
  doc.roundedRect(84, 270, 150, 28, 14).fill(theme.light);
  doc.roundedRect(84, 270, 150, 28, 14).lineWidth(1).strokeColor(theme.primary).stroke();
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(10)
    .text(`${theme.name.toUpperCase()} THEME • ${totalPages} PAGES`, 94, 280, { width: 130, align: 'center', lineBreak: false });

  // Feature Highlights Box
  doc.rect(64, 360, CONTENT_W - 36, 250).fillAndStroke('#ffffff', theme.border);
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(12)
    .text('INCLUDED ARCHITECTURE & TRACKING MODULES', 84, 382, { width: CONTENT_W - 76, lineBreak: false });
  doc.moveTo(84, 402).lineTo(PAGE_W - 44, 402).lineWidth(1).strokeColor(theme.border).stroke();

  let fy = 420;
  features.forEach((feat, idx) => {
    doc.circle(94, fy + 5, 8).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
      .text(String(idx + 1), 90, fy + 2, { width: 8, align: 'center', lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(10.5)
      .text(feat.title, 112, fy, { width: CONTENT_W - 108, lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(9)
      .text(feat.desc, 112, fy + 14, { width: CONTENT_W - 108, lineBreak: false });
    fy += 36;
  });

  // Owner & Date Block
  doc.rect(64, 640, CONTENT_W - 36, 120).fillAndStroke('#ffffff', theme.border);
  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(10)
    .text('PERSONAL COMMITMENT & OWNERSHIP', 84, 658, { lineBreak: false });

  const fields = [
    { label: 'ATHLETE / OWNER NAME:', x: 84, y: 685, w: 220 },
    { label: 'START DATE:', x: 324, y: 685, w: 190 },
    { label: 'PRIMARY OBJECTIVE:', x: 84, y: 722, w: 220 },
    { label: 'TARGET COMPLETION:', x: 324, y: 722, w: 190 }
  ];
  fields.forEach(f => {
    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(8)
      .text(f.label, f.x, f.y, { lineBreak: false });
    doc.moveTo(f.x, f.y + 22).lineTo(f.x + f.w, f.y + 22).lineWidth(0.75).strokeColor(theme.primary).stroke();
  });

  doc.fillColor(theme.muted).font('Helvetica').fontSize(8)
    .text('Digital Factory Vector Edition • Crisp Print & Tablet Ready PDF', 64, PAGE_H - 36, {
      width: CONTENT_W - 36,
      align: 'center',
      lineBreak: false
    });
  doc.restore();
}

function drawSectionHeader(doc, theme, x, y, w, title, rightLabel = '') {
  doc.save();
  doc.rect(x, y, w, 20).fill(theme.light);
  doc.rect(x, y, 4, 20).fill(theme.primary);
  doc.rect(x, y, w, 20).lineWidth(0.5).strokeColor(theme.border).stroke();
  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(9.5)
    .text(title, x + 10, y + 5.5, { width: w - 20, lineBreak: false });
  if (rightLabel) {
    doc.fillColor(theme.secondary).font('Helvetica').fontSize(8.5)
      .text(rightLabel, x + 10, y + 6, { width: w - 18, align: 'right', lineBreak: false });
  }
  doc.restore();
}

function drawCheckbox(doc, theme, x, y, size = 10) {
  doc.save();
  doc.roundedRect(x, y, size, size, 1.5).lineWidth(0.9).strokeColor(theme.primary).stroke();
  doc.restore();
}

function drawTable(doc, theme, x, y, colWidths, headers, rowsCount, rowHeight, prefillCol0 = null) {
  doc.save();
  const totalW = colWidths.reduce((a, b) => a + b, 0);

  // Header row
  doc.rect(x, y, totalW, rowHeight).fill(theme.primary);
  let cx = x;
  headers.forEach((h, i) => {
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
      .text(h, cx + 4, y + (rowHeight - 8) / 2, { width: colWidths[i] - 8, align: i === 0 ? 'left' : 'center', lineBreak: false });
    cx += colWidths[i];
  });

  // Data rows
  for (let r = 0; r < rowsCount; r++) {
    const ry = y + rowHeight * (r + 1);
    doc.rect(x, ry, totalW, rowHeight).fill(r % 2 === 1 ? theme.light : '#ffffff');
    doc.rect(x, ry, totalW, rowHeight).lineWidth(0.4).strokeColor(theme.border).stroke();

    let cellX = x;
    for (let c = 0; c < colWidths.length; c++) {
      if (c > 0) {
        doc.moveTo(cellX, ry).lineTo(cellX, ry + rowHeight).lineWidth(0.4).strokeColor(theme.border).stroke();
      }
      if (c === 0 && prefillCol0 && prefillCol0[r] !== undefined) {
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
          .text(String(prefillCol0[r]), cellX + 5, ry + (rowHeight - 8) / 2, { width: colWidths[c] - 10, lineBreak: false });
      }
      cellX += colWidths[c];
    }
  }
  doc.restore();
  return y + rowHeight * (rowsCount + 1);
}

// ============================================================================
// 1. 75-Day-Challenge-Tracker_<theme>.pdf (16 Pages)
// ============================================================================
function build75DayChallenge(themeKey, theme) {
  const filename = `75-Day-Challenge-Tracker_${themeKey}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);
  const totalPages = 16;
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Page 1: Cover
  doc.addPage();
  drawCoverPage(
    doc,
    theme,
    '75-DAY MENTAL TOUGHNESS & CHALLENGE TRACKER',
    'Complete Daily Discipline Log, Visual 75-Day Checkoff Matrix & Body Metrics System',
    'ELITE DISCIPLINE & FITNESS PROTOCOL',
    [
      { title: '75-Day Master Visual Grid', desc: 'At-a-glance 75-box completion matrix & ironclad challenge rules contract.' },
      { title: '5 Core Daily Non-Negotiables', desc: '2x 45-Min Workouts (1 Outdoor), 1 Gallon Water, Clean Diet, 10 Pages Reading, Progress Photo.' },
      { title: 'Weekly Body Metrics & Measurements', desc: '11-Week weight, body fat %, waist/chest/limb circumference & energy tracking.' },
      { title: '13-Page Daily Checkoff Matrices (Days 1-75)', desc: 'Detailed day-by-day verification grids with habit checkboxes and reflection space.' },
      { title: 'Final 75-Day Transformation Debrief', desc: 'Before vs. After physiological & mental resilience evaluation.' }
    ],
    totalPages
  );

  // Page 2: 75-Day Visual Checkoff Grid & Official Rules Contract
  doc.addPage();
  drawPageChrome(doc, theme, '75-Day Challenge Tracker', 'Visual 75-Day Grid & Daily Protocol Rules', 2, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'THE 5 NON-NEGOTIABLE DAILY RULES (ZERO COMPROMISE)', 'Reset to Day 1 if missed');
  const rules = [
    ['RULE 01: TWO 45-MINUTE WORKOUTS', 'Complete two separate 45-minute workouts every single day. One workout MUST be performed outdoors regardless of weather conditions.'],
    ['RULE 02: STRICT CLEAN NUTRITION', 'Follow your chosen structured nutrition plan with zero cheat meals, zero refined sugar binges, and zero drops of alcohol.'],
    ['RULE 03: ONE GALLON (3.8L) OF WATER', 'Drink 1 full gallon (128 oz / 3.8 Liters) of pure water daily. Track intake in 8 x 16oz increments throughout the day.'],
    ['RULE 04: READ 10 PAGES OF NON-FICTION', 'Read at least 10 pages of a personal development, mindset, or educational non-fiction book (audiobooks do not count).'],
    ['RULE 05: DAILY PROGRESS PHOTO', 'Take one front/side progress photo every day to build visual awareness and document physical transformation.']
  ];
  let ry = 92;
  rules.forEach((r, idx) => {
    doc.rect(MARGIN, ry, CONTENT_W, 38).fillAndStroke(idx % 2 === 0 ? '#ffffff' : theme.light, theme.border);
    doc.rect(MARGIN, ry, 6, 38).fill(theme.primary);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5)
      .text(r[0], MARGIN + 14, ry + 7, { width: CONTENT_W - 24, lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica').fontSize(8.5)
      .text(r[1], MARGIN + 14, ry + 21, { width: CONTENT_W - 24, lineBreak: false });
    ry += 43;
  });

  // 75-Day Visual Checkoff Grid (15 columns x 5 rows = 75 boxes)
  drawSectionHeader(doc, theme, MARGIN, 316, CONTENT_W, '75-DAY MASTER VISUAL CHECKOFF MATRIX', 'Cross off each completed day');
  const gridX = MARGIN;
  const gridY = 346;
  const cols = 15;
  const rows = 5;
  const boxW = CONTENT_W / cols;
  const boxH = 56;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dayNum = r * cols + c + 1;
      const bx = gridX + c * boxW;
      const by = gridY + r * boxH;
      doc.rect(bx, by, boxW, boxH).fillAndStroke('#ffffff', theme.border);
      doc.rect(bx, by, boxW, 15).fill(theme.light);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(7.5)
        .text(`DAY ${dayNum}`, bx, by + 4, { width: boxW, align: 'center', lineBreak: false });
      drawCheckbox(doc, theme, bx + (boxW - 14) / 2, by + 25, 14);
    }
  }

  // Signed Pledge Box
  const pledgeY = 640;
  doc.rect(MARGIN, pledgeY, CONTENT_W, 145).fillAndStroke(theme.light, theme.border);
  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(10)
    .text('CHALLENGE INTEGRITY CONTRACT', MARGIN + 14, pledgeY + 14, { lineBreak: false });
  doc.fillColor(theme.dark).font('Helvetica').fontSize(9)
    .text('I hereby commit to executing all 5 daily rules of the 75-Day Challenge without modification or excuse. If I fail to complete any single requirement before going to sleep, I will honestly reset my counter to Day 1.', MARGIN + 14, pledgeY + 32, { width: CONTENT_W - 28 });

  doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(8.5)
    .text('CHOSEN DIET PROTOCOL:', MARGIN + 14, pledgeY + 75, { lineBreak: false });
  doc.moveTo(MARGIN + 135, pledgeY + 85).lineTo(PAGE_W - MARGIN - 14, pledgeY + 85).lineWidth(0.75).strokeColor(theme.primary).stroke();

  doc.text('READING BOOK LIST:', MARGIN + 14, pledgeY + 98, { lineBreak: false });
  doc.moveTo(MARGIN + 135, pledgeY + 108).lineTo(PAGE_W - MARGIN - 14, pledgeY + 108).lineWidth(0.75).strokeColor(theme.primary).stroke();

  doc.text('SIGNATURE:', MARGIN + 14, pledgeY + 123, { lineBreak: false });
  doc.moveTo(MARGIN + 80, pledgeY + 133).lineTo(MARGIN + 280, pledgeY + 133).lineWidth(0.75).strokeColor(theme.primary).stroke();
  doc.text('DATE:', MARGIN + 310, pledgeY + 123, { lineBreak: false });
  doc.moveTo(MARGIN + 345, pledgeY + 133).lineTo(PAGE_W - MARGIN - 14, pledgeY + 133).lineWidth(0.75).strokeColor(theme.primary).stroke();

  // Page 3: Weekly Body Metrics Log & Milestone Checkpoints
  doc.addPage();
  drawPageChrome(doc, theme, '75-Day Challenge Tracker', 'Weekly Body Metrics & Physical Progress Log', 3, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'WEEKLY BODY METRICS & CIRCUMFERENCE LOG (START TO DAY 75)', 'Record every 7 days fasted');
  const metricCols = [68, 56, 56, 56, 56, 56, 56, 56, 63];
  const metricHeaders = ['CHECKPOINT', 'DATE', 'WEIGHT', 'BODY FAT%', 'WAIST', 'CHEST', 'HIPS', 'ARMS/THIGH', 'ENERGY 1-10'];
  const metricRows = [
    'Day 1 (Start)', 'Week 1 (D7)', 'Week 2 (D14)', 'Week 3 (D21)', 'Week 4 (D28)',
    'Week 5 (D35)', 'Week 6 (D42)', 'Week 7 (D49)', 'Week 8 (D56)', 'Week 9 (D63)',
    'Week 10 (D70)', 'Day 75 (End)', 'Net Change'
  ];
  const afterMetricsY = drawTable(doc, theme, MARGIN, 90, metricCols, metricHeaders, metricRows.length, 24, metricRows);

  drawSectionHeader(doc, theme, MARGIN, afterMetricsY + 18, CONTENT_W, 'BENCHMARK FITNESS & STRENGTH PROGRESSION', 'Test on Day 1, Day 38, Day 75');
  const benchCols = [163, 120, 120, 120];
  const benchHeaders = ['BENCHMARK EXERCISE / METRIC', 'DAY 1 BASELINE', 'DAY 38 MIDPOINT', 'DAY 75 FINAL'];
  const benchRows = [
    'Push-Ups (Max Unbroken Reps)',
    'Plank Hold (Max Duration)',
    'Pull-Ups / Chin-Ups (Max Reps)',
    '1 Mile / 5K Run Time',
    'Squat / Deadlift Working Weight',
    'Resting Heart Rate (BPM)',
    'Average Daily Sleep Duration (Hrs)'
  ];
  const afterBenchY = drawTable(doc, theme, MARGIN, afterMetricsY + 44, benchCols, benchHeaders, benchRows.length, 24, benchRows);

  drawSectionHeader(doc, theme, MARGIN, afterBenchY + 16, CONTENT_W, 'READING LOG (10 PAGES DAILY NON-FICTION)', 'Books Completed During 75 Days');
  const bookCols = [32, 230, 130, 65, 66];
  const bookHeaders = ['#', 'BOOK TITLE', 'AUTHOR', 'START DAY', 'FINISH DAY'];
  drawTable(doc, theme, MARGIN, afterBenchY + 40, bookCols, bookHeaders, 4, 21, ['1', '2', '3', '4']);

  // Pages 4 to 15 (12 Pages): Detailed Daily Checkoff Cards (6 Days per page = 72 days) + Page 16 (Days 73-75 + Final Review)
  for (let p = 0; p < 12; p++) {
    const pageNum = 4 + p;
    const startDay = p * 6 + 1;
    const endDay = startDay + 5;
    doc.addPage();
    drawPageChrome(doc, theme, '75-Day Challenge Tracker', `Daily Execution Logs • Days ${startDay} to ${endDay}`, pageNum, totalPages);

    const cardH = 114;
    const gap = 6;
    let cy = 62;

    for (let d = 0; d < 6; d++) {
      const dayNumber = startDay + d;
      doc.save();
      doc.rect(MARGIN, cy, CONTENT_W, cardH).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, cy, 74, cardH).fill(theme.light);
      doc.moveTo(MARGIN + 74, cy).lineTo(MARGIN + 74, cy + cardH).lineWidth(0.75).strokeColor(theme.border).stroke();

      // Day Badge
      doc.rect(MARGIN, cy, 74, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
        .text(`DAY ${dayNumber}`, MARGIN, cy + 7, { width: 74, align: 'center', lineBreak: false });

      doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
        .text('DATE:', MARGIN + 8, cy + 32, { lineBreak: false });
      doc.moveTo(MARGIN + 8, cy + 50).lineTo(MARGIN + 66, cy + 50).lineWidth(0.5).strokeColor(theme.primary).stroke();

      doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
        .text('WEIGHT:', MARGIN + 8, cy + 58, { lineBreak: false });
      doc.moveTo(MARGIN + 8, cy + 76).lineTo(MARGIN + 66, cy + 76).lineWidth(0.5).strokeColor(theme.primary).stroke();

      drawCheckbox(doc, theme, MARGIN + 10, cy + 88, 11);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.5)
        .text('DAY COMPLETE', MARGIN + 24, cy + 90, { lineBreak: false });

      // Right side 5 Rules Checkoff + Water + Notes
      const rx = MARGIN + 84;
      const rw = CONTENT_W - 92;

      // Row 1: Workouts
      drawCheckbox(doc, theme, rx, cy + 10, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('Workout 1 (45m Indoor):', rx + 14, cy + 11, { lineBreak: false });
      doc.moveTo(rx + 115, cy + 20).lineTo(rx + 215, cy + 20).lineWidth(0.5).strokeColor(theme.border).stroke();

      drawCheckbox(doc, theme, rx + 225, cy + 10, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('Workout 2 (45m OUTDOOR):', rx + 239, cy + 11, { lineBreak: false });
      doc.moveTo(rx + 355, cy + 20).lineTo(rx + rw, cy + 20).lineWidth(0.5).strokeColor(theme.border).stroke();

      // Row 2: Clean Diet & Zero Alcohol & Photo
      drawCheckbox(doc, theme, rx, cy + 32, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('100% Clean Diet + Zero Alcohol/Cheat:', rx + 14, cy + 33, { lineBreak: false });
      doc.moveTo(rx + 172, cy + 42).lineTo(rx + 320, cy + 42).lineWidth(0.5).strokeColor(theme.border).stroke();

      drawCheckbox(doc, theme, rx + 330, cy + 32, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('Progress Photo Taken', rx + 344, cy + 33, { lineBreak: false });

      // Row 3: 10 Pages Reading
      drawCheckbox(doc, theme, rx, cy + 54, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('Read 10+ Pages Non-Fiction (Book & Pages):', rx + 14, cy + 55, { lineBreak: false });
      doc.moveTo(rx + 195, cy + 64).lineTo(rx + rw, cy + 64).lineWidth(0.5).strokeColor(theme.border).stroke();

      // Row 4: 1 Gallon Water (8 x 16oz checkboxes)
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('1 Gallon Water (8x16oz):', rx, cy + 77, { lineBreak: false });
      for (let w = 0; w < 8; w++) {
        const wx = rx + 108 + w * 38;
        drawCheckbox(doc, theme, wx, cy + 75, 10);
        doc.fillColor(theme.muted).font('Helvetica').fontSize(7)
          .text(`${(w + 1) * 16}oz`, wx + 12, cy + 77, { lineBreak: false });
      }

      // Row 5: Daily Win / Mental Toughness Note
      doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
        .text('DAILY NOTE / WIN:', rx, cy + 96, { lineBreak: false });
      doc.moveTo(rx + 80, cy + 105).lineTo(rx + rw, cy + 105).lineWidth(0.5).strokeColor(theme.border).stroke();

      doc.restore();
      cy += cardH + gap;
    }
  }

  // Page 16: Days 73, 74, 75 + Final 75-Day Challenge Transformation Review
  doc.addPage();
  drawPageChrome(doc, theme, '75-Day Challenge Tracker', 'Days 73–75 & Final Transformation Debrief', 16, totalPages);

  let cy16 = 62;
  const cardH16 = 114;
  for (let d = 73; d <= 75; d++) {
    doc.save();
    doc.rect(MARGIN, cy16, CONTENT_W, cardH16).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, cy16, 74, cardH16).fill(theme.light);
    doc.rect(MARGIN, cy16, 74, 24).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
      .text(`DAY ${d}`, MARGIN, cy16 + 7, { width: 74, align: 'center', lineBreak: false });

    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
      .text('DATE:', MARGIN + 8, cy16 + 32, { lineBreak: false });
    doc.moveTo(MARGIN + 8, cy16 + 50).lineTo(MARGIN + 66, cy16 + 50).lineWidth(0.5).strokeColor(theme.primary).stroke();

    doc.text('WEIGHT:', MARGIN + 8, cy16 + 58, { lineBreak: false });
    doc.moveTo(MARGIN + 8, cy16 + 76).lineTo(MARGIN + 66, cy16 + 76).lineWidth(0.5).strokeColor(theme.primary).stroke();

    drawCheckbox(doc, theme, MARGIN + 10, cy16 + 88, 11);
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.5)
      .text('DAY COMPLETE', MARGIN + 24, cy16 + 90, { lineBreak: false });

    const rx = MARGIN + 84;
    const rw = CONTENT_W - 92;

    drawCheckbox(doc, theme, rx, cy16 + 10, 10);
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
      .text('Workout 1 (45m Indoor):', rx + 14, cy16 + 11, { lineBreak: false });
    doc.moveTo(rx + 115, cy16 + 20).lineTo(rx + 215, cy16 + 20).lineWidth(0.5).strokeColor(theme.border).stroke();

    drawCheckbox(doc, theme, rx + 225, cy16 + 10, 10);
    doc.text('Workout 2 (45m OUTDOOR):', rx + 239, cy16 + 11, { lineBreak: false });
    doc.moveTo(rx + 355, cy16 + 20).lineTo(rx + rw, cy16 + 20).lineWidth(0.5).strokeColor(theme.border).stroke();

    drawCheckbox(doc, theme, rx, cy16 + 32, 10);
    doc.text('100% Clean Diet + Zero Alcohol/Cheat:', rx + 14, cy16 + 33, { lineBreak: false });
    doc.moveTo(rx + 172, cy16 + 42).lineTo(rx + 320, cy16 + 42).lineWidth(0.5).strokeColor(theme.border).stroke();

    drawCheckbox(doc, theme, rx + 330, cy16 + 32, 10);
    doc.text('Progress Photo Taken', rx + 344, cy16 + 33, { lineBreak: false });

    drawCheckbox(doc, theme, rx, cy16 + 54, 10);
    doc.text('Read 10+ Pages Non-Fiction (Book & Pages):', rx + 14, cy16 + 55, { lineBreak: false });
    doc.moveTo(rx + 195, cy16 + 64).lineTo(rx + rw, cy16 + 64).lineWidth(0.5).strokeColor(theme.border).stroke();

    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
      .text('1 Gallon Water (8x16oz):', rx, cy16 + 77, { lineBreak: false });
    for (let w = 0; w < 8; w++) {
      const wx = rx + 108 + w * 38;
      drawCheckbox(doc, theme, wx, cy16 + 75, 10);
      doc.fillColor(theme.muted).font('Helvetica').fontSize(7)
        .text(`${(w + 1) * 16}oz`, wx + 12, cy16 + 77, { lineBreak: false });
    }

    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
      .text('DAILY NOTE / WIN:', rx, cy16 + 96, { lineBreak: false });
    doc.moveTo(rx + 80, cy16 + 105).lineTo(rx + rw, cy16 + 105).lineWidth(0.5).strokeColor(theme.border).stroke();

    doc.restore();
    cy16 += cardH16 + 6;
  }

  // Final Debrief Box
  drawSectionHeader(doc, theme, MARGIN, cy16 + 8, CONTENT_W, '75-DAY CHALLENGE COMPLETION & TRANSFORMATION DEBRIEF', 'Finisher Summary');
  const debY = cy16 + 34;
  doc.rect(MARGIN, debY, CONTENT_W, 330).fillAndStroke('#ffffff', theme.border);

  const prompts = [
    '1. Total Weight / Body Composition Change & Physical Highlights:',
    '2. Hardest Moment During the 75 Days & How I Overcame It:',
    '3. Top 3 Mindset & Discipline Shifts I Will Carry Forward Permanently:',
    '4. Next Phase Goal (Phase 1 / Live Hard / New Fitness Target):'
  ];
  let py = debY + 16;
  prompts.forEach(pr => {
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9)
      .text(pr, MARGIN + 14, py, { lineBreak: false });
    for (let l = 1; l <= 3; l++) {
      doc.moveTo(MARGIN + 14, py + l * 18 + 4).lineTo(PAGE_W - MARGIN - 14, py + l * 18 + 4)
        .lineWidth(0.5).strokeColor(theme.border).stroke();
    }
    py += 76;
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', () => resolve(filePath)));
}

// ============================================================================
// 2. Macro-Fasting-Logbook_<theme>.pdf (24 Pages)
// ============================================================================
function buildMacroFastingLogbook(themeKey, theme) {
  const filename = `Macro-Fasting-Logbook_${themeKey}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);
  const totalPages = 24;
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Page 1: Cover
  doc.addPage();
  drawCoverPage(
    doc,
    theme,
    'INTERMITTENT FASTING & MACRO NUTRITION LOGBOOK',
    'Precision Metabolic Window Tracker (16:8 / 18:6 / OMAD), Daily Macros & Hydration Log',
    'METABOLIC HEALTH & NUTRITION SYSTEM',
    [
      { title: 'Fasting Protocol & Macro Calculator Reference', desc: 'TDEE calorie formulas, Protein/Carb/Fat splits, and 16:8, 18:6, 20:4 & OMAD timelines.' },
      { title: 'Weekly Meal Prep & Grocery Matrix', desc: 'High-protein staple inventory, healthy fats, complex carbs, and weekly batch prep.' },
      { title: '19-Page Daily Fasting & Macro Log Sheets', desc: '38 Full Daily Logs with fasting protocol checkboxes, 24-hour timeline bar, and macro tables.' },
      { title: 'Hydration & Electrolyte Checkboxes', desc: 'Daily Sodium, Potassium, Magnesium, and 3.5L water intake verification.' },
      { title: 'Metabolic Adaptation & Ketosis/Glucose Log', desc: 'Track blood ketones, fasting glucose, waist-to-hip ratio, and energy clarity.' }
    ],
    totalPages
  );

  // Page 2: Macro Targets & Intermittent Fasting Reference Guide
  doc.addPage();
  drawPageChrome(doc, theme, 'Macro & Fasting Logbook', 'Fasting Protocols & Personal Macro Targets', 2, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'INTERMITTENT FASTING PROTOCOLS REFERENCE', 'Select your daily protocol');
  const fastCols = [95, 85, 85, 258];
  const fastHeaders = ['PROTOCOL', 'FASTING WINDOW', 'EATING WINDOW', 'METABOLIC FOCUS & AUTOPHAGY BENEFITS'];
  const fastRows = [
    '14:10 Circadian',
    '16:8 Leangains',
    '18:6 Fat Loss',
    '20:4 Warrior',
    'OMAD (23:1)',
    '36h Monk Fast'
  ];
  const fastData = [
    ['14 Hours', '10 Hours', 'Beginner metabolic reset, improved overnight digestion & insulin sensitivity.'],
    ['16 Hours', '8 Hours', 'Sustainable daily fat oxidation, steady energy, and lean muscle preservation.'],
    ['18 Hours', '6 Hours', 'Enhanced lipolysis, deeper glycogen depletion, and early cellular autophagy.'],
    ['20 Hours', '4 Hours', 'High metabolic flexibility, growth hormone surge, and gut rest.'],
    ['23 Hours', '1 Hour', 'Maximum daily simplicity, deep fat adaptation, and strict caloric control.'],
    ['36 Hours', 'Refeed Day', 'Deep cellular autophagy, immune regeneration, and insulin reset.']
  ];
  const afterFastY = drawTable(doc, theme, MARGIN, 90, fastCols, fastHeaders, fastRows.length, 25, fastRows);
  for (let r = 0; r < fastData.length; r++) {
    const ry = 90 + 25 * (r + 1) + 8;
    doc.fillColor(theme.dark).font('Helvetica').fontSize(8)
      .text(fastData[r][0], MARGIN + 95, ry, { width: 85, align: 'center', lineBreak: false })
      .text(fastData[r][1], MARGIN + 180, ry, { width: 85, align: 'center', lineBreak: false })
      .text(fastData[r][2], MARGIN + 269, ry, { width: 250, lineBreak: false });
  }

  drawSectionHeader(doc, theme, MARGIN, afterFastY + 18, CONTENT_W, 'PERSONAL CALORIE & MACRONUTRIENT TARGETS', '1g Protein = 4 kcal | 1g Carb = 4 kcal | 1g Fat = 9 kcal');
  const macroCols = [135, 95, 95, 95, 103];
  const macroHeaders = ['PHASE / GOAL', 'DAILY CALORIES', 'PROTEIN (g / %)', 'CARBS (g / %)', 'FATS (g / %)'];
  const macroRows = [
    'Maintenance (TDEE)',
    'Fat Loss / Cut (-20%)',
    'Lean Bulk (+10%)',
    'Low-Carb / Keto Day',
    'High-Carb Training Day'
  ];
  const afterMacroY = drawTable(doc, theme, MARGIN, afterFastY + 44, macroCols, macroHeaders, macroRows.length, 26, macroRows);

  drawSectionHeader(doc, theme, MARGIN, afterMacroY + 18, CONTENT_W, 'ELECTROLYTE & CLEAN FASTING GUIDELINES', 'Prevent fasting fatigue & headaches');
  const elecY = afterMacroY + 44;
  doc.rect(MARGIN, elecY, CONTENT_W, 165).fillAndStroke('#ffffff', theme.border);
  const tips = [
    ['SODIUM (3,000–5,000 mg/day):', 'Essential during fasting when insulin drops and kidneys excrete sodium. Add Himalayan pink salt or sea salt to water.'],
    ['POTASSIUM (3,500–4,700 mg/day):', 'Prevents muscle cramps and heart palpitations. Source from electrolyte powder, avocado, leafy greens, and salmon.'],
    ['MAGNESIUM GLYCINATE (300–400 mg/day):', 'Supports 300+ enzymatic reactions, nervous system calm, deep sleep, and insulin sensitivity.'],
    ['CLEAN FAST ALLOWED LIQUIDS:', 'Plain water, sparkling mineral water, black coffee (no cream/sugar), plain green or herbal tea, and unflavored electrolytes.']
  ];
  let ty = elecY + 14;
  tips.forEach(t => {
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text(t[0], MARGIN + 12, ty, { lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica').fontSize(8).text(t[1], MARGIN + 12, ty + 12, { width: CONTENT_W - 24, lineBreak: false });
    ty += 37;
  });

  // Page 3: Master Grocery Staple Matrix & Weekly Meal Planner
  doc.addPage();
  drawPageChrome(doc, theme, 'Macro & Fasting Logbook', 'Nutrient-Dense Grocery Matrix & Meal Blueprint', 3, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'MACRO-FRIENDLY GROCERY STAPLE CHECKLIST', 'Stock your kitchen for success');
  const colW3 = (CONTENT_W - 16) / 3;
  const cats = [
    { title: 'LEAN PROTEINS', items: ['Chicken Breast / Thighs', 'Wild Salmon / Cod / Tuna', 'Grass-Fed Beef / Steak', 'Egg Whites & Whole Eggs', 'Greek Yogurt (0% Plain)', 'Cottage Cheese / Whey', 'Tempeh / Edamame / Tofu', 'Turkey Breast / Shrimp'] },
    { title: 'COMPLEX CARBS & FIBER', items: ['Rolled Oats / Quinoa', 'Sweet Potatoes / Yams', 'Jasmine / Basmati Rice', 'Berries (Blueberry/Rasp)', 'Broccoli / Asparagus', 'Spinach / Kale / Arugula', 'Lentils / Black Beans', 'Sourdough / Ezekiel Bread'] },
    { title: 'HEALTHY FATS & ELECTROLYTES', items: ['Avocado & Avocado Oil', 'Extra Virgin Olive Oil', 'Raw Almonds / Walnuts', 'Chia & Flax Seeds', 'Natural Almond/Peanut Butter', 'MCT Oil / Grass-Fed Butter', 'Pink Himalayan Sea Salt', 'LMNT / Zero-Cal Electrolytes'] }
  ];
  cats.forEach((cat, idx) => {
    const cx = MARGIN + idx * (colW3 + 8);
    doc.rect(cx, 90, colW3, 210).fillAndStroke('#ffffff', theme.border);
    doc.rect(cx, 90, colW3, 22).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5)
      .text(cat.title, cx, 97, { width: colW3, align: 'center', lineBreak: false });
    cat.items.forEach((item, ii) => {
      const iy = 120 + ii * 21;
      drawCheckbox(doc, theme, cx + 10, iy, 9.5);
      doc.fillColor(theme.dark).font('Helvetica').fontSize(8)
        .text(item, cx + 24, iy + 1, { width: colW3 - 30, lineBreak: false });
    });
  });

  drawSectionHeader(doc, theme, MARGIN, 318, CONTENT_W, 'GO-TO ANCHOR MEALS (PRE-CALCULATED MACRO FAVORITES)', 'Build repeatable meals');
  const favCols = [165, 138, 55, 55, 55, 55];
  const favHeaders = ['MEAL NAME / INGREDIENTS', 'PORTION / WEIGHT', 'CALORIES', 'PROTEIN (g)', 'CARBS (g)', 'FATS (g)'];
  const favRows = ['Break-Fast Meal #1', 'Break-Fast Meal #2', 'High-Protein Entree #1', 'High-Protein Entree #2', 'Post-Workout Refuel', 'Protein Shake / Snack'];
  const afterFavY = drawTable(doc, theme, MARGIN, 344, favCols, favHeaders, favRows.length, 26, favRows);

  drawSectionHeader(doc, theme, MARGIN, afterFavY + 18, CONTENT_W, '7-DAY FASTING SCHEDULE & DINNER PLANNER', 'Weekly Overview');
  const wkCols = [75, 85, 180, 90, 93];
  const wkHeaders = ['DAY', 'FAST PROTOCOL', 'PRIMARY MEALS PLANNED', 'TARGET KCAL', 'TARGET PROTEIN'];
  const wkRows = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  drawTable(doc, theme, MARGIN, afterFavY + 44, wkCols, wkHeaders, wkRows.length, 23, wkRows);

  // Pages 4 to 22 (19 Pages): Daily Fasting & Macro Logs (2 Full Daily Trackers per page = 38 Days)
  for (let p = 0; p < 19; p++) {
    const pageNum = 4 + p;
    const dayA = p * 2 + 1;
    const dayB = dayA + 1;
    doc.addPage();
    drawPageChrome(doc, theme, 'Macro & Fasting Logbook', `Daily Fasting Window & Macro Log • Days ${dayA} & ${dayB}`, pageNum, totalPages);

    [dayA, dayB].forEach((dayNum, idx) => {
      const topY = idx === 0 ? 60 : 434;
      doc.save();
      doc.rect(MARGIN, topY, CONTENT_W, 362).fillAndStroke('#ffffff', theme.border);

      // Subheader Bar
      doc.rect(MARGIN, topY, CONTENT_W, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9.5)
        .text(`DAY ${dayNum} — INTERMITTENT FASTING & MACRO LOG`, MARGIN + 10, topY + 7, { lineBreak: false });
      doc.fillColor('#ffffff').font('Helvetica').fontSize(8.5)
        .text('DATE: ___________________   WEIGHT: __________   SLEEP: ______ hrs', MARGIN + 230, topY + 7, {
          width: CONTENT_W - 240,
          align: 'right',
          lineBreak: false
        });

      // Fasting Protocol Checkboxes Row
      const fRowY = topY + 32;
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('PROTOCOL:', MARGIN + 10, fRowY + 2, { lineBreak: false });
      const protocols = ['16:8', '18:6', '20:4', 'OMAD', '24h+'];
      protocols.forEach((pr, pi) => {
        const px = MARGIN + 68 + pi * 46;
        drawCheckbox(doc, theme, px, fRowY, 9.5);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(8)
          .text(pr, px + 13, fRowY + 1, { lineBreak: false });
      });

      doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(8)
        .text('FAST START: ________  FAST END: ________  TOTAL HRS: ______', MARGIN + 300, fRowY + 1, { lineBreak: false });

      // 24-Hour Fasting & Eating Window Visual Bar
      const barY = topY + 50;
      doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7)
        .text('24H WINDOW (SHADE FASTING HOURS):', MARGIN + 10, barY + 4, { lineBreak: false });
      const gridStartX = MARGIN + 150;
      const cell24W = (CONTENT_W - 160) / 24;
      for (let h = 0; h < 24; h++) {
        const hx = gridStartX + h * cell24W;
        doc.rect(hx, barY, cell24W, 15).fillAndStroke(h < 12 || h >= 20 ? theme.light : '#ffffff', theme.border);
        doc.fillColor(theme.muted).font('Helvetica').fontSize(5.5)
          .text(String(h), hx, barY + 4.5, { width: cell24W, align: 'center', lineBreak: false });
      }

      // Daily Protein/Carbs/Fats/Calories Table
      const tblY = topY + 72;
      const mCols = [86, 178, 62, 62, 62, 53];
      const mHeaders = ['MEAL / TIME', 'FOODS & QUANTITIES LOGGED', 'PROTEIN (g)', 'CARBS (g)', 'FATS (g)', 'CALORIES'];
      const mRows = [
        'Meal 1 (Break-Fast)',
        'Meal 2 (Mid-Window)',
        'Meal 3 (Close-Window)',
        'Snacks / Supplements',
        'ACTUAL TOTALS',
        'DAILY TARGETS'
      ];
      const afterTblY = drawTable(doc, theme, MARGIN + 10, tblY, mCols, mHeaders, mRows.length, 21, mRows);

      // Hydration & Electrolyte Checkboxes Strip
      const hydY = afterTblY + 10;
      doc.rect(MARGIN + 10, hydY, CONTENT_W - 20, 44).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('HYDRATION (8 x 500mL = 4.0L):', MARGIN + 18, hydY + 8, { lineBreak: false });
      for (let w = 0; w < 8; w++) {
        const wx = MARGIN + 152 + w * 42;
        drawCheckbox(doc, theme, wx, hydY + 6, 9.5);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7)
          .text(`${(w + 1) * 0.5}L`, wx + 12, hydY + 7.5, { lineBreak: false });
      }

      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('ELECTROLYTES & BIO-MARKERS:', MARGIN + 18, hydY + 26, { lineBreak: false });
      const elecs = ['Sodium (Salt)', 'Potassium', 'Magnesium', 'Clean Fast 100%', 'Zero Cravings'];
      elecs.forEach((el, ei) => {
        const ex = MARGIN + 152 + ei * 70;
        drawCheckbox(doc, theme, ex, hydY + 25, 9.5);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7)
          .text(el, ex + 12, hydY + 26.5, { lineBreak: false });
      });

      // Digestion, Hunger & Energy Notes
      const noteY = hydY + 52;
      doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
        .text('HUNGER / KETONES / DIGESTION NOTES: _____________________________________________________________________________________', MARGIN + 10, noteY, { lineBreak: false });

      doc.restore();
    });
  }

  // Page 23: Metabolic Progress, Ketone/Glucose & Body Recomposition Tracker
  doc.addPage();
  drawPageChrome(doc, theme, 'Macro & Fasting Logbook', 'Metabolic Biomarkers & Body Composition Log', 23, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'WEEKLY METABOLIC BIOMARKERS & FASTING PROGRESS', 'Track weekly trends');
  const bioCols = [58, 62, 62, 65, 65, 65, 70, 76];
  const bioHeaders = ['WEEK', 'AVG FAST HRS', 'AVG KCAL', 'AVG PROTEIN', 'WEIGHT', 'WAIST (IN/CM)', 'FASTING GLUCOSE', 'KETONES (mmol/L)'];
  const bioRows = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
  const afterBioY = drawTable(doc, theme, MARGIN, 90, bioCols, bioHeaders, bioRows.length, 25, bioRows);

  drawSectionHeader(doc, theme, MARGIN, afterBioY + 20, CONTENT_W, 'METABOLIC FLEXIBILITY & AUTOPHAGY MILESTONES', 'Check off as achieved');
  const mileY = afterBioY + 46;
  doc.rect(MARGIN, mileY, CONTENT_W, 250).fillAndStroke('#ffffff', theme.border);
  const milestones = [
    'Completed 7 consecutive days of 16:8 Intermittent Fasting with 100% clean fasts',
    'Completed first 18:6 or 20:4 fasting window without energy crash or brain fog',
    'Hit daily protein target within +/- 5 grams for 7 consecutive days',
    'Maintained consistent electrolyte supplementation (Sodium, Potassium, Magnesium)',
    'Eliminated late-night snacking at least 3 hours prior to sleep',
    'Noticed sustained morning mental clarity and reduced post-meal afternoon fatigue',
    'Completed 14 consecutive days of accurate macro & calorie logging',
    'Completed full 38-Day Logbook cycle and evaluated body composition changes'
  ];
  milestones.forEach((m, mi) => {
    const my = mileY + 16 + mi * 28;
    drawCheckbox(doc, theme, MARGIN + 16, my, 11);
    doc.fillColor(theme.dark).font('Helvetica').fontSize(9)
      .text(m, MARGIN + 34, my + 1.5, { width: CONTENT_W - 50, lineBreak: false });
  });

  // Page 24: Monthly Nutrition & Fasting Audit
  doc.addPage();
  drawPageChrome(doc, theme, 'Macro & Fasting Logbook', 'Cycle Review & Next Phase Nutrition Adjustment', 24, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'END-OF-CYCLE NUTRITION & FASTING AUDIT', 'Data-Driven Adjustments');
  const auditBoxes = [
    { title: '1. FASTING WINDOW CONSISTENCY & SWEET SPOT', prompt: 'Which fasting window (16:8, 18:6, 20:4, OMAD) provided the best balance of fat loss, workout performance, and lifestyle adherence?' },
    { title: '2. MACRONUTRIENT SATIETY & PERFORMANCE REVIEW', prompt: 'Did my protein, carbohydrate, and fat ratios keep hunger regulated during fasting hours and fuel my training sessions?' },
    { title: '3. DIGESTIVE HEALTH, SLEEP & ENERGY CLARITY', prompt: 'Which specific foods made me feel energized vs. bloated or lethargic? How did meal timing impact sleep quality?' },
    { title: '4. NEXT CYCLE CALORIE & MACRO ADJUSTMENTS', prompt: 'New Target Calories: _________ | New Protein: ______g | New Carbs: ______g | New Fats: ______g | New Fasting Window: _________' }
  ];
  let ay = 94;
  auditBoxes.forEach(ab => {
    doc.rect(MARGIN, ay, CONTENT_W, 155).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, ay, CONTENT_W, 24).fill(theme.light);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5)
      .text(ab.title, MARGIN + 12, ay + 7, { lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(8.5)
      .text(ab.prompt, MARGIN + 12, ay + 32, { width: CONTENT_W - 24 });
    for (let l = 1; l <= 4; l++) {
      const ly = ay + 55 + l * 22;
      doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }
    ay += 170;
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', () => resolve(filePath)));
}

// ============================================================================
// 3. Mindfulness-CBT-Journal_<theme>.pdf (24 Pages)
// ============================================================================
function buildMindfulnessCBTJournal(themeKey, theme) {
  const filename = `Mindfulness-CBT-Journal_${themeKey}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);
  const totalPages = 24;
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Page 1: Cover
  doc.addPage();
  drawCoverPage(
    doc,
    theme,
    'MINDFULNESS & CBT COGNITIVE RESTRUCTURING JOURNAL',
    'Clinical-Grade CBT Thought Records, Cognitive Distortion Identifier, Mood & Sleep Quality Log',
    'MENTAL HEALTH & EMOTIONAL RESILIENCE',
    [
      { title: '10 Core Cognitive Distortions Reference Guide', desc: 'Identify All-or-Nothing Thinking, Catastrophizing, Mind Reading, Emotional Reasoning & Should Statements.' },
      { title: 'CBT Thought Record Worksheets', desc: 'Structured Trigger, Automatic Thought, Cognitive Distortion Checkboxes, Evidence & Rational Reframe.' },
      { title: 'Mood & Sleep Quality Scale (1–10)', desc: 'Daily quantitative mood, anxiety level, sleep duration, and sleep restoration tracking.' },
      { title: 'Behavioral Activation & Somatic Grounding', desc: '5-4-3-2-1 sensory grounding, box breathing, and values-aligned daily action steps.' },
      { title: '30-Day Mood & Sleep Correlation Matrix', desc: 'Visual trend chart linking sleep quality, mindfulness habits, and emotional baseline.' }
    ],
    totalPages
  );

  // Page 2: Cognitive Distortions Reference Guide
  doc.addPage();
  drawPageChrome(doc, theme, 'Mindfulness & CBT Journal', '10 Common Cognitive Distortions Reference Guide', 2, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'COGNITIVE DISTORTIONS IDENTIFIER (CBT REFERENCE)', 'Recognize automatic thinking traps');
  const distCols = [34, 130, 185, 174];
  const distHeaders = ['CODE', 'COGNITIVE DISTORTION', 'DEFINITION / THINKING TRAP', 'RATIONAL REFRAME STRATEGY'];
  const distCodes = ['CD-1', 'CD-2', 'CD-3', 'CD-4', 'CD-5', 'CD-6', 'CD-7', 'CD-8', 'CD-9', 'CD-10'];
  const distInfo = [
    ['All-or-Nothing Thinking', 'Viewing situations in absolute black-and-white categories.', 'Look for shades of gray and partial progress (0–100%).'],
    ['Catastrophizing', 'Predicting the worst-case disaster without realistic odds.', 'Ask: What is the most likely outcome? How would I cope?'],
    ['Mind Reading', 'Assuming you know what others think negatively of you.', 'Separate assumptions from verifiable spoken facts.'],
    ['Fortune Telling', 'Treating negative predictions about the future as fact.', 'Treat predictions as hypotheses to test, not certainties.'],
    ['Emotional Reasoning', '"I feel anxious/guilty, therefore something bad is true."', 'Feelings are valid signals, not objective evidence of truth.'],
    ['Overgeneralization', 'Using "always" or "never" after a single negative event.', 'Isolate the specific event without globalizing it.'],
    ['Mental Filter', 'Fixating on one negative detail and ignoring all positives.', 'Deliberately list 3 neutral or positive facts in the situation.'],
    ['Should Statements', 'Rigid internal rules ("I must", "I should never").', 'Replace "I should" with flexible "I would prefer to".'],
    ['Labeling', 'Assigning global negative labels ("I am a failure").', 'Describe specific behaviors rather than global identity.'],
    ['Personalization', 'Taking 100% blame for external events outside control.', 'Map all external contributing factors beyond yourself.']
  ];
  const afterDistY = drawTable(doc, theme, MARGIN, 90, distCols, distHeaders, 10, 38, distCodes);
  for (let i = 0; i < distInfo.length; i++) {
    const ry = 90 + 38 * (i + 1) + 7;
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
      .text(distInfo[i][0], MARGIN + 38, ry, { width: 122 });
    doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
      .text(distInfo[i][1], MARGIN + 168, ry, { width: 177 })
      .text(distInfo[i][2], MARGIN + 353, ry, { width: 166 });
  }

  // Grounding Box at bottom of Page 2
  const grY = afterDistY + 14;
  drawSectionHeader(doc, theme, MARGIN, grY, CONTENT_W, '5-4-3-2-1 SOMATIC SENSORY GROUNDING PROTOCOL', 'Use during acute anxiety or overwhelm');
  doc.rect(MARGIN, grY + 24, CONTENT_W, 165).fillAndStroke('#ffffff', theme.border);
  const senses = [
    ['5 THINGS YOU CAN SEE:', 'Look around the room and name 5 distinct objects, colors, or shapes in detail.'],
    ['4 THINGS YOU CAN FEEL:', 'Notice 4 tactile sensations (feet on floor, fabric on skin, cool air, chair support).'],
    ['3 THINGS YOU CAN HEAR:', 'Listen closely to 3 ambient sounds in the background without judging them.'],
    ['2 THINGS YOU CAN SMELL:', 'Identify 2 scents in the air, or take two slow, deep nasal inhalations.'],
    ['1 THING YOU VALUE:', 'Name 1 personal strength, anchor truth, or intention for the present moment.']
  ];
  let sy = grY + 34;
  senses.forEach(s => {
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text(s[0], MARGIN + 12, sy, { lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica').fontSize(8).text(s[1], MARGIN + 150, sy, { width: CONTENT_W - 162, lineBreak: false });
    sy += 29;
  });

  // Page 3: 30-Day Mood & Sleep Quality Scale Tracker
  doc.addPage();
  drawPageChrome(doc, theme, 'Mindfulness & CBT Journal', '30-Day Mood, Anxiety & Sleep Quality Scale', 3, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, '30-DAY MOOD & SLEEP QUALITY CORRELATION LOG (SCALE 1–10)', '1 = Lowest / Distressed • 10 = Optimal / Restored');
  const msCols = [38, 60, 56, 62, 62, 62, 183];
  const msHeaders = ['DAY', 'DATE', 'SLEEP HRS', 'SLEEP QUAL (1-10)', 'MOOD (1-10)', 'CALMNESS (1-10)', 'PRIMARY TRIGGER OR GRATITUDE HIGHLIGHT'];
  const msRows = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  drawTable(doc, theme, MARGIN, 90, msCols, msHeaders, 30, 21.5, msRows);

  // Pages 4 to 22 (19 Pages): Full-Page CBT Thought Record & Mindfulness Journal Worksheets
  for (let p = 0; p < 19; p++) {
    const pageNum = 4 + p;
    const sessionNum = p + 1;
    doc.addPage();
    drawPageChrome(doc, theme, 'Mindfulness & CBT Journal', `CBT Thought Record & Mindfulness Log • Session #${sessionNum}`, pageNum, totalPages);

    // Top Box: Mood & Sleep Quality Scale (1-10)
    drawSectionHeader(doc, theme, MARGIN, 62, CONTENT_W, `SESSION #${sessionNum} — DAILY MOOD & SLEEP QUALITY SCALE`, 'DATE: ______________________');
    doc.rect(MARGIN, 84, CONTENT_W, 68).fillAndStroke('#ffffff', theme.border);

    // Mood Scale 1-10
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8.5)
      .text('MOOD RATING (1–10):', MARGIN + 12, 96, { lineBreak: false });
    for (let i = 1; i <= 10; i++) {
      const bx = MARGIN + 128 + (i - 1) * 38;
      doc.roundedRect(bx, 92, 28, 18, 3).lineWidth(0.75).strokeColor(theme.primary).stroke();
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text(String(i), bx, 97, { width: 28, align: 'center', lineBreak: false });
    }

    // Sleep Quality Scale 1-10
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8.5)
      .text('SLEEP QUALITY (1–10):', MARGIN + 12, 126, { lineBreak: false });
    for (let i = 1; i <= 10; i++) {
      const bx = MARGIN + 128 + (i - 1) * 38;
      doc.roundedRect(bx, 122, 28, 18, 3).lineWidth(0.75).strokeColor(theme.secondary).stroke();
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text(String(i), bx, 127, { width: 28, align: 'center', lineBreak: false });
    }

    // Step 1 & Step 2 Side by Side: Activating Trigger & Automatic Thoughts
    const step1Y = 162;
    const halfW = (CONTENT_W - 10) / 2;
    drawSectionHeader(doc, theme, MARGIN, step1Y, halfW, '1. TRIGGER / ACTIVATING SITUATION', 'Who, what, when, where?');
    drawSectionHeader(doc, theme, MARGIN + halfW + 10, step1Y, halfW, '2. AUTOMATIC THOUGHTS & EMOTIONS', 'Intensity (0–100%)');

    doc.rect(MARGIN, step1Y + 22, halfW, 118).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN + halfW + 10, step1Y + 22, halfW, 118).fillAndStroke('#ffffff', theme.border);

    doc.fillColor(theme.muted).font('Helvetica').fontSize(7.5)
      .text('Describe objective facts of the event + physical sensations:', MARGIN + 8, step1Y + 30, { width: halfW - 16, lineBreak: false });
    doc.text('What went through your mind? Rate emotion intensity (0-100%):', MARGIN + halfW + 18, step1Y + 30, { width: halfW - 16, lineBreak: false });

    for (let l = 1; l <= 4; l++) {
      const ly = step1Y + 42 + l * 21;
      doc.moveTo(MARGIN + 8, ly).lineTo(MARGIN + halfW - 8, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
      doc.moveTo(MARGIN + halfW + 18, ly).lineTo(PAGE_W - MARGIN - 8, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }

    // Step 3: Cognitive Distortions Checkboxes
    const step3Y = 312;
    drawSectionHeader(doc, theme, MARGIN, step3Y, CONTENT_W, '3. COGNITIVE DISTORTIONS IDENTIFIED', 'Check all thinking traps present');
    doc.rect(MARGIN, step3Y + 22, CONTENT_W, 56).fillAndStroke(theme.light, theme.border);
    const distortionsList = [
      'All-or-Nothing Thinking', 'Catastrophizing', 'Mind Reading', 'Fortune Telling', 'Emotional Reasoning',
      'Overgeneralization', 'Mental Filtering', 'Should Statements', 'Negative Labeling', 'Personalization'
    ];
    distortionsList.forEach((dName, di) => {
      const col = di % 5;
      const row = Math.floor(di / 5);
      const dx = MARGIN + 10 + col * 102;
      const dy = step3Y + 31 + row * 22;
      drawCheckbox(doc, theme, dx, dy, 9.5);
      doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
        .text(dName, dx + 13, dy + 1, { width: 88, lineBreak: false });
    });

    // Step 4: Evidence For vs Evidence Against
    const step4Y = 398;
    drawSectionHeader(doc, theme, MARGIN, step4Y, halfW, '4A. FACTUAL EVIDENCE FOR THE THOUGHT', 'Strict verifiable facts only');
    drawSectionHeader(doc, theme, MARGIN + halfW + 10, step4Y, halfW, '4B. FACTUAL EVIDENCE AGAINST THE THOUGHT', 'What contradicts the fear?');
    doc.rect(MARGIN, step4Y + 22, halfW, 108).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN + halfW + 10, step4Y + 22, halfW, 108).fillAndStroke('#ffffff', theme.border);
    for (let l = 1; l <= 4; l++) {
      const ly = step4Y + 30 + l * 21;
      doc.moveTo(MARGIN + 8, ly).lineTo(MARGIN + halfW - 8, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
      doc.moveTo(MARGIN + halfW + 18, ly).lineTo(PAGE_W - MARGIN - 8, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }

    // Step 5: Balanced Rational Reframe & Outcome Re-rating
    const step5Y = 538;
    drawSectionHeader(doc, theme, MARGIN, step5Y, CONTENT_W, '5. RATIONAL REFRAME & COMPASSIONATE BALANCED THOUGHT', 'Re-rate Emotion (0–100%): _______%');
    doc.rect(MARGIN, step5Y + 22, CONTENT_W, 110).fillAndStroke('#ffffff', theme.border);
    doc.fillColor(theme.muted).font('Helvetica').fontSize(7.5)
      .text('Synthesize both sides of the evidence into a realistic, grounded, and self-compassionate perspective:', MARGIN + 10, step5Y + 30, { lineBreak: false });
    for (let l = 1; l <= 3; l++) {
      const ly = step5Y + 42 + l * 22;
      doc.moveTo(MARGIN + 10, ly).lineTo(PAGE_W - MARGIN - 10, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }

    // Step 6: Mindfulness & Gratitude Anchor
    const step6Y = 680;
    drawSectionHeader(doc, theme, MARGIN, step6Y, CONTENT_W, '6. MINDFULNESS PRACTICE, GRATITUDE & INTENTIONAL ACTION', 'Daily Grounding');
    doc.rect(MARGIN, step6Y + 22, CONTENT_W, 92).fillAndStroke('#ffffff', theme.border);

    const mHabits = ['10m Breathwork/Meditation', 'Mindful Walk Outdoors', 'Body Scan Release', 'Journaling Completed'];
    mHabits.forEach((mh, mi) => {
      const hx = MARGIN + 12 + mi * 126;
      drawCheckbox(doc, theme, hx, step6Y + 32, 9.5);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.5)
        .text(mh, hx + 13, step6Y + 33, { lineBreak: false });
    });

    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
      .text('TODAY I AM GRATEFUL FOR:', MARGIN + 12, step6Y + 56, { lineBreak: false });
    doc.moveTo(MARGIN + 135, step6Y + 65).lineTo(PAGE_W - MARGIN - 12, step6Y + 65).lineWidth(0.5).strokeColor(theme.border).stroke();

    doc.text('ONE SMALL CONSTRUCTIVE ACTION:', MARGIN + 12, step6Y + 80, { lineBreak: false });
    doc.moveTo(MARGIN + 165, step6Y + 89).lineTo(PAGE_W - MARGIN - 12, step6Y + 89).lineWidth(0.5).strokeColor(theme.border).stroke();
  }

  // Page 23: Behavioral Activation & Core Beliefs Worksheet
  doc.addPage();
  drawPageChrome(doc, theme, 'Mindfulness & CBT Journal', 'Core Belief Restructuring & Behavioral Activation', 23, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'CORE BELIEF RESTRUCTURING WORKSHEET', 'Shift deep root narratives');
  doc.rect(MARGIN, 88, CONTENT_W, 240).fillAndStroke('#ffffff', theme.border);
  const cbFields = [
    'Old Limiting Core Belief (e.g., "I must be perfect to be worthy"):',
    'Origin / How This Belief Tried to Protect Me in the Past:',
    'New Healthy, Flexible Core Belief (e.g., "I am resilient and worthy as I grow"):',
    '3 Real-Life Examples & Experiences That Support My New Core Belief:'
  ];
  let cby = 102;
  cbFields.forEach(cf => {
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text(cf, MARGIN + 12, cby, { lineBreak: false });
    doc.moveTo(MARGIN + 12, cby + 24).lineTo(PAGE_W - MARGIN - 12, cby + 24).lineWidth(0.5).strokeColor(theme.border).stroke();
    doc.moveTo(MARGIN + 12, cby + 42).lineTo(PAGE_W - MARGIN - 12, cby + 42).lineWidth(0.5).strokeColor(theme.border).stroke();
    cby += 56;
  });

  drawSectionHeader(doc, theme, MARGIN, 346, CONTENT_W, 'BEHAVIORAL ACTIVATION & MOOD ELEVATION MENU', 'Activities ranked by Mastery & Pleasure');
  const baCols = [195, 110, 72, 72, 74];
  const baHeaders = ['ACTIVITY / HEALTHY COPING ACTION', 'CATEGORY', 'MASTERY (1-10)', 'PLEASURE (1-10)', 'COMPLETED'];
  const baRows = Array.from({ length: 14 }, (_, i) => `Activity #${i + 1}`);
  drawTable(doc, theme, MARGIN, 372, baCols, baHeaders, 14, 24, baRows);

  // Page 24: Monthly Emotional Resilience & CBT Progress Reflections
  doc.addPage();
  drawPageChrome(doc, theme, 'Mindfulness & CBT Journal', 'Monthly Mindfulness & Cognitive Progress Review', 24, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'MONTHLY MENTAL HEALTH & CBT REFLECTION AUDIT', 'Track emotional growth');
  const cbtPrompts = [
    { title: '1. MOST FREQUENT COGNITIVE DISTORTIONS NOTICED THIS MONTH', desc: 'Which automatic thinking traps came up most often, and how quickly was I able to catch them?' },
    { title: '2. SLEEP QUALITY & EMOTIONAL REGULATION INSIGHTS', desc: 'How did my sleep duration and sleep quality scores correlate with my daytime resilience and mood?' },
    { title: '3. BIGGEST COGNITIVE REFRAME BREAKTHROUGH', desc: 'Which rational reframe brought me the greatest relief or perspective shift this month?' },
    { title: '4. COMPASSIONATE INTENTIONS FOR NEXT MONTH', desc: 'What boundaries, mindfulness habits, and self-care practices will I prioritize moving forward?' }
  ];
  let cpy = 94;
  cbtPrompts.forEach(cp => {
    doc.rect(MARGIN, cpy, CONTENT_W, 155).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, cpy, CONTENT_W, 24).fill(theme.light);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5).text(cp.title, MARGIN + 12, cpy + 7, { lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(8).text(cp.desc, MARGIN + 12, cpy + 32, { width: CONTENT_W - 24 });
    for (let l = 1; l <= 4; l++) {
      const ly = cpy + 54 + l * 22;
      doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }
    cpy += 170;
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', () => resolve(filePath)));
}

// ============================================================================
// 4. Running-Marathon-Log_<theme>.pdf (20 Pages)
// ============================================================================
function buildRunningMarathonLog(themeKey, theme) {
  const filename = `Running-Marathon-Log_${themeKey}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);
  const totalPages = 20;
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Page 1: Cover
  doc.addPage();
  drawCoverPage(
    doc,
    theme,
    'MARATHON & ENDURANCE RUNNING TRAINING LOG',
    '16-Week Race Prep Schedule, Daily Run Distance/Pace/HR Zone Table, Shoe Mileage & Race Fueling',
    'ENDURANCE PERFORMANCE & RACE PREP',
    [
      { title: '16-Week Marathon Race Prep Master Schedule', desc: 'Periodized Base, Build, Peak & Taper weekly mileage overview with long run progression.' },
      { title: 'Heart Rate Zones (Z1–Z5) & Pace Reference', desc: 'Aerobic threshold, lactate threshold, VO2 max zones, and target split calculator.' },
      { title: '16-Week Daily Run Distance, Pace & HR Tables', desc: 'Complete 16-week daily running log tables with RPE, cadence, elevation & recovery notes.' },
      { title: 'Running Shoe Mileage Rotation Tracker', desc: 'Track multiple pairs of trainers & carbon race shoes up to 400–500 mile retirement.' },
      { title: 'Race Day Nutrition, Carb-Load & Gel Strategy', desc: 'Mile-by-mile hydration, carbohydrate gram targets, caffeine timing & race morning checklist.' }
    ],
    totalPages
  );

  // Page 2: 16-Week Race Prep Schedule Overview
  doc.addPage();
  drawPageChrome(doc, theme, 'Running & Marathon Log', '16-Week Race Prep Master Schedule', 2, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, '16-WEEK MARATHON PERIODIZATION & RACE PREP SCHEDULE', 'Base • Build • Peak • Taper');
  const schedCols = [48, 56, 56, 56, 56, 56, 56, 68, 71];
  const schedHeaders = ['WEEK', 'PHASE', 'TUE RUN', 'WED RUN', 'THU RUN', 'SAT RUN', 'SUN LONG', 'PLAN MI/KM', 'ACTUAL MI/KM'];
  const schedWeeks = Array.from({ length: 16 }, (_, i) => `Week ${i + 1}`);
  const phases = [
    'Base 1', 'Base 2', 'Base 3', 'Deload 1',
    'Build 1', 'Build 2', 'Build 3', 'Deload 2',
    'Peak 1', 'Peak 2', 'Peak 3', 'Peak 4',
    'Peak 5', 'Taper 1', 'Taper 2', 'RACE WK'
  ];
  const afterSchedY = drawTable(doc, theme, MARGIN, 90, schedCols, schedHeaders, 16, 26.5, schedWeeks);
  for (let i = 0; i < 16; i++) {
    const ry = 90 + 26.5 * (i + 1) + 9;
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
      .text(phases[i], MARGIN + 48, ry, { width: 56, align: 'center', lineBreak: false });
  }

  // Heart Rate Zones Reference at bottom of Page 2
  drawSectionHeader(doc, theme, MARGIN, afterSchedY + 14, CONTENT_W, 'HEART RATE ZONES (Z1–Z5) & TRAINING PACE ZONES', 'MAX HR: ______ BPM | RESTING HR: ______ BPM');
  const hrCols = [65, 90, 95, 95, 178];
  const hrHeaders = ['HR ZONE', '% MAX HR', 'MY BPM RANGE', 'TARGET PACE', 'PHYSIOLOGICAL ADAPTATION'];
  const hrRows = ['Zone 1 (Easy)', 'Zone 2 (Aerobic)', 'Zone 3 (Tempo)', 'Zone 4 (Threshold)', 'Zone 5 (VO2 Max)'];
  const hrDesc = [
    ['50–60%', 'Active recovery, capillary density & circulation'],
    ['60–70%', 'Mitochondrial density, fat oxidation & endurance base'],
    ['70–80%', 'Marathon race pace efficiency & glycogen economy'],
    ['80–90%', 'Lactate clearance threshold & sustained speed'],
    ['90–100%', 'Maximum oxygen uptake (VO2 Max) & neuromuscular power']
  ];
  const afterHrY = drawTable(doc, theme, MARGIN, afterSchedY + 40, hrCols, hrHeaders, 5, 22, hrRows);
  for (let i = 0; i < 5; i++) {
    const ry = afterSchedY + 40 + 22 * (i + 1) + 7;
    doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
      .text(hrDesc[i][0], MARGIN + 65, ry, { width: 90, align: 'center', lineBreak: false })
      .text(hrDesc[i][1], MARGIN + 349, ry, { width: 170, lineBreak: false });
  }

  // Pages 3 to 18 (16 Pages): 16-Week Daily Run Distance / Pace / Heart Rate Zone Tables (1 full week per page? Wait: 16 pages = 1 Full Week per page OR 2 weeks per page? Let's check: Pages 3 to 18 is 16 pages! 1 Full Week per page for all 16 weeks!)
  for (let w = 1; w <= 16; w++) {
    const pageNum = 2 + w; // Pages 3..18
    const phaseName = phases[w - 1];
    doc.addPage();
    drawPageChrome(doc, theme, 'Running & Marathon Log', `Week ${w} of 16 Training Log • Phase: ${phaseName}`, pageNum, totalPages);

    drawSectionHeader(
      doc,
      theme,
      MARGIN,
      64,
      CONTENT_W,
      `WEEK ${w} DAILY RUN DISTANCE, PACE & HEART RATE ZONE TABLE (${phaseName.toUpperCase()})`,
      'WEEK DATES: ___________________'
    );

    const runCols = [52, 82, 54, 58, 54, 52, 48, 48, 75];
    const runHeaders = ['DAY', 'WORKOUT TYPE', 'DIST (MI/KM)', 'DURATION', 'AVG PACE', 'AVG HR', 'HR ZONE', 'RPE 1-10', 'SHOE / ELEVATION'];
    const runDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'WEEK TOTAL'];
    const afterRunTblY = drawTable(doc, theme, MARGIN, 90, runCols, runHeaders, runDays.length, 32, runDays);

    // Key Workout Splits & Long Run Breakdown Box
    drawSectionHeader(doc, theme, MARGIN, afterRunTblY + 16, CONTENT_W, `WEEK ${w} KEY WORKOUT SPLITS & LONG RUN FUELING LOG`, 'Track intervals & long run nutrition');
    const splitY = afterRunTblY + 42;
    const halfW = (CONTENT_W - 10) / 2;

    doc.rect(MARGIN, splitY, halfW, 165).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, splitY, halfW, 22).fill(theme.light);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5)
      .text('SPEED / TEMPO INTERVAL SPLITS', MARGIN + 10, splitY + 6.5, { lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(7.5)
      .text('Workout Prescription: ________________________________________', MARGIN + 10, splitY + 30, { lineBreak: false });
    for (let s = 1; s <= 5; s++) {
      const sy = splitY + 42 + s * 22;
      doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
        .text(`Rep/Split ${s}: ____________  Pace: ________  HR: ______`, MARGIN + 10, sy - 9, { lineBreak: false });
      doc.moveTo(MARGIN + 10, sy).lineTo(MARGIN + halfW - 10, sy).lineWidth(0.4).strokeColor(theme.border).stroke();
    }

    doc.rect(MARGIN + halfW + 10, splitY, halfW, 165).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN + halfW + 10, splitY, halfW, 22).fill(theme.light);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5)
      .text('SUNDAY LONG RUN NUTRITION & HYDRATION', MARGIN + halfW + 20, splitY + 6.5, { lineBreak: false });
    const lrFields = [
      'Pre-Run Meal & Timing:',
      'Weather / Temp / Humidity:',
      'Gels / Carbs Consumed (g/hr):',
      'Fluids & Electrolytes Taken:',
      'GI Comfort & Late-Run Energy:'
    ];
    lrFields.forEach((lf, li) => {
      const ly = splitY + 36 + li * 25;
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.5)
        .text(lf, MARGIN + halfW + 20, ly, { lineBreak: false });
      doc.moveTo(MARGIN + halfW + 20, ly + 17).lineTo(PAGE_W - MARGIN - 10, ly + 17).lineWidth(0.4).strokeColor(theme.border).stroke();
    });

    // Strength, Mobility & Recovery Checkboxes + Weekly Notes
    const recY = splitY + 180;
    drawSectionHeader(doc, theme, MARGIN, recY, CONTENT_W, `WEEK ${w} STRENGTH, MOBILITY & INJURY PREVENTION CHECKLIST`, 'Stay durable & healthy');
    doc.rect(MARGIN, recY + 22, CONTENT_W, 136).fillAndStroke('#ffffff', theme.border);

    const recHabits = [
      '2x Lower Body & Core Strength', 'Daily Hip & Ankle Mobility', 'Foam Rolling / Myofascial Release',
      '8+ Hours Sleep Before Long Run', 'Post-Run Protein + Carb Refuel', 'Zero Sharp Pain / Niggles Monitored'
    ];
    recHabits.forEach((rh, ri) => {
      const col = ri % 3;
      const row = Math.floor(ri / 3);
      const hx = MARGIN + 12 + col * 172;
      const hy = recY + 32 + row * 20;
      drawCheckbox(doc, theme, hx, hy, 9.5);
      doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
        .text(rh, hx + 13, hy + 1, { lineBreak: false });
    });

    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
      .text('WEEKLY COACH / SELF-ASSESSMENT & BODY FEEDBACK:', MARGIN + 12, recY + 78, { lineBreak: false });
    for (let l = 1; l <= 3; l++) {
      const ly = recY + 86 + l * 20;
      doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }
  }

  // Page 19: Shoe Mileage Tracker & Gear Log
  doc.addPage();
  drawPageChrome(doc, theme, 'Running & Marathon Log', 'Running Shoe Mileage Tracker & Rotation Log', 19, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'SHOE MILEAGE TRACKER (RETIRE AT 350–500 MILES / 550–800 KM)', 'Rotate shoes to reduce injury risk');

  for (let s = 1; s <= 4; s++) {
    const sy = 90 + (s - 1) * 172;
    doc.rect(MARGIN, sy, CONTENT_W, 160).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, sy, CONTENT_W, 24).fill(theme.light);
    doc.rect(MARGIN, sy, 6, 24).fill(theme.primary);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5)
      .text(`SHOE #${s} — BRAND & MODEL: ____________________________________`, MARGIN + 14, sy + 7, { lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
      .text('ROLE (Daily / Speed / Race): ________________   START DATE: ____________   MAX LIMIT: ______ mi', MARGIN + 290, sy + 7.5, { lineBreak: false });

    // 20 checkoff boxes of 25 miles each = 500 miles
    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5)
      .text('MILEAGE PROGRESS CHECKOFF (EACH BOX = 25 MILES / 40 KM):', MARGIN + 14, sy + 34, { lineBreak: false });

    const boxW = (CONTENT_W - 28) / 10;
    for (let b = 0; b < 20; b++) {
      const row = Math.floor(b / 10);
      const col = b % 10;
      const bx = MARGIN + 14 + col * boxW;
      const by = sy + 48 + row * 34;
      doc.rect(bx, by, boxW - 4, 28).fillAndStroke('#ffffff', theme.border);
      drawCheckbox(doc, theme, bx + 4, by + 8, 10);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.5)
        .text(`${(b + 1) * 25}m`, bx + 17, by + 10, { lineBreak: false });
    }

    doc.fillColor(theme.muted).font('Helvetica').fontSize(7.5)
      .text('Cushion / Outsole Wear Notes: ___________________________________________________________________________________________', MARGIN + 14, sy + 132, { lineBreak: false });
  }

  // Page 20: Race Day Nutrition Plan, Pacing Strategy & Gear Checklist
  doc.addPage();
  drawPageChrome(doc, theme, 'Running & Marathon Log', 'Race Day Nutrition Plan & Marathon Execution Strategy', 20, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'MARATHON RACE DAY OVERVIEW & PACING SPLITS', 'Nothing new on race day');
  doc.rect(MARGIN, 88, CONTENT_W, 82).fillAndStroke('#ffffff', theme.border);
  const raceMeta = [
    ['RACE NAME:', MARGIN + 12, 100],
    ['RACE DATE & START TIME:', MARGIN + 280, 100],
    ['A-GOAL FINISH TIME & PACE:', MARGIN + 12, 124],
    ['B-GOAL FINISH TIME & PACE:', MARGIN + 280, 124],
    ['5K / 10K / HALF MARATHON SPLIT TARGETS:', MARGIN + 12, 148]
  ];
  raceMeta.forEach(rm => {
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8).text(rm[0], rm[1], rm[2], { lineBreak: false });
  });

  drawSectionHeader(doc, theme, MARGIN, 182, CONTENT_W, 'RACE DAY NUTRITION & IN-RACE GEL / HYDRATION TIMELINE', 'Target 60–90g Carbs/Hour');
  const nutCols = [85, 165, 85, 85, 103];
  const nutHeaders = ['MILE / KM MARK', 'FUEL / ENERGY GEL / CHEWS', 'CARBS (g)', 'FLUID / SODIUM', 'CAFFEINE / NOTES'];
  const nutRows = [
    '3 Days Pre-Race',
    'Morning (3h Pre)',
    'Start Corral (-15m)',
    'Mile 4 / 6.5 km',
    'Mile 8 / 13 km',
    'Mile 12 / 19 km',
    'Mile 16 / 26 km',
    'Mile 20 / 32 km',
    'Mile 23 / 37 km',
    'Post-Finish Refuel'
  ];
  const afterNutY = drawTable(doc, theme, MARGIN, 208, nutCols, nutHeaders, nutRows.length, 24, nutRows);

  drawSectionHeader(doc, theme, MARGIN, afterNutY + 16, CONTENT_W, 'RACE EVE FLAT-LAY GEAR & LOGISTICS CHECKLIST', 'Lay out everything the night before');
  const gearY = afterNutY + 40;
  doc.rect(MARGIN, gearY, CONTENT_W, 130).fillAndStroke('#ffffff', theme.border);
  const gearItems = [
    'Race Bib + Safety Pins / Bib Belt', 'Tested Race Shoes (Double Knotted)', 'Anti-Chafe Balm (BodyGlide / Tape)',
    'GPS Watch (100% Charged)', 'Race Singlet / Shorts / Tested Socks', 'All Energy Gels + Salt Capsules',
    'Throwaway Warmup Layer / Gloves', 'Sunscreen / Running Cap / Sunglasses', 'Pre-Race Breakfast & Coffee Ready',
    'Gear Check Bag + Post-Race Slides', 'ID / Credit Card / Hotel Key', 'Transport & Corral Close Time Verified'
  ];
  gearItems.forEach((gi, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const gx = MARGIN + 12 + col * 172;
    const gy = gearY + 14 + row * 28;
    drawCheckbox(doc, theme, gx, gy, 10);
    doc.fillColor(theme.dark).font('Helvetica').fontSize(8)
      .text(gi, gx + 14, gy + 1.5, { width: 154, lineBreak: false });
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', () => resolve(filePath)));
}

// ============================================================================
// 5. Holistic-Self-Care-Planner_<theme>.pdf (16 Pages)
// ============================================================================
function buildHolisticSelfCarePlanner(themeKey, theme) {
  const filename = `Holistic-Self-Care-Planner_${themeKey}.pdf`;
  const filePath = path.join(OUTPUT_DIR, filename);
  const totalPages = 16;
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Page 1: Cover
  doc.addPage();
  drawCoverPage(
    doc,
    theme,
    'HOLISTIC SELF-CARE & NERVOUS SYSTEM WELLNESS PLANNER',
    'AM/PM Skincare & Supplement Routine, Digital Detox Tracker, Somatic Regulation & Wellness Audit',
    'RESTORATIVE WELLNESS & LONGEVITY',
    [
      { title: 'AM / PM Skincare & Supplement Routine Builder', desc: 'Active ingredient cycling (Vitamin C, Retinoid, Exfoliant, Barrier Repair) & micronutrient schedule.' },
      { title: 'Digital Detox & Screen-Free Boundaries Tracker', desc: 'Morning sunlight before screens, phone-free bedroom, and 30-day screen time reduction log.' },
      { title: 'Nervous System Regulation Menu', desc: 'Vagus nerve toning, somatic release exercises, breathwork protocols, and co-regulation tools.' },
      { title: '10-Page Daily Holistic Self-Care Logs', desc: '20 Complete Daily Spreads with AM/PM skincare & supplement checkboxes, detox & somatic check-ins.' },
      { title: 'Monthly Holistic Wellness Wheel Audit', desc: '8-Dimension life balance score (Physical, Emotional, Social, Spiritual, Rest, Environment, Purpose, Play).' }
    ],
    totalPages
  );

  // Page 2: AM / PM Skincare Cycling & Supplement Stack Master Protocol
  doc.addPage();
  drawPageChrome(doc, theme, 'Holistic Self-Care Planner', 'AM/PM Skincare Cycling & Supplement Protocol', 2, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'AM & PM SKINCARE ROUTINE ARCHITECTURE & WEEKLY SKIN CYCLING', 'Protect AM • Repair PM');
  const skinCols = [58, 150, 150, 165];
  const skinHeaders = ['STEP', 'MORNING (AM) PROTECTION', 'EVENING (PM) RECOVERY', 'PRODUCT NAME / ACTIVE INGREDIENT'];
  const skinRows = [
    'Step 1',
    'Step 2',
    'Step 3',
    'Step 4',
    'Step 5'
  ];
  const skinData = [
    ['Gentle Water / Hydrating Cleanse', 'Double Cleanse (Oil + Gentle Gel)', ''],
    ['Hydrating Toner / Essence Mist', 'Hydrating Essence / Peptide Serum', ''],
    ['Vitamin C / Antioxidant Serum', 'Skin Cycling Active (See Below)', ''],
    ['Barrier Moisturizer & Eye Cream', 'Ceramide / Lipid Rich Night Cream', ''],
    ['Broad-Spectrum SPF 50+ Sunscreen', 'Targeted Spot / Lip Sleeping Mask', '']
  ];
  const afterSkinY = drawTable(doc, theme, MARGIN, 90, skinCols, skinHeaders, 5, 25, skinRows);
  for (let i = 0; i < 5; i++) {
    const ry = 90 + 25 * (i + 1) + 8;
    doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
      .text(skinData[i][0], MARGIN + 62, ry, { width: 142, lineBreak: false })
      .text(skinData[i][1], MARGIN + 212, ry, { width: 142, lineBreak: false });
  }

  // 7-Night Skin Cycling Schedule
  drawSectionHeader(doc, theme, MARGIN, afterSkinY + 14, CONTENT_W, '7-NIGHT PM SKIN CYCLING SCHEDULE', 'Avoid barrier over-exfoliation');
  const cycW = CONTENT_W / 7;
  const days7 = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const cycDefault = ['Exfoliate', 'Retinoid', 'Barrier Rest', 'Barrier Rest', 'Exfoliate', 'Retinoid', 'Mask / Rest'];
  for (let d = 0; d < 7; d++) {
    const dx = MARGIN + d * cycW;
    const dy = afterSkinY + 38;
    doc.rect(dx, dy, cycW, 56).fillAndStroke('#ffffff', theme.border);
    doc.rect(dx, dy, cycW, 18).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8)
      .text(days7[d], dx, dy + 5, { width: cycW, align: 'center', lineBreak: false });
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
      .text(cycDefault[d], dx + 4, dy + 25, { width: cycW - 8, align: 'center', lineBreak: false });
    drawCheckbox(doc, theme, dx + (cycW - 10) / 2, dy + 39, 10);
  }

  // Daily Supplement & Longevity Stack Table
  drawSectionHeader(doc, theme, MARGIN, afterSkinY + 108, CONTENT_W, 'DAILY SUPPLEMENT, ADAPTOGEN & MICRONUTRIENT PROTOCOL', 'Consult physician as needed');
  const supCols = [135, 85, 95, 208];
  const supHeaders = ['SUPPLEMENT / NUTRIENT', 'DOSAGE', 'TIMING (AM/PM)', 'PRIMARY HEALTH & CELLULAR PURPOSE'];
  const supRows = [
    'Morning Empty Stomach',
    'Morning With Breakfast',
    'Morning With Breakfast',
    'Midday / Afternoon',
    'Evening With Dinner',
    'Evening Before Bed (PM)',
    'Evening Before Bed (PM)'
  ];
  drawTable(doc, theme, MARGIN, afterSkinY + 134, supCols, supHeaders, supRows.length, 25, supRows);

  // Page 3: Digital Detox Tracker
  doc.addPage();
  drawPageChrome(doc, theme, 'Holistic Self-Care Planner', 'Digital Detox Tracker & Screen Boundary Log', 3, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'DIGITAL DETOX RULES & DOPAMINE RESET BOUNDARIES', 'Reclaim attention & deep rest');
  const detY = 88;
  doc.rect(MARGIN, detY, CONTENT_W, 108).fillAndStroke('#ffffff', theme.border);
  const detoxRules = [
    '1. NO PHONE FOR FIRST 60 MINUTES AFTER WAKING: Get natural outdoor sunlight & hydrate before checking messages.',
    '2. DIGITAL SUNSET 60 MINUTES BEFORE SLEEP: Switch devices to Airplane Mode / Grayscale and read a physical book.',
    '3. PHONE-FREE MEALS & DEEP WORK BLOCKS: Keep phone in another room during meals and 90-minute focus sessions.',
    '4. INTENTIONAL SOCIAL MEDIA WINDOWS: Zero mindless scrolling in bed; batch social apps to a 20-minute window.'
  ];
  detoxRules.forEach((dr, di) => {
    const ry = detY + 12 + di * 23;
    drawCheckbox(doc, theme, MARGIN + 12, ry, 10);
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
      .text(dr, MARGIN + 28, ry + 1.5, { width: CONTENT_W - 40, lineBreak: false });
  });

  drawSectionHeader(doc, theme, MARGIN, 210, CONTENT_W, '30-DAY DIGITAL DETOX & SCREEN TIME TRACKER', 'Track daily screen hours & boundaries');
  const dtCols = [42, 68, 78, 78, 78, 179];
  const dtHeaders = ['DAY', 'SCREEN HRS', 'NO AM PHONE', 'NO PM PHONE', 'OUTDOOR SUN', 'ANALOG REPLACEMENT ACTIVITY / CLARITY'];
  const dtRows = Array.from({ length: 24 }, (_, i) => `Day ${i + 1}`);
  drawTable(doc, theme, MARGIN, 236, dtCols, dtHeaders, 24, 21.5, dtRows);

  // Page 4: Nervous System Regulation Menu
  doc.addPage();
  drawPageChrome(doc, theme, 'Holistic Self-Care Planner', 'Nervous System Regulation Menu & Somatic Toolkit', 4, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'NERVOUS SYSTEM REGULATION MENU (POLY-VAGAL & SOMATIC TOOLKIT)', 'Choose tools by current state');
  const menuQuadrants = [
    {
      title: 'SYMPATHETIC OVERDRIVE (ANXIOUS / WIRED / STRESSED)',
      sub: 'Goal: Down-regulate cortisol & activate ventral vagal safety',
      items: [
        'Physiological Sigh (Double inhale through nose, long slow exhale x 10)',
        '4-7-8 Parasympathetic Breathwork for 4 minutes',
        'Cold Water Face Immersion / Ice Pack on Vagus Nerve (Side of neck)',
        'Weighted Blanket + Legs-Up-The-Wall Pose (Viparita Karani) for 10m',
        'Humming, Chanting, or Gargling to stimulate vagus nerve vocal cords',
        'Bilateral Stimulation Walk outdoors without headphones'
      ]
    },
    {
      title: 'DORSAL VAGAL SHUTDOWN (NUMB / BURNT OUT / LOW ENERGY)',
      sub: 'Goal: Gentle mobilization, warmth & sensory awakening',
      items: [
        'Somatic Shaking & Bouncing on heels for 2–3 minutes to release stagnation',
        'Warm Shower or Epsom Salt Bath with invigorating citrus/eucalyptus aroma',
        'Sun Salutations or Gentle Spinal Cat-Cow Flows with music',
        'Step outside into direct morning sunlight for 10 minutes',
        'Co-regulate: Voice note or hug a trusted friend, partner, or pet',
        'Complete 1 tiny micro-task (make bed, drink warm herbal tea)'
      ]
    },
    {
      title: 'SENSORY OVERLOAD & DIGITAL FATIGUE RESET',
      sub: 'Goal: Reduce cognitive input & soothe visual/auditory cortex',
      items: [
        'Palming Eyes: Rub palms warm and cup over closed eyes in darkness (3m)',
        '20-Minute NSDR (Non-Sleep Deep Rest) or Yoga Nidra Audio Scan',
        'Noise-Canceling Silence or Brown/Pink Noise in a dim room',
        'Barefoot Earthing / Grounding on grass, soil, or sand for 15 minutes',
        'Brain Dump all open mental loops onto paper to clear working memory',
        'Sip warm Chamomile, Lemon Balm, or L-Theanine Green Tea'
      ]
    },
    {
      title: 'EVENING WIND-DOWN & DEEP PARASYMPATHETIC REST',
      sub: 'Goal: Lower core body temperature & prepare for REM/Deep sleep',
      items: [
        'Dim overhead lights to warm amber/candlelight 90 minutes before bed',
        'Lymphatic Facial Gua Sha or Self-Abhyanga Warm Oil Massage',
        'Take Evening Magnesium Glycinate / Tart Cherry / Herbal Tea',
        '10-Minute Gentle Yin Yoga Hip & Hamstring Release on floor',
        'Write 3 Daily Wins & tomorrow’s top 3 priorities to close the day',
        'Cool bedroom temperature to 65–68°F (18–20°C) with blackout darkness'
      ]
    }
  ];

  let mqy = 92;
  menuQuadrants.forEach(mq => {
    doc.rect(MARGIN, mqy, CONTENT_W, 165).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, mqy, CONTENT_W, 24).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
      .text(mq.title, MARGIN + 12, mqy + 7, { lineBreak: false });
    doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.5)
      .text(mq.sub, MARGIN + 12, mqy + 29, { lineBreak: false });

    mq.items.forEach((it, ii) => {
      const iy = mqy + 44 + ii * 19;
      drawCheckbox(doc, theme, MARGIN + 12, iy, 9.5);
      doc.fillColor(theme.dark).font('Helvetica').fontSize(8)
        .text(it, MARGIN + 26, iy + 1, { width: CONTENT_W - 38, lineBreak: false });
    });
    mqy += 174;
  });

  // Pages 5 to 14 (10 Pages): Daily Holistic Self-Care Logs (2 Full Days per Page = 20 Days)
  for (let p = 0; p < 10; p++) {
    const pageNum = 5 + p;
    const dayA = p * 2 + 1;
    const dayB = dayA + 1;
    doc.addPage();
    drawPageChrome(doc, theme, 'Holistic Self-Care Planner', `Daily Holistic Self-Care Log • Days ${dayA} & ${dayB}`, pageNum, totalPages);

    [dayA, dayB].forEach((dayNum, idx) => {
      const topY = idx === 0 ? 60 : 434;
      doc.save();
      doc.rect(MARGIN, topY, CONTENT_W, 362).fillAndStroke('#ffffff', theme.border);

      // Header Bar
      doc.rect(MARGIN, topY, CONTENT_W, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9.5)
        .text(`DAY ${dayNum} — HOLISTIC SELF-CARE & NERVOUS SYSTEM LOG`, MARGIN + 10, topY + 7, { lineBreak: false });
      doc.fillColor('#ffffff').font('Helvetica').fontSize(8.5)
        .text('DATE: ___________________   SLEEP: ______ hrs   ENERGY (1-10): ______', MARGIN + 220, topY + 7, {
          width: CONTENT_W - 230,
          align: 'right',
          lineBreak: false
        });

      const halfW = (CONTENT_W - 28) / 2;
      const leftX = MARGIN + 10;
      const rightX = MARGIN + 18 + halfW;

      // Left Box: AM Skincare & Supplements
      doc.rect(leftX, topY + 32, halfW, 132).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5)
        .text('MORNING (AM) SKINCARE & SUPPLEMENTS', leftX + 8, topY + 40, { lineBreak: false });
      const amItems = [
        'AM Cleanse & Hydrating Mist',
        'Vitamin C / Antioxidant Serum',
        'Moisturizer + SPF 50+ Protection',
        'Morning Hydration (500mL + Electrolytes)',
        'AM Supplements / Vitamins Taken',
        '10m Morning Sunlight Before Phone'
      ];
      amItems.forEach((ai, aIdx) => {
        const ay = topY + 56 + aIdx * 17;
        drawCheckbox(doc, theme, leftX + 8, ay, 9);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
          .text(ai, leftX + 21, ay + 1, { width: halfW - 28, lineBreak: false });
      });

      // Right Box: PM Skincare & Supplements
      doc.rect(rightX, topY + 32, halfW, 132).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5)
        .text('EVENING (PM) SKINCARE & WIND-DOWN', rightX + 8, topY + 40, { lineBreak: false });
      const pmItems = [
        'PM Double Cleanse (SPF/Makeup Off)',
        'Night Active (Retinoid / Exfoliant / Peptide)',
        'Barrier Repair Moisturizer / Facial Oil',
        'PM Magnesium & Evening Supplements',
        'Herbal Tea & Warm Shower / Bath',
        'Digital Sunset (60m Screen-Free Before Bed)'
      ];
      pmItems.forEach((pi, pIdx) => {
        const py = topY + 56 + pIdx * 17;
        drawCheckbox(doc, theme, rightX + 8, py, 9);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7.5)
          .text(pi, rightX + 21, py + 1, { width: halfW - 28, lineBreak: false });
      });

      // Nervous System State & Regulation Tool Used
      const nsY = topY + 172;
      doc.rect(leftX, nsY, CONTENT_W - 20, 56).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('NERVOUS SYSTEM STATE TODAY:', leftX + 8, nsY + 8, { lineBreak: false });
      const nsStates = ['Grounded / Calm', 'Anxious / Wired', 'Overwhelmed', 'Tired / Low Energy', 'Balanced & Present'];
      nsStates.forEach((st, si) => {
        const sx = leftX + 148 + si * 70;
        drawCheckbox(doc, theme, sx, nsY + 7, 9);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7)
          .text(st, sx + 11, nsY + 8, { lineBreak: false });
      });

      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('SOMATIC REGULATION TOOL USED:', leftX + 8, nsY + 30, { lineBreak: false });
      const nsTools = ['Breathwork', 'Nature Walk', 'Stretching/Yoga', 'NSDR / Rest', 'Cold/Warm Therapy', 'Connection'];
      nsTools.forEach((tl, ti) => {
        const tx = leftX + 155 + ti * 58;
        drawCheckbox(doc, theme, tx, nsY + 29, 9);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7)
          .text(tl, tx + 11, nsY + 30, { lineBreak: false });
      });

      // Digital Detox & Nourishment Strip
      const digY = topY + 236;
      doc.rect(leftX, digY, CONTENT_W - 20, 42).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('DIGITAL DETOX:  Total Screen Time: ______ hrs   |   Phone-Free Meals: [  ]   |   Outdoor Time: ______ mins', leftX + 8, digY + 8, { lineBreak: false });
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8)
        .text('HYDRATION (8 Glasses):', leftX + 8, digY + 25, { lineBreak: false });
      for (let g = 0; g < 8; g++) {
        drawCheckbox(doc, theme, leftX + 115 + g * 22, digY + 24, 9);
      }
      doc.text('NOURISHING MOVEMENT: ___________________________', leftX + 300, digY + 25, { lineBreak: false });

      // Evening Reflection & Self-Compassion Prompt
      const refY = topY + 286;
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8)
        .text('HOW I HONORED MY BODY, BOUNDARIES & PEACE TODAY:', leftX, refY, { lineBreak: false });
      doc.moveTo(leftX, refY + 24).lineTo(PAGE_W - MARGIN - 10, refY + 24).lineWidth(0.5).strokeColor(theme.border).stroke();
      doc.moveTo(leftX, refY + 44).lineTo(PAGE_W - MARGIN - 10, refY + 44).lineWidth(0.5).strokeColor(theme.border).stroke();
      doc.moveTo(leftX, refY + 64).lineTo(PAGE_W - MARGIN - 10, refY + 64).lineWidth(0.5).strokeColor(theme.border).stroke();

      doc.restore();
    });
  }

  // Page 15: Monthly Wellness Audit (8 Dimensions of Holistic Wellness)
  doc.addPage();
  drawPageChrome(doc, theme, 'Holistic Self-Care Planner', 'Monthly Holistic Wellness Audit & Balance Wheel', 15, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'MONTHLY 8-DIMENSION HOLISTIC WELLNESS AUDIT (SCORE 1–10)', 'Assess whole-person harmony');
  const audCols = [125, 55, 165, 178];
  const audHeaders = ['WELLNESS DIMENSION', 'SCORE 1-10', 'CURRENT WINS & BRIGHT SPOTS', '1 RESTORATIVE ADJUSTMENT FOR NEXT MONTH'];
  const audRows = [
    '1. Physical Vitality & Sleep',
    '2. Nervous System Calm',
    '3. Nutrition & Gut Health',
    '4. Skincare & Body Care',
    '5. Digital Boundaries',
    '6. Relationships & Social',
    '7. Home & Sanctuary Space',
    '8. Creative Play & Joy'
  ];
  const afterAudY = drawTable(doc, theme, MARGIN, 90, audCols, audHeaders, audRows.length, 38, audRows);

  drawSectionHeader(doc, theme, MARGIN, afterAudY + 18, CONTENT_W, 'ENERGY DRAINS VS. ENERGY GIVERS INVENTORY', 'Protect your life force');
  const invY = afterAudY + 42;
  const halfW15 = (CONTENT_W - 10) / 2;
  doc.rect(MARGIN, invY, halfW15, 250).fillAndStroke('#ffffff', theme.border);
  doc.rect(MARGIN, invY, halfW15, 24).fill(theme.light);
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5)
    .text('WHAT REPLENISHED MY ENERGY THIS MONTH (+)', MARGIN + 10, invY + 7, { lineBreak: false });

  doc.rect(MARGIN + halfW15 + 10, invY, halfW15, 250).fillAndStroke('#ffffff', theme.border);
  doc.rect(MARGIN + halfW15 + 10, invY, halfW15, 24).fill(theme.light);
  doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(8.5)
    .text('WHAT DRAINED MY ENERGY / TO RELEASE (-)', MARGIN + halfW15 + 20, invY + 7, { lineBreak: false });

  for (let l = 1; l <= 9; l++) {
    const ly = invY + 28 + l * 22;
    doc.moveTo(MARGIN + 10, ly).lineTo(MARGIN + halfW15 - 10, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    doc.moveTo(MARGIN + halfW15 + 20, ly).lineTo(PAGE_W - MARGIN - 10, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
  }

  // Page 16: Seasonal Rituals & Next Month Self-Care Blueprint
  doc.addPage();
  drawPageChrome(doc, theme, 'Holistic Self-Care Planner', 'Next Month Self-Care Sanctuary & Ritual Blueprint', 16, totalPages);

  drawSectionHeader(doc, theme, MARGIN, 64, CONTENT_W, 'NEXT MONTH SELF-CARE SANCTUARY & RITUAL BLUEPRINT', 'Design sustainable daily peace');
  const blueBoxes = [
    { title: '1. NON-NEGOTIABLE MORNING & EVENING ANCHOR RITUALS', prompt: 'What 15-minute morning and evening rituals will ground my nervous system every day next month?' },
    { title: '2. SKINCARE & SUPPLEMENT RESTOCK / PROTOCOL UPDATES', prompt: 'Which skincare actives, barrier products, or supplements need restocking or seasonal adjustment?' },
    { title: '3. DIGITAL DETOX & BOUNDARY COMMITMENT', prompt: 'What specific screen boundary or phone-free ritual will I uphold to protect my mental clarity?' },
    { title: '4. RESTORATIVE EXPERIENCES & JOY SCHEDULED', prompt: 'Massage, sauna, nature hike, creative hobby, or unhurried rest day scheduled on my calendar:' }
  ];
  let by16 = 94;
  blueBoxes.forEach(bb => {
    doc.rect(MARGIN, by16, CONTENT_W, 155).fillAndStroke('#ffffff', theme.border);
    doc.rect(MARGIN, by16, CONTENT_W, 24).fill(theme.light);
    doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5).text(bb.title, MARGIN + 12, by16 + 7, { lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(8).text(bb.prompt, MARGIN + 12, by16 + 32, { width: CONTENT_W - 24 });
    for (let l = 1; l <= 4; l++) {
      const ly = by16 + 54 + l * 22;
      doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).lineWidth(0.5).strokeColor(theme.border).stroke();
    }
    by16 += 170;
  });

  doc.end();
  return new Promise(resolve => stream.on('finish', () => resolve(filePath)));
}

async function generateAllWellnessPlanners() {
  console.log('Starting Agent 5: Generating 15 Multi-Page Vector Wellness & Fitness PDF Planners...');
  const generated = [];

  for (const [themeKey, theme] of Object.entries(THEMES)) {
    generated.push(await build75DayChallenge(themeKey, theme));
    generated.push(await buildMacroFastingLogbook(themeKey, theme));
    generated.push(await buildMindfulnessCBTJournal(themeKey, theme));
    generated.push(await buildRunningMarathonLog(themeKey, theme));
    generated.push(await buildHolisticSelfCarePlanner(themeKey, theme));
  }

  console.log(`Successfully generated ${generated.length} PDF files:`);
  for (const fp of generated) {
    const stat = fs.statSync(fp);
    console.log(` - ${path.basename(fp)} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

generateAllWellnessPlanners().catch(err => {
  console.error('Error generating wellness planners:', err);
  process.exit(1);
});
