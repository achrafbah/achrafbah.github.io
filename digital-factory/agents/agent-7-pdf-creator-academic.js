const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUT_DIR = path.join('c:\\Users\\bahloul.a\\Downloads\\Ai studio\\achrafbah.github.io-main\\downloads\\planners');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
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
    muted: '#475569'
  },
  sage: {
    name: 'Sage',
    primary: '#0f9d58',
    secondary: '#0b8043',
    accent: '#34a853',
    light: '#f0fdf4',
    border: '#bbf7d0',
    dark: '#0f172a',
    muted: '#475569'
  },
  rose: {
    name: 'Rose',
    primary: '#e11d48',
    secondary: '#be123c',
    accent: '#fb7185',
    light: '#fff1f2',
    border: '#fecdd3',
    dark: '#0f172a',
    muted: '#475569'
  }
};

const PAGE_W = 595.28; // A4 width
const PAGE_H = 841.89; // A4 height
const MARGIN = 40;
const CONTENT_W = PAGE_W - MARGIN * 2;

function drawPageChrome(doc, theme, plannerTitle, sectionTitle, pageNum, totalPages) {
  // Top header bar
  doc.save();
  doc.rect(0, 0, PAGE_W, 28).fill(theme.primary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5);
  doc.text(plannerTitle.toUpperCase(), MARGIN, 9, { width: CONTENT_W / 2, lineBreak: false });
  doc.font('Helvetica').fontSize(8.5);
  doc.text(`${theme.name} Edition  |  ${sectionTitle}`, MARGIN + CONTENT_W / 2, 9, {
    width: CONTENT_W / 2,
    align: 'right',
    lineBreak: false
  });

  // Section header banner
  doc.roundedRect(MARGIN, 42, CONTENT_W, 34, 4).fillAndStroke(theme.light, theme.border);
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(13);
  doc.text(sectionTitle, MARGIN + 12, 53, { width: CONTENT_W - 130, lineBreak: false });

  // Date / Week mini box in header
  doc.strokeColor(theme.border).lineWidth(0.8);
  doc.roundedRect(PAGE_W - MARGIN - 115, 48, 105, 22, 3).fillAndStroke('#ffffff', theme.border);
  doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5);
  doc.text('DATE: ____/____/____', PAGE_W - MARGIN - 108, 56, { lineBreak: false });

  // Footer
  doc.moveTo(MARGIN, PAGE_H - 34).lineTo(PAGE_W - MARGIN, PAGE_H - 34).strokeColor(theme.border).lineWidth(0.8).stroke();
  doc.fillColor(theme.muted).font('Helvetica').fontSize(8);
  doc.text('achrafbah.github.io  •  Academic, Language & Creator Excellence System', MARGIN, PAGE_H - 24, {
    width: CONTENT_W - 80,
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fillColor(theme.primary);
  doc.text(`Page ${pageNum} of ${totalPages}`, PAGE_W - MARGIN - 80, PAGE_H - 24, {
    width: 80,
    align: 'right',
    lineBreak: false
  });
  doc.restore();
}

function drawCoverPage(doc, theme, title, subtitle, badgeText, pillars, totalPages) {
  doc.save();
  // Full background subtle tint
  doc.rect(0, 0, PAGE_W, PAGE_H).fill('#ffffff');
  // Top hero block
  doc.rect(0, 0, PAGE_W, 290).fill(theme.primary);
  // Geometric vector accents
  doc.fillOpacity(0.12).fillColor('#ffffff');
  doc.circle(PAGE_W - 60, 70, 140).fill();
  doc.circle(80, 260, 90).fill();
  doc.fillOpacity(1);

  // Badge pill
  doc.roundedRect(MARGIN, 52, 230, 24, 12).fill(theme.secondary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
  doc.text(badgeText.toUpperCase(), MARGIN + 14, 60, { lineBreak: false });

  // Title & Subtitle
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(26);
  doc.text(title, MARGIN, 100, { width: CONTENT_W - 20 });
  doc.font('Helvetica').fontSize(12.5).fillColor(theme.light);
  doc.text(subtitle, MARGIN, 175, { width: CONTENT_W - 40 });

  // Theme & Specs bar
  doc.roundedRect(MARGIN, 255, CONTENT_W, 64, 6).fillAndStroke('#ffffff', theme.border);
  const colW = CONTENT_W / 3;
  const specs = [
    { label: 'EDITION THEME', val: `${theme.name} Palette` },
    { label: 'DOCUMENT LENGTH', val: `${totalPages} Vector Pages` },
    { label: 'SYSTEM FORMAT', val: 'A4 Printable & Digital' }
  ];
  specs.forEach((s, i) => {
    const x = MARGIN + i * colW + 16;
    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5).text(s.label, x, 271, { lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(11).text(s.val, x, 286, { lineBreak: false });
    if (i < 2) {
      doc.moveTo(MARGIN + (i + 1) * colW, 267).lineTo(MARGIN + (i + 1) * colW, 307).strokeColor(theme.border).lineWidth(1).stroke();
    }
  });

  // Core Pillars Grid
  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(13);
  doc.text('CORE ARCHITECTURE & INCLUDED FRAMEWORKS', MARGIN, 348, { lineBreak: false });

  const boxW = (CONTENT_W - 16) / 2;
  const boxH = 82;
  pillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = MARGIN + col * (boxW + 16);
    const y = 374 + row * (boxH + 14);
    doc.roundedRect(x, y, boxW, boxH, 5).fillAndStroke(theme.light, theme.border);
    doc.roundedRect(x + 12, y + 12, 24, 24, 4).fill(theme.primary);
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10).text(`0${idx + 1}`, x + 17, y + 19, { lineBreak: false });
    doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(10.5).text(p.title, x + 44, y + 14, { width: boxW - 54, lineBreak: false });
    doc.fillColor(theme.muted).font('Helvetica').fontSize(8.5).text(p.desc, x + 44, y + 31, { width: boxW - 54, height: 42 });
  });

  // Owner Registration Card
  const regY = 585;
  doc.roundedRect(MARGIN, regY, CONTENT_W, 175, 6).fillAndStroke('#ffffff', theme.border);
  doc.rect(MARGIN, regY, CONTENT_W, 28).fill(theme.secondary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9.5).text('OWNER PROFILE & PRIMARY OBJECTIVE BRIEF', MARGIN + 14, regY + 9, { lineBreak: false });

  const fields = [
    'OWNER / CREATOR NAME:',
    'PRIMARY GOAL / TARGET EXAM / CHANNEL:',
    'START DATE & TARGET DEADLINE:',
    'KEY ACCOUNTABILITY COMMITMENT:'
  ];
  fields.forEach((f, idx) => {
    const fy = regY + 44 + idx * 31;
    doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(8.5).text(f, MARGIN + 16, fy, { lineBreak: false });
    doc.moveTo(MARGIN + 205, fy + 10).lineTo(PAGE_W - MARGIN - 16, fy + 10).strokeColor(theme.border).lineWidth(0.9).stroke();
  });

  // Footer
  doc.fillColor(theme.muted).font('Helvetica').fontSize(8.5);
  doc.text(`Expert Agent 7 • High-Precision Vector PDF System • Page 1 of ${totalPages}`, MARGIN, PAGE_H - 28, {
    width: CONTENT_W,
    align: 'center',
    lineBreak: false
  });
  doc.restore();
}

function drawCheckbox(doc, x, y, size, strokeColor) {
  doc.save();
  doc.roundedRect(x, y, size, size, 1.5).lineWidth(0.9).strokeColor(strokeColor).stroke();
  doc.restore();
}

function drawTable(doc, theme, x, y, colWidths, headers, rowCount, rowHeight, options = {}) {
  doc.save();
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  // Header row
  doc.rect(x, y, totalW, rowHeight).fill(theme.primary);
  let cx = x;
  headers.forEach((h, i) => {
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.2);
    doc.text(h, cx + 5, y + (rowHeight - 8) / 2, {
      width: colWidths[i] - 10,
      align: options.aligns ? options.aligns[i] : 'left',
      lineBreak: false
    });
    cx += colWidths[i];
  });

  // Rows
  for (let r = 0; r < rowCount; r++) {
    const ry = y + rowHeight * (r + 1);
    const bg = r % 2 === 1 ? theme.light : '#ffffff';
    doc.rect(x, ry, totalW, rowHeight).fill(bg);
    doc.rect(x, ry, totalW, rowHeight).lineWidth(0.5).strokeColor(theme.border).stroke();

    let rcx = x;
    for (let c = 0; c < colWidths.length; c++) {
      if (c > 0) {
        doc.moveTo(rcx, ry).lineTo(rcx, ry + rowHeight).lineWidth(0.5).strokeColor(theme.border).stroke();
      }
      if (options.checkboxCols && options.checkboxCols.includes(c)) {
        const cbSize = 9;
        drawCheckbox(doc, rcx + (colWidths[c] - cbSize) / 2, ry + (rowHeight - cbSize) / 2, cbSize, theme.primary);
      } else if (options.prefillCol0 && c === 0 && options.prefillCol0[r]) {
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.8);
        doc.text(options.prefillCol0[r], rcx + 5, ry + (rowHeight - 8) / 2, {
          width: colWidths[c] - 10,
          lineBreak: false
        });
      }
      rcx += colWidths[c];
    }
  }
  doc.restore();
  return y + rowHeight * (rowCount + 1);
}

// ============================================================================
// 1. EXAM SPACED REPETITION PLANNER (20 Pages)
// ============================================================================
function buildExamPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 20;
  const filePath = path.join(OUT_DIR, `Exam-Spaced-Repetition-Planner_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const title = 'Exam Spaced Repetition Planner';

  for (let p = 1; p <= totalPages; p++) {
    doc.addPage({ size: 'A4', margin: 0 });
    if (p === 1) {
      drawCoverPage(
        doc,
        theme,
        'EXAM SPACED REPETITION PLANNER',
        'Leitner 1-3-7-14-30 Day Revision Matrix, Exam Countdown Syllabus Breakdown, Active Recall Flashcard Log & Mock Test Score Analytics.',
        'Academic Mastery System',
        [
          { title: 'Leitner 1-3-7-14-30 Matrix', desc: 'Systematic memory consolidation across 5 spaced intervals to eliminate forgetting curves.' },
          { title: 'Syllabus Countdown Architecture', desc: 'Deconstruct exam weightings, high-yield topics, and reverse-engineered weekly sprints.' },
          { title: 'Active Recall & Feynman Logs', desc: 'Prompt-response flashcard trackers and diagnostic concept simplification sheets.' },
          { title: 'Mock Exam Score Diagnostics', desc: 'Timed simulation trackers, error root-cause taxonomy, and accuracy trajectory plots.' }
        ],
        totalPages
      );
    } else if (p >= 2 && p <= 4) {
      drawPageChrome(doc, theme, title, `Exam Countdown & Syllabus Deconstruction (Part ${p - 1}/3)`, p, totalPages);
      // Top KPI summary cards
      const cardW = (CONTENT_W - 20) / 3;
      ['TARGET EXAM & CODE', 'EXAM DATE & DAYS LEFT', 'TARGET SCORE / GRADE'].forEach((lbl, i) => {
        const cx = MARGIN + i * (cardW + 10);
        doc.roundedRect(cx, 86, cardW, 42, 4).fillAndStroke('#ffffff', theme.border);
        doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5).text(lbl, cx + 10, 94, { lineBreak: false });
        doc.moveTo(cx + 10, 118).lineTo(cx + cardW - 10, 118).strokeColor(theme.border).lineWidth(0.7).stroke();
      });

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        140,
        [45, 185, 60, 65, 55, 55, 50],
        ['MOD #', 'SYLLABUS TOPIC / SUB-MODULE', 'WEIGHT %', 'DIFFICULTY', 'NOTES', 'PRACTICE', 'MASTERED'],
        22,
        24,
        {
          checkboxCols: [4, 5, 6],
          prefillCol0: Array.from({ length: 22 }, (_, i) => `M-${String((p - 2) * 22 + i + 1).padStart(2, '0')}`)
        }
      );

      doc.roundedRect(MARGIN, endY + 12, CONTENT_W, 88, 4).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9).text('HIGH-YIELD PRIORITY FOCUS & BOTTLENECK NOTES', MARGIN + 12, endY + 22, { lineBreak: false });
      for (let l = 0; l < 3; l++) {
        const ly = endY + 45 + l * 18;
        doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }
    } else if (p >= 5 && p <= 10) {
      drawPageChrome(doc, theme, title, `Leitner 1-3-7-14-30 Day Spaced Repetition Matrix (Sheet ${p - 4}/6)`, p, totalPages);
      // Leitner Interval Legend
      doc.roundedRect(MARGIN, 84, CONTENT_W, 34, 4).fillAndStroke('#ffffff', theme.border);
      const boxes = [
        'BOX 1: Day +1 (Immediate)',
        'BOX 2: Day +3 (Consolidate)',
        'BOX 3: Day +7 (Reinforce)',
        'BOX 4: Day +14 (Stabilize)',
        'BOX 5: Day +30 (Long-Term)'
      ];
      boxes.forEach((b, i) => {
        const bx = MARGIN + 8 + i * (CONTENT_W / 5);
        doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(7.2).text(b, bx, 97, { width: CONTENT_W / 5 - 10, lineBreak: false });
      });

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        128,
        [42, 183, 60, 46, 46, 46, 46, 46],
        ['ID', 'CONCEPT / TOPIC / CHAPTER', 'STUDY DATE', 'DAY +1', 'DAY +3', 'DAY +7', 'DAY +14', 'DAY +30'],
        24,
        24,
        {
          checkboxCols: [3, 4, 5, 6, 7],
          prefillCol0: Array.from({ length: 24 }, (_, i) => `SR-${String((p - 5) * 24 + i + 1).padStart(3, '0')}`)
        }
      );

      doc.fillColor(theme.muted).font('Helvetica-Oblique').fontSize(8);
      doc.text('Rule: If an active recall test fails at any interval, reset the topic back to Box 1 (Day +1) and highlight weak points.', MARGIN, endY + 12, { lineBreak: false });
    } else if (p >= 11 && p <= 15) {
      drawPageChrome(doc, theme, title, `Active Recall Flashcard & Feynman Concept Log (Set ${p - 10}/5)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [45, 165, 185, 40, 40, 40],
        ['CARD #', 'PROMPT / QUESTION / CUE', 'KEY ANSWER / FORMULA / CORE IDEA', 'EASY', 'MED', 'HARD'],
        18,
        25,
        {
          checkboxCols: [3, 4, 5],
          prefillCol0: Array.from({ length: 18 }, (_, i) => `FC-${String((p - 11) * 18 + i + 1).padStart(3, '0')}`)
        }
      );

      // Feynman Simplification Box
      const fy = endY + 14;
      doc.roundedRect(MARGIN, fy, CONTENT_W, 195, 5).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, fy, CONTENT_W, 24).fill(theme.secondary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('FEYNMAN TECHNIQUE: EXPLAIN A COMPLEX CONCEPT SIMPLY (AS IF TEACHING A BEGINNER)', MARGIN + 10, fy + 8, { lineBreak: false });
      for (let l = 1; l <= 7; l++) {
        const ly = fy + 28 + l * 21;
        doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }
    } else if (p >= 16 && p <= 18) {
      drawPageChrome(doc, theme, title, `Mock Exam Score Tracker & Error Diagnosis (Log ${p - 15}/3)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [48, 65, 142, 60, 60, 70, 70],
        ['MOCK #', 'DATE', 'PAPER / MODULE / SOURCE', 'RAW SCORE', 'SCORE %', 'TIME USED', 'PASS STATUS'],
        12,
        24,
        {
          checkboxCols: [6],
          prefillCol0: Array.from({ length: 12 }, (_, i) => `MK-${String((p - 16) * 12 + i + 1).padStart(2, '0')}`)
        }
      );

      // Error Root Cause Breakdown Table
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(10).text('POST-MOCK ERROR TAXONOMY & CORRECTIVE ACTION MATRIX', MARGIN, endY + 18, { lineBreak: false });
      drawTable(
        doc,
        theme,
        MARGIN,
        endY + 34,
        [50, 155, 95, 165, 50],
        ['Q REF', 'TOPIC / CONCEPT MISSED', 'ERROR TYPE (CONCEPT/RUSH)', 'CORRECTIVE ACTION / RULE TO MEMORIZE', 'FIXED'],
        12,
        24,
        { checkboxCols: [4] }
      );
    } else {
      drawPageChrome(doc, theme, title, `Exam Week Sprint & Final Readiness Checklist (Phase ${p - 18}/2)`, p, totalPages);
      // 7-day sprint blocks + readiness checklist
      const colW = (CONTENT_W - 14) / 2;
      doc.roundedRect(MARGIN, 86, colW, 330, 4).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, 86, colW, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('HIGH-PRIORITY FORMULA & EQUATION SHEET', MARGIN + 10, 94, { lineBreak: false });
      for (let i = 1; i <= 13; i++) {
        const ly = 110 + i * 22;
        doc.moveTo(MARGIN + 10, ly).lineTo(MARGIN + colW - 10, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }

      const rx = MARGIN + colW + 14;
      doc.roundedRect(rx, 86, colW, 330, 4).fillAndStroke(theme.light, theme.border);
      doc.rect(rx, 86, colW, 24).fill(theme.secondary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('EXAM DAY LOGISTICS & READINESS CHECKLIST', rx + 10, 94, { lineBreak: false });

      const items = [
        'All Leitner Box 1 & Box 2 cards cleared',
        'Top 20 high-yield formulas memorized cold',
        '3 full timed mock exams completed & reviewed',
        'Weakest 5 syllabus modules re-tested via recall',
        'Exam ID, admission slip & stationery packed',
        'Permitted calculator / tools battery verified',
        'Transit route & arrival buffer (+45m) confirmed',
        'Hydration, nutrition & glucose snacks prepared',
        '8-hour sleep schedule locked 3 nights prior',
        'Pacing strategy per exam section finalized',
        'First-pass vs. flagged-question rule rehearsed',
        'Post-exam decompression & reward planned'
      ];
      items.forEach((it, idx) => {
        const iy = 120 + idx * 24;
        drawCheckbox(doc, rx + 12, iy, 10, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(8.2).text(it, rx + 28, iy + 1, { width: colW - 36, lineBreak: false });
      });

      drawTable(
        doc,
        theme,
        MARGIN,
        432,
        [75, 150, 150, 90, 50],
        ['COUNTDOWN DAY', 'MORNING RECALL BLOCK (90M)', 'AFTERNOON TIMED DRILL (90M)', 'EVENING LIGHT REVIEW', 'DONE'],
        12,
        26,
        {
          checkboxCols: [4],
          prefillCol0: Array.from({ length: 12 }, (_, i) => `T - ${12 - i} Days`)
        }
      );
    }
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 2. LANGUAGE FLUENCY TRACKER (24 Pages)
// ============================================================================
function buildLanguagePlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 24;
  const filePath = path.join(OUT_DIR, `Language-Fluency-Tracker_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const title = 'Language Fluency A1-C1 Tracker';

  for (let p = 1; p <= totalPages; p++) {
    doc.addPage({ size: 'A4', margin: 0 });
    if (p === 1) {
      drawCoverPage(
        doc,
        theme,
        'LANGUAGE FLUENCY A1-C1 TRACKER',
        'CEFR A1-to-C1 Mastery Roadmap (German / English / French / Spanish), Daily Vocabulary & Collocations Table, Grammar Rule Summary & Speaking Immersion Log.',
        'Polyglot CEFR Mastery System',
        [
          { title: 'CEFR A1 to C1 Roadmap', desc: 'Structured competency milestones across Listening, Reading, Speaking, and Writing.' },
          { title: 'Vocabulary & Collocations Bank', desc: 'Contextual phrase capture, gender/plural markers, register, and spaced review checkboxes.' },
          { title: 'Grammar Architecture Sheets', desc: 'Syntax rules, verb conjugations, case/tense triggers, and common pitfall corrections.' },
          { title: 'Speaking & Immersion Logs', desc: 'Track native audio hours, shadowing drills, tutor sessions, and output fluency scores.' }
        ],
        totalPages
      );
    } else if (p >= 2 && p <= 5) {
      const levels = ['A1–A2 Foundation', 'B1 Threshold Independence', 'B2 Vantage Fluency', 'C1 Effective Operational Mastery'];
      const lvlName = levels[p - 2];
      drawPageChrome(doc, theme, title, `CEFR Mastery Roadmap: ${lvlName}`, p, totalPages);

      // Language selector bar
      doc.roundedRect(MARGIN, 84, CONTENT_W, 30, 4).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text('TARGET LANGUAGE:', MARGIN + 12, 95, { lineBreak: false });
      ['GERMAN (DE)', 'ENGLISH (EN)', 'FRENCH (FR)', 'SPANISH (ES)', 'OTHER: ________'].forEach((lang, idx) => {
        const lx = MARGIN + 115 + idx * 80;
        drawCheckbox(doc, lx, 94, 9, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.8).text(lang, lx + 13, 95, { lineBreak: false });
      });

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        124,
        [55, 80, 225, 65, 45, 45],
        ['CEFR ID', 'SKILL DOMAIN', 'CAN-DO COMPETENCY DESCRIPTOR & MILESTONE', 'TARGET DATE', 'DRILLED', 'MASTERED'],
        21,
        24,
        {
          checkboxCols: [4, 5],
          prefillCol0: Array.from({ length: 21 }, (_, i) => `CEFR-${p - 1}.${i + 1}`)
        }
      );

      doc.roundedRect(MARGIN, endY + 12, CONTENT_W, 92, 4).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9).text(`${lvlName.toUpperCase()} — OFFICIAL EXAM / CERTIFICATION BENCHMARK NOTES`, MARGIN + 12, endY + 22, { lineBreak: false });
      for (let l = 0; l < 3; l++) {
        const ly = endY + 46 + l * 19;
        doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }
    } else if (p >= 6 && p <= 13) {
      drawPageChrome(doc, theme, title, `Daily Vocabulary, Idioms & Collocations Bank (Sheet ${p - 5}/8)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [115, 50, 120, 155, 25, 25, 25],
        ['TARGET WORD / PHRASE', 'POS / GEN', 'NATIVE TRANSLATION', 'NATURAL COLLOCATION / CONTEXT SENTENCE', 'R1', 'R2', 'R3'],
        26,
        24,
        { checkboxCols: [4, 5, 6] }
      );
      doc.fillColor(theme.muted).font('Helvetica-Oblique').fontSize(8);
      doc.text('Tip: Always record nouns with their article/gender (der/die/das, le/la, el/la) and verbs with their preposition + case.', MARGIN, endY + 10, { lineBreak: false });
    } else if (p >= 14 && p <= 18) {
      drawPageChrome(doc, theme, title, `Grammar Rule Summary & Syntax Pattern Matrix (Module ${p - 13}/5)`, p, totalPages);

      // Top Rule Architecture Card
      doc.roundedRect(MARGIN, 86, CONTENT_W, 130, 4).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, 86, CONTENT_W, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('CORE GRAMMAR RULE / TENSE / CASE STRUCTURE FORMULA', MARGIN + 10, 94, { lineBreak: false });
      for (let l = 1; l <= 4; l++) {
        const ly = 112 + l * 22;
        doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }

      // Conjugation / Declension Grid + Exceptions
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        228,
        [95, 135, 145, 95, 45],
        ['PRONOUN / CASE', 'AFFIRMATIVE PATTERN', 'NEGATIVE / QUESTION FORM', 'IRREGULAR / TRIGGER', 'DRILLED'],
        12,
        24,
        {
          checkboxCols: [4],
          prefillCol0: ['1st Sing. (I/Ich/Je/Yo)', '2nd Sing. (You/Du/Tu)', '3rd Sing. (He/Er/Il/El)', '1st Plur. (We/Wir/Nous)', '2nd Plur. (You/Ihr/Vous)', '3rd Plur. (They/Sie/Ils)', 'Accusative / Direct Obj', 'Dative / Indirect Obj', 'Genitive / Possessive', 'Subjunctive / Konjunktiv', 'Passive Voice Construction', 'Relative Clause Connector']
        }
      );

      // Common Mistakes vs Correct Native Usage
      doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(9.5).text('ERROR CORRECTION LOG: FOSSILIZED MISTAKE VS. NATIVE FORM', MARGIN, endY + 14, { lineBreak: false });
      drawTable(
        doc,
        theme,
        MARGIN,
        endY + 28,
        [235, 235, 45],
        ['COMMON MISTAKE / LITERAL TRANSLATION TRAP', 'CORRECT TARGET LANGUAGE STRUCTURE', 'FIXED'],
        7,
        24,
        { checkboxCols: [2] }
      );
    } else if (p >= 19 && p <= 22) {
      drawPageChrome(doc, theme, title, `Speaking, Shadowing & Immersion Habit Log (Cycle ${p - 18}/4)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [52, 85, 168, 50, 55, 55, 50],
        ['DATE', 'ACTIVITY TYPE', 'PODCAST / BOOK / TUTOR TOPIC / PARTNER', 'MINS', 'COMPREH %', 'FLUENCY 1-5', 'LOGGED'],
        20,
        24,
        { checkboxCols: [6] }
      );

      // Weekly Immersion Summary
      const sy = endY + 14;
      doc.roundedRect(MARGIN, sy, CONTENT_W, 145, 5).fillAndStroke(theme.light, theme.border);
      doc.rect(MARGIN, sy, CONTENT_W, 24).fill(theme.secondary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('SPEAKING OUTPUT & SHADOWING SELF-REFLECTION', MARGIN + 10, sy + 8, { lineBreak: false });
      const prompts = [
        '1. New conversational connectors / filler phrases used naturally this week:',
        '2. Pronunciation / intonation sounds practiced via native audio shadowing:',
        '3. Vocabulary gaps noticed during live conversation (words I wanted to say but lacked):',
        '4. Next week speaking challenge & immersion target hours:'
      ];
      prompts.forEach((pr, idx) => {
        const py = sy + 34 + idx * 26;
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8).text(pr, MARGIN + 12, py, { lineBreak: false });
        doc.moveTo(MARGIN + 12, py + 18).lineTo(PAGE_W - MARGIN - 12, py + 18).strokeColor(theme.border).lineWidth(0.6).stroke();
      });
    } else {
      drawPageChrome(doc, theme, title, `30-Day Polyglot Consistency Matrix & Fluency Audit (Part ${p - 22}/2)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [45, 62, 62, 62, 62, 62, 160],
        ['DAY #', 'ANKI / VOCAB', 'GRAMMAR', 'LISTENING', 'READING', 'SPEAKING', 'DAILY OUTPUT WIN / KEY PHRASE OF THE DAY'],
        15,
        25,
        {
          checkboxCols: [1, 2, 3, 4, 5],
          prefillCol0: Array.from({ length: 15 }, (_, i) => `Day ${(p - 23) * 15 + i + 1}`)
        }
      );

      doc.roundedRect(MARGIN, endY + 14, CONTENT_W, 110, 4).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5).text('MONTHLY CEFR SELF-AUDIT & LEVEL PROGRESSION REVIEW', MARGIN + 12, endY + 26, { lineBreak: false });
      const skills = ['LISTENING COMPREHENSION:', 'READING SPEED & DEPTH:', 'SPOKEN FLUENCY & CONFIDENCE:', 'WRITTEN ACCURACY & STYLE:'];
      skills.forEach((sk, i) => {
        const sy = endY + 48 + i * 17;
        doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(8).text(sk, MARGIN + 14, sy, { lineBreak: false });
        doc.moveTo(MARGIN + 170, sy + 8).lineTo(PAGE_W - MARGIN - 14, sy + 8).strokeColor(theme.border).lineWidth(0.6).stroke();
      });
    }
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 3. CREATOR SCRIPT & STORYBOARD PLANNER (20 Pages)
// ============================================================================
function buildCreatorPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 20;
  const filePath = path.join(OUT_DIR, `Creator-Script-Storyboard_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const title = 'Creator Script & Storyboard Planner';

  for (let p = 1; p <= totalPages; p++) {
    doc.addPage({ size: 'A4', margin: 0 });
    if (p === 1) {
      drawCoverPage(
        doc,
        theme,
        'CREATOR SCRIPT & STORYBOARD',
        'Viral Hook Variations (0-3s), Retention Storyboard Grid (Visual / Audio / B-Roll), CTA & Sponsor Integration Checklist, Post-Publish Analytics Review.',
        'Content Production Studio System',
        [
          { title: '0-3s Viral Hook Lab', desc: 'A/B test visual hooks, spoken pattern interrupts, thumbnail synergy, and curiosity loops.' },
          { title: 'Retention Storyboard Grid', desc: 'Frame-by-frame visual composition, spoken script, B-roll overlays, and SFX pacing.' },
          { title: 'Sponsor & CTA Architecture', desc: 'Seamless native ad transitions, deliverables verification, and high-converting CTAs.' },
          { title: 'Post-Publish Analytics Review', desc: 'Track CTR %, 30-second retention, AVD %, RPM revenue, and audience comment signals.' }
        ],
        totalPages
      );
    } else if (p >= 2 && p <= 4) {
      drawPageChrome(doc, theme, title, `Viral Hook Variations (0-3s) & Packaging Lab (Batch ${p - 1}/3)`, p, totalPages);

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [45, 115, 145, 115, 50, 45],
        ['VID #', 'WORKING TITLE / PACKAGING', '0-3S SPOKEN HOOK VARIATION', 'THUMBNAIL VISUAL & 3-WORD TEXT', 'CURIOSITY', 'WINNER'],
        14,
        27,
        {
          checkboxCols: [4, 5],
          prefillCol0: Array.from({ length: 14 }, (_, i) => `HK-${String((p - 2) * 14 + i + 1).padStart(2, '0')}`)
        }
      );

      // Hook Psychology Framework Box
      const hy = endY + 14;
      doc.roundedRect(MARGIN, hy, CONTENT_W, 200, 5).fillAndStroke(theme.light, theme.border);
      doc.rect(MARGIN, hy, CONTENT_W, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('FIRST 15 SECONDS RETENTION CHECKLIST & PATTERN INTERRUPT DESIGN', MARGIN + 10, hy + 8, { lineBreak: false });

      const hookChecks = [
        'Click Confirmation: First frame visually matches thumbnail promise within 1.5 seconds',
        'Stakes Established: Viewer immediately understands what they gain or lose by watching',
        'Baggage Stripped: Zero "Hey guys, welcome back" throat-clearing intros',
        'Open Loop Planted: Central question or payoff teased before second 10',
        'Visual Motion: Camera movement, dynamic zoom, or B-roll cut within first 3 seconds',
        'Reading Grade Level: Hook script uses punchy, conversational 5th-grade readability'
      ];
      hookChecks.forEach((hc, idx) => {
        const cy = hy + 34 + idx * 25;
        drawCheckbox(doc, MARGIN + 12, cy, 10, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(8.4).text(hc, MARGIN + 28, cy + 1, { lineBreak: false });
      });
    } else if (p >= 5 && p <= 12) {
      drawPageChrome(doc, theme, title, `Retention Storyboard Grid: Visual / Audio / B-Roll (Production ${p - 4}/8)`, p, totalPages);

      // Video Metadata Bar
      doc.roundedRect(MARGIN, 84, CONTENT_W, 28, 4).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8).text('EPISODE TITLE: ___________________________   FORMAT: [ ] Long-Form  [ ] Short/Reel   TARGET LENGTH: ________', MARGIN + 10, 94, { lineBreak: false });

      // 6 Storyboard Scene Rows per page
      const startY = 120;
      const rowH = 108;
      for (let s = 0; s < 6; s++) {
        const sy = startY + s * rowH;
        const sceneNum = (p - 5) * 6 + s + 1;
        doc.roundedRect(MARGIN, sy, CONTENT_W, rowH - 6, 4).fillAndStroke('#ffffff', theme.border);

        // Left Scene Header Strip
        doc.rect(MARGIN, sy, 145, rowH - 6).fillAndStroke(theme.light, theme.border);
        doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text(`SCENE #${String(sceneNum).padStart(2, '0')}  |  TIME: ____:____`, MARGIN + 8, sy + 8, { lineBreak: false });

        // 16:9 Thumbnail / Frame Sketch Box
        doc.roundedRect(MARGIN + 8, sy + 22, 129, 62, 3).fillAndStroke('#ffffff', theme.border);
        doc.fillColor(theme.muted).font('Helvetica').fontSize(7).text('16:9 VISUAL FRAME SKETCH', MARGIN + 22, sy + 50, { lineBreak: false });
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.2).text('SHOT: [ ] A-Roll [ ] B-Roll [ ] Screen', MARGIN + 8, sy + 89, { lineBreak: false });

        // Spoken Script Column
        const col2X = MARGIN + 153;
        const col2W = 210;
        doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(8).text('SPOKEN SCRIPT / VOICEOVER DIALOGUE:', col2X, sy + 8, { lineBreak: false });
        for (let l = 1; l <= 4; l++) {
          const ly = sy + 18 + l * 19;
          doc.moveTo(col2X, ly).lineTo(col2X + col2W - 8, ly).strokeColor(theme.border).lineWidth(0.5).stroke();
        }

        // B-Roll, Text Overlay & SFX Column
        const col3X = col2X + col2W + 4;
        const col3W = CONTENT_W - 153 - col2W - 8;
        doc.moveTo(col3X - 4, sy).lineTo(col3X - 4, sy + rowH - 6).strokeColor(theme.border).lineWidth(0.6).stroke();
        doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8).text('B-ROLL / TEXT OVERLAY / SFX:', col3X, sy + 8, { lineBreak: false });
        const tags = ['B-Roll:', 'On-Screen Text:', 'SFX / Music Cue:', 'Retention Reset:'];
        tags.forEach((tg, ti) => {
          const ty = sy + 25 + ti * 19;
          doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.2).text(tg, col3X, ty, { lineBreak: false });
          doc.moveTo(col3X + 62, ty + 8).lineTo(col3X + col3W - 4, ty + 8).strokeColor(theme.border).lineWidth(0.5).stroke();
        });
      }
    } else if (p >= 13 && p <= 16) {
      drawPageChrome(doc, theme, title, `CTA & Sponsor Integration Architecture (Campaign ${p - 12}/4)`, p, totalPages);

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [95, 115, 75, 130, 50, 50],
        ['BRAND / SPONSOR', 'DELIVERABLE & PLACEMENT', 'RATE ($)', 'PROMO URL / CODE / UTM LINK', 'APPROVED', 'PAID'],
        10,
        24,
        { checkboxCols: [4, 5] }
      );

      // Native Sponsor Transition Script + Production Checklist
      const by = endY + 14;
      const boxW = (CONTENT_W - 14) / 2;
      doc.roundedRect(MARGIN, by, boxW, 380, 5).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, by, boxW, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('NATIVE SPONSOR BRIDGE & PITCH SCRIPT', MARGIN + 10, by + 8, { lineBreak: false });
      const bridgeSteps = [
        '1. Organic Story Problem (Before Ad):',
        '2. Seamless Bridge Sentence (No Ad Warning):',
        '3. Live Product Demo / Visual Proof Point 1:',
        '4. Core Benefit / Transformation Proof Point 2:',
        '5. Urgent Call-To-Action + Exclusive Bonus:',
        '6. Re-Hook Bridge Back Into Main Content:'
      ];
      bridgeSteps.forEach((bs, i) => {
        const sy = by + 34 + i * 56;
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8).text(bs, MARGIN + 10, sy, { lineBreak: false });
        doc.moveTo(MARGIN + 10, sy + 22).lineTo(MARGIN + boxW - 10, sy + 22).strokeColor(theme.border).lineWidth(0.6).stroke();
        doc.moveTo(MARGIN + 10, sy + 40).lineTo(MARGIN + boxW - 10, sy + 40).strokeColor(theme.border).lineWidth(0.6).stroke();
      });

      const rx = MARGIN + boxW + 14;
      doc.roundedRect(rx, by, boxW, 380, 5).fillAndStroke(theme.light, theme.border);
      doc.rect(rx, by, boxW, 24).fill(theme.secondary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('CTA & SPONSOR COMPLIANCE CHECKLIST', rx + 10, by + 8, { lineBreak: false });
      const checks = [
        'Sponsor talking points & mandatory disclaimers verified',
        'FTC / Platform paid promotion toggle enabled',
        'Pinned comment & top description link tested (200 OK)',
        'QR code & on-screen lower-third graphic rendered',
        'Story-bridge avoids abrupt tone shift (no viewer drop)',
        'End-screen handoff points to single next binge video',
        'Lead magnet / newsletter CTA placed in mid-roll peak',
        'Audio LUFS normalized (-14 LUFS) across ad & main cut',
        'Captions / subtitles proofread for brand name spelling',
        'Sponsor timestamp chapter marker added to description',
        '30-day performance screenshot scheduled for brand report',
        'Invoice & W-9 / payment link dispatched to agency'
      ];
      checks.forEach((ch, idx) => {
        const cy = by + 34 + idx * 28;
        drawCheckbox(doc, rx + 10, cy, 10, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(8).text(ch, rx + 25, cy + 1, { width: boxW - 32, lineBreak: false });
      });
    } else {
      drawPageChrome(doc, theme, title, `Post-Publish Analytics & Retention Review (Report ${p - 16}/4)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [155, 58, 52, 58, 58, 64, 70],
        ['PUBLISHED VIDEO TITLE', 'VIEWS (7D)', 'CTR %', '30S RET %', 'AVD %', 'SUBS +', 'REVENUE ($)'],
        16,
        24
      );

      // Retention Drop-off & Iteration Box
      const ry = endY + 14;
      doc.roundedRect(MARGIN, ry, CONTENT_W, 245, 5).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, ry, CONTENT_W, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('RETENTION CURVE POST-MORTEM & THUMBNAIL A/B TEST LOG', MARGIN + 10, ry + 8, { lineBreak: false });

      const questions = [
        '1. Biggest Retention Drop Timestamp & Exact Cause (Boring segment, confusing graphic, slow pacing):',
        '2. Highest Re-Watched Spike Timestamp & Why Viewers Loved It:',
        '3. Title / Thumbnail A/B Swap Result (Initial CTR % vs. Updated CTR % after 24h):',
        '4. Top Audience Comment Questions (Seed Ideas for Next 3 Follow-Up Videos):'
      ];
      questions.forEach((q, idx) => {
        const qy = ry + 36 + idx * 50;
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8.2).text(q, MARGIN + 12, qy, { lineBreak: false });
        doc.moveTo(MARGIN + 12, qy + 20).lineTo(PAGE_W - MARGIN - 12, qy + 20).strokeColor(theme.border).lineWidth(0.6).stroke();
        doc.moveTo(MARGIN + 12, qy + 36).lineTo(PAGE_W - MARGIN - 12, qy + 36).strokeColor(theme.border).lineWidth(0.6).stroke();
      });
    }
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 4. DIGITAL SELLER WORKBOOK (18 Pages)
// ============================================================================
function buildSellerWorkbook(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 18;
  const filePath = path.join(OUT_DIR, `Digital-Seller-Workbook_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const title = 'Digital Seller Workbook (Etsy, Gumroad & Payhip)';

  for (let p = 1; p <= totalPages; p++) {
    doc.addPage({ size: 'A4', margin: 0 });
    if (p === 1) {
      drawCoverPage(
        doc,
        theme,
        'DIGITAL SELLER WORKBOOK',
        'Etsy, Gumroad & Payhip Product Research Matrix, SEO Keyword Tag Builder, Bundle Pricing Tier Calculator & Launch Promotion Checklist.',
        'Digital Product Empire System',
        [
          { title: 'Product Research Matrix', desc: 'Validate high-demand, low-competition digital products across Etsy, Gumroad, and Payhip.' },
          { title: '13-Tag SEO Keyword Builder', desc: 'Long-tail search volume analysis, title front-loading, and conversion-focused listing copy.' },
          { title: 'Bundle Pricing Tier Calculator', desc: 'Anchor pricing psychology (Starter / Pro / Ultimate Bundle), fee deductions, and net margin.' },
          { title: 'Omnichannel Launch Checklist', desc: 'Mockup gallery standards, instant download QA, email sequence, and social launch calendar.' }
        ],
        totalPages
      );
    } else if (p >= 2 && p <= 5) {
      drawPageChrome(doc, theme, title, `Etsy, Gumroad & Payhip Product Research Matrix (Sheet ${p - 1}/4)`, p, totalPages);
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [42, 138, 70, 58, 58, 104, 45],
        ['ID', 'PRODUCT IDEA / NICHE', 'PLATFORM', 'DEMAND', 'COMPET.', 'GAP / DIFFERENTIATION ANGLE', 'BUILD'],
        21,
        24,
        {
          checkboxCols: [6],
          prefillCol0: Array.from({ length: 21 }, (_, i) => `PR-${String((p - 2) * 21 + i + 1).padStart(2, '0')}`)
        }
      );

      doc.roundedRect(MARGIN, endY + 12, CONTENT_W, 110, 4).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9).text('COMPETITOR Bestseller REVIEW MINING (1-STAR TO 3-STAR PAIN POINTS TO SOLVE)', MARGIN + 12, endY + 22, { lineBreak: false });
      for (let l = 0; l < 4; l++) {
        const ly = endY + 44 + l * 18;
        doc.moveTo(MARGIN + 12, ly).lineTo(PAGE_W - MARGIN - 12, ly).strokeColor(theme.border).lineWidth(0.6).stroke();
      }
    } else if (p >= 6 && p <= 9) {
      drawPageChrome(doc, theme, title, `SEO Keyword Tag Builder & Listing Optimizer (Listing ${p - 5}/4)`, p, totalPages);

      // Listing Title Builder
      doc.roundedRect(MARGIN, 84, CONTENT_W, 74, 4).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, 84, CONTENT_W, 22).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('HIGH-CONVERTING SEO TITLE FORMULA (FRONT-LOAD PRIMARY KEYWORD IN FIRST 40 CHARS)', MARGIN + 10, 91, { lineBreak: false });
      doc.moveTo(MARGIN + 12, 126).lineTo(PAGE_W - MARGIN - 12, 126).strokeColor(theme.border).lineWidth(0.6).stroke();
      doc.moveTo(MARGIN + 12, 146).lineTo(PAGE_W - MARGIN - 12, 146).strokeColor(theme.border).lineWidth(0.6).stroke();

      // 13 Etsy Tags + Gumroad/Payhip Search Terms Table
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        168,
        [52, 178, 75, 75, 85, 50],
        ['TAG #', 'LONG-TAIL KEYWORD PHRASE (<= 20 CHARS)', 'SEARCH VOL', 'COMPETITION', 'BUYER INTENT', 'IN TITLE'],
        16,
        24,
        {
          checkboxCols: [5],
          prefillCol0: Array.from({ length: 16 }, (_, i) => i < 13 ? `ETSY-${i + 1}` : `GUM-${i - 12}`)
        }
      );

      // 10 Mockup Image Slot Planner
      doc.fillColor(theme.secondary).font('Helvetica-Bold').fontSize(9.5).text('10-SLIDE LISTING MOCKUP GALLERY ARCHITECTURE', MARGIN, endY + 14, { lineBreak: false });
      const slotW = (CONTENT_W - 36) / 5;
      const slots = [
        '1. Hero Thumbnail', '2. What Is Included', '3. Page Breakdown', '4. Theme / Colorways', '5. Key Benefits',
        '6. How It Works', '7. Device / Print Spec', '8. Bonus Included', '9. Social Proof / FAQ', '10. Bundle Upsell'
      ];
      slots.forEach((sl, idx) => {
        const col = idx % 5;
        const row = Math.floor(idx / 5);
        const sx = MARGIN + col * (slotW + 9);
        const sy = endY + 30 + row * 56;
        doc.roundedRect(sx, sy, slotW, 48, 3).fillAndStroke(theme.light, theme.border);
        doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(7.2).text(sl, sx + 6, sy + 8, { width: slotW - 12, lineBreak: false });
        drawCheckbox(doc, sx + 6, sy + 30, 8, theme.primary);
        doc.fillColor(theme.muted).font('Helvetica').fontSize(6.8).text('Rendered', sx + 18, sy + 31, { lineBreak: false });
      });
    } else if (p >= 10 && p <= 13) {
      drawPageChrome(doc, theme, title, `Bundle Pricing Tier Calculator & Fee Margin Sheet (Model ${p - 9}/4)`, p, totalPages);

      // 3-Tier Value Ladder Cards
      const cardW = (CONTENT_W - 20) / 3;
      const tiers = [
        { name: 'TIER 1: STARTER SINGLE', sub: 'Entry Impulse Price ($7–$15)' },
        { name: 'TIER 2: PRO SYSTEM (TARGET)', sub: 'Core Decoy Winner ($19–$39)' },
        { name: 'TIER 3: ULTIMATE SHOP BUNDLE', sub: 'High-Anchor Master ($49–$99)' }
      ];
      tiers.forEach((t, i) => {
        const cx = MARGIN + i * (cardW + 10);
        doc.roundedRect(cx, 86, cardW, 135, 4).fillAndStroke(i === 1 ? theme.light : '#ffffff', theme.border);
        doc.rect(cx, 86, cardW, 22).fill(i === 1 ? theme.primary : theme.secondary);
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8).text(t.name, cx + 8, 93, { lineBreak: false });
        doc.fillColor(theme.muted).font('Helvetica-Bold').fontSize(7.5).text(t.sub, cx + 8, 114, { lineBreak: false });
        for (let l = 0; l < 4; l++) {
          const ly = 138 + l * 19;
          doc.moveTo(cx + 8, ly).lineTo(cx + cardW - 8, ly).strokeColor(theme.border).lineWidth(0.5).stroke();
        }
      });

      // Unit Economics & Platform Fee Table
      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        234,
        [135, 65, 65, 65, 60, 60, 65],
        ['SKU / BUNDLE NAME', 'LIST PRICE', 'DISCOUNT %', 'SALE PRICE', 'PLAT. FEE', 'NET PROFIT', '30-SALE GOAL'],
        14,
        24
      );

      // Platform Fee Reference Strip
      doc.roundedRect(MARGIN, endY + 12, CONTENT_W, 88, 4).fillAndStroke('#ffffff', theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text('PLATFORM FEE QUICK REFERENCE & ORDER BUMP STRATEGY', MARGIN + 12, endY + 22, { lineBreak: false });
      doc.fillColor(theme.dark).font('Helvetica').fontSize(8).text('• Etsy: $0.20 listing + 6.5% transaction + ~3% + $0.25 payment processing   • Gumroad: 10% flat + payment processing   • Payhip: 5% (Free plan) or 0% ($99/mo)', MARGIN + 12, endY + 38, { lineBreak: false });
      doc.moveTo(MARGIN + 12, endY + 66).lineTo(PAGE_W - MARGIN - 12, endY + 66).strokeColor(theme.border).lineWidth(0.6).stroke();
      doc.moveTo(MARGIN + 12, endY + 84).lineTo(PAGE_W - MARGIN - 12, endY + 84).strokeColor(theme.border).lineWidth(0.6).stroke();
    } else {
      drawPageChrome(doc, theme, title, `Launch Promotion Checklist & Monthly Revenue Tracker (Phase ${p - 13}/5)`, p, totalPages);

      const boxW = (CONTENT_W - 14) / 2;
      doc.roundedRect(MARGIN, 86, boxW, 270, 4).fillAndStroke('#ffffff', theme.border);
      doc.rect(MARGIN, 86, boxW, 24).fill(theme.primary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('PRE-LAUNCH QA & FILE DELIVERY CHECKLIST', MARGIN + 10, 94, { lineBreak: false });
      const qaItems = [
        'All PDF files tested for crisp vector rendering & links',
        'ZIP folder under 20MB Etsy direct upload limit (or PDF hub)',
        '10 listing mockups exported at 3000x2250px high-DPI',
        'Listing video (5-15s flip-through) uploaded to Etsy',
        'All 13 Etsy tags + attributes & categories populated',
        'Gumroad / Payhip checkout order bump & upsell active',
        'Automated post-purchase thank-you & review coupon live',
        'Pinterest 5 vertical pins scheduled with keyword descriptions',
        'Email list broadcast & early-bird 20% launch code tested'
      ];
      qaItems.forEach((it, idx) => {
        const iy = 118 + idx * 25;
        drawCheckbox(doc, MARGIN + 10, iy, 9.5, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7.8).text(it, MARGIN + 24, iy + 1, { width: boxW - 30, lineBreak: false });
      });

      const rx = MARGIN + boxW + 14;
      doc.roundedRect(rx, 86, boxW, 270, 4).fillAndStroke(theme.light, theme.border);
      doc.rect(rx, 86, boxW, 24).fill(theme.secondary);
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text('7-DAY OMNICHANNEL LAUNCH PROMOTION SPRINT', rx + 10, 94, { lineBreak: false });
      const promoDays = [
        'Day -2: Teaser behind-the-scenes mockup story',
        'Day -1: Waitlist / VIP early-bird discount announcement',
        'Day 1: Official Launch across Etsy, Gumroad & Payhip',
        'Day 2: Walkthrough tutorial reel / YouTube Short',
        'Day 3: Customer use-case & problem/solution carousel',
        'Day 4: Bundle value comparison breakdown post',
        'Day 5: FAQ & objection-handling showcase',
        'Day 6: Flash launch bonus expiring in 24 hours',
        'Day 7: First week sales review & Pinterest pin wave 2'
      ];
      promoDays.forEach((pd, idx) => {
        const iy = 118 + idx * 25;
        drawCheckbox(doc, rx + 10, iy, 9.5, theme.secondary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(7.8).text(pd, rx + 24, iy + 1, { width: boxW - 30, lineBreak: false });
      });

      drawTable(
        doc,
        theme,
        MARGIN,
        372,
        [65, 85, 65, 65, 70, 75, 90],
        ['DATE / WEEK', 'PLATFORM', 'VISITS', 'ORDERS', 'CONV %', 'AD SPEND ($)', 'NET REVENUE ($)'],
        15,
        25
      );
    }
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

// ============================================================================
// 5. ACADEMIC RESEARCH PLANNER (20 Pages)
// ============================================================================
function buildResearchPlanner(themeKey) {
  const theme = THEMES[themeKey];
  const totalPages = 20;
  const filePath = path.join(OUT_DIR, `Academic-Research-Planner_${themeKey}.pdf`);
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const title = 'Academic Research & Thesis Planner';

  for (let p = 1; p <= totalPages; p++) {
    doc.addPage({ size: 'A4', margin: 0 });
    if (p === 1) {
      drawCoverPage(
        doc,
        theme,
        'ACADEMIC RESEARCH PLANNER',
        'Literature Review Synthesis Matrix (Author, Year, Methodology, Key Findings, Critique), Thesis Chapter Milestone Tracker & Citation Log.',
        'Scholarly Publication & Thesis System',
        [
          { title: 'Literature Synthesis Matrix', desc: 'Compare Author/Year, Methodology, Sample Size, Key Findings, and Research Gaps side-by-side.' },
          { title: 'Deep Paper Appraisal Sheets', desc: 'Structured theoretical framework analysis, validity critique, and direct quote extraction.' },
          { title: 'Thesis Chapter Milestones', desc: 'Track word-count targets, draft iterations, advisor feedback loops, and submission deadlines.' },
          { title: 'Master Citation & DOI Log', desc: 'Ensure zero missing references with BibTeX/Zotero keys, DOI tracking, and verification status.' }
        ],
        totalPages
      );
    } else if (p >= 2 && p <= 8) {
      drawPageChrome(doc, theme, title, `Literature Review Synthesis Matrix (Matrix ${p - 1}/7)`, p, totalPages);

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [82, 88, 92, 128, 90, 35],
        ['AUTHOR (YEAR)', 'RESEARCH QUESTION / AIM', 'METHODOLOGY & SAMPLE', 'KEY EMPIRICAL FINDINGS', 'LIMITATIONS / CRITIQUE', 'CITED'],
        14,
        42,
        { checkboxCols: [5] }
      );

      doc.roundedRect(MARGIN, endY + 10, CONTENT_W, 52, 4).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text('SYNTHESIS CLUSTER THEME / IDENTIFIED RESEARCH GAP ACROSS THESE STUDIES:', MARGIN + 10, endY + 18, { lineBreak: false });
      doc.moveTo(MARGIN + 10, endY + 46).lineTo(PAGE_W - MARGIN - 10, endY + 46).strokeColor(theme.border).lineWidth(0.6).stroke();
    } else if (p >= 9 && p <= 12) {
      drawPageChrome(doc, theme, title, `Deep Paper Critical Appraisal & Quote Extraction (Sheet ${p - 8}/4)`, p, totalPages);

      // 2 Deep Review Cards per page
      for (let c = 0; c < 2; c++) {
        const cy = 86 + c * 350;
        doc.roundedRect(MARGIN, cy, CONTENT_W, 336, 5).fillAndStroke('#ffffff', theme.border);
        doc.rect(MARGIN, cy, CONTENT_W, 24).fill(c === 0 ? theme.primary : theme.secondary);
        doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8.5).text(`PAPER CRITICAL APPRAISAL BRIEF #${(p - 9) * 2 + c + 1}   |   DOI / CITEKEY: _________________________`, MARGIN + 10, cy + 8, { lineBreak: false });

        const fields = [
          'Full Title & Journal / Conference:',
          'Theoretical Framework & Core Hypothesis:',
          'Methodology, Dataset & Statistical Rigor:',
          'Primary Results & Effect Sizes:',
          'Methodological Flaws, Biases or Threats to Validity:',
          'Verbatim Quotes (with exact Page #) & How It Supports My Thesis:'
        ];
        fields.forEach((f, idx) => {
          const fy = cy + 34 + idx * 49;
          doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(8).text(f, MARGIN + 12, fy, { lineBreak: false });
          doc.moveTo(MARGIN + 12, fy + 19).lineTo(PAGE_W - MARGIN - 12, fy + 19).strokeColor(theme.border).lineWidth(0.5).stroke();
          doc.moveTo(MARGIN + 12, fy + 35).lineTo(PAGE_W - MARGIN - 12, fy + 35).strokeColor(theme.border).lineWidth(0.5).stroke();
        });
      }
    } else if (p >= 13 && p <= 16) {
      drawPageChrome(doc, theme, title, `Thesis Chapter Milestone Tracker & Advisor Feedback (Phase ${p - 12}/4)`, p, totalPages);

      const chapters = [
        'Ch 1: Introduction & Problem Statement',
        'Ch 1.2: Research Questions & Contributions',
        'Ch 2: Theoretical Background',
        'Ch 2.2: Systematic Literature Review',
        'Ch 3: Research Design & Methodology',
        'Ch 3.2: Data Collection & Ethics / IRB',
        'Ch 4: Empirical Analysis & Experiments',
        'Ch 4.2: Statistical / Qualitative Results',
        'Ch 5: Discussion & Theoretical Implications',
        'Ch 5.2: Limitations & Future Work',
        'Ch 6: Conclusion & Executive Abstract',
        'Appendices, Figures, Tables & Formatting'
      ];

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [170, 58, 58, 59, 42, 42, 42, 44],
        ['CHAPTER / SECTION MILESTONE', 'TARGET WC', 'ACTUAL WC', 'DEADLINE', 'OUTLINE', 'DRAFT 1', 'REVISED', 'FINAL'],
        12,
        24,
        {
          checkboxCols: [4, 5, 6, 7],
          prefillCol0: chapters
        }
      );

      // Advisor / Supervisor Meeting Action Log
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9.5).text('SUPERVISOR / ADVISOR MEETING LOG & REVISION ACTION ITEMS', MARGIN, endY + 16, { lineBreak: false });
      drawTable(
        doc,
        theme,
        MARGIN,
        endY + 32,
        [60, 185, 175, 50, 45],
        ['MEETING DATE', 'SUPERVISOR CRITIQUE / FEEDBACK SUMMARY', 'CONCRETE REVISION ACTION REQUIRED', 'CHAPTER', 'RESOLVED'],
        11,
        24,
        { checkboxCols: [4] }
      );
    } else {
      drawPageChrome(doc, theme, title, `Master Citation, Bibliography & Submission Audit (Log ${p - 16}/4)`, p, totalPages);

      const endY = drawTable(
        doc,
        theme,
        MARGIN,
        86,
        [68, 172, 105, 55, 38, 38, 39],
        ['CITEKEY / ID', 'FIRST AUTHOR, YEAR & SHORT TITLE', 'DOI / ISBN / URL', 'USED IN CH', 'PDF', 'IN-TEXT', 'BIBLIO'],
        22,
        24,
        {
          checkboxCols: [4, 5, 6],
          prefillCol0: Array.from({ length: 22 }, (_, i) => `REF-${String((p - 17) * 22 + i + 1).padStart(3, '0')}`)
        }
      );

      doc.roundedRect(MARGIN, endY + 12, CONTENT_W, 82, 4).fillAndStroke(theme.light, theme.border);
      doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(8.5).text('PRE-SUBMISSION CITATION & FORMATTING INTEGRITY CHECK', MARGIN + 12, endY + 22, { lineBreak: false });
      const checks = [
        'Every in-text citation matches bibliography entry 1:1',
        'Citation style (APA 7 / IEEE / Chicago / Harvard) uniform',
        'All DOIs & URLs active and formatted consistently',
        'Figures & Tables numbered sequentially with captions'
      ];
      checks.forEach((ch, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = MARGIN + 12 + col * (CONTENT_W / 2);
        const cy = endY + 40 + row * 20;
        drawCheckbox(doc, cx, cy, 9, theme.primary);
        doc.fillColor(theme.dark).font('Helvetica').fontSize(8).text(ch, cx + 14, cy + 1, { lineBreak: false });
      });
    }
  }

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function generateAll() {
  const themeKeys = Object.keys(THEMES);
  const generated = [];

  for (const tk of themeKeys) {
    generated.push(await buildExamPlanner(tk));
    generated.push(await buildLanguagePlanner(tk));
    generated.push(await buildCreatorPlanner(tk));
    generated.push(await buildSellerWorkbook(tk));
    generated.push(await buildResearchPlanner(tk));
  }

  console.log(`Successfully generated ${generated.length} PDF planners:`);
  for (const fp of generated) {
    const stat = fs.statSync(fp);
    console.log(` - ${path.basename(fp)} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
}

generateAll().catch((err) => {
  console.error('Error generating PDF planners:', err);
  process.exit(1);
});
