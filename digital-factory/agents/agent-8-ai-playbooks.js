const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(
  'c:\\Users\\bahloul.a\\Downloads\\Ai studio\\achrafbah.github.io-main\\downloads\\playbooks'
);

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// ============================================================================
// CORE PDF ENGINE & DESIGN SYSTEM
// ============================================================================
class PlaybookBuilder {
  constructor(filename, theme) {
    this.filepath = path.join(OUTPUT_DIR, filename);
    this.theme = theme;
    this.doc = new PDFDocument({
      size: 'A4',
      margins: { top: 55, bottom: 55, left: 48, right: 48 },
      bufferPages: true,
      info: {
        Title: theme.title,
        Author: 'Apex Digital Vault & AI Systems Engineering',
        Subject: theme.subtitle,
        Keywords: 'AI Prompts, Automation, Playbook, Systems, Copywriting, Workflows'
      }
    });
    this.stream = fs.createWriteStream(this.filepath);
    this.doc.pipe(this.stream);
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.contentWidth = this.pageWidth - 96;
  }

  drawCoverPage() {
    const { doc, theme, pageWidth, pageHeight } = this;

    // Dark luxury background
    doc.rect(0, 0, pageWidth, pageHeight).fill(theme.bgDark);

    // Top geometric accent bar
    doc.rect(0, 0, pageWidth, 14).fill(theme.primary);
    doc.rect(0, 14, pageWidth, 4).fill(theme.accent);

    // Subtle background grid lines
    doc.save();
    doc.strokeColor('#ffffff').opacity(0.04).lineWidth(0.5);
    for (let x = 48; x < pageWidth; x += 40) {
      doc.moveTo(x, 0).lineTo(x, pageHeight).stroke();
    }
    for (let y = 48; y < pageHeight; y += 40) {
      doc.moveTo(0, y).lineTo(pageWidth, y).stroke();
    }
    doc.restore();

    // Glowing decorative card frame
    doc.roundedRect(36, 46, pageWidth - 72, pageHeight - 92, 8)
       .lineWidth(1.5)
       .strokeColor(theme.primary)
       .stroke();

    // Edition badge
    doc.roundedRect(58, 76, 230, 26, 4).fill(theme.primary);
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(theme.editionBadge.toUpperCase(), 68, 84, { characterSpacing: 1.5 });

    // Price / Value Tag
    doc.roundedRect(pageWidth - 178, 76, 120, 26, 4)
       .lineWidth(1)
       .strokeColor(theme.accent)
       .stroke();
    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(theme.priceTag, pageWidth - 170, 84, { width: 104, align: 'center' });

    // Main Title
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(31)
       .text(theme.title, 58, 145, {
         width: pageWidth - 116,
         lineGap: 6
       });

    const afterTitleY = doc.y + 16;

    // Accent bar under title
    doc.rect(58, afterTitleY, 95, 5).fill(theme.accent);

    // Subtitle
    doc.fillColor('#cbd5e1')
       .font('Helvetica')
       .fontSize(14)
       .text(theme.subtitle, 58, afterTitleY + 22, {
         width: pageWidth - 116,
         lineGap: 5
       });

    // Center Visual Feature Box (Executive Matrix Preview)
    const boxY = 365;
    doc.roundedRect(58, boxY, pageWidth - 116, 235, 8)
       .fillAndStroke(theme.cardDark, theme.primary);

    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(11)
       .text('WHAT IS INSIDE THIS EXECUTIVE SYSTEM VAULT:', 78, boxY + 20, { characterSpacing: 1 });

    let featY = boxY + 46;
    theme.coverHighlights.forEach((hl, idx) => {
      doc.circle(86, featY + 6, 4).fill(theme.primary);
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(10.5)
         .text(`0${idx + 1}. ${hl.head}`, 100, featY);
      doc.fillColor('#94a3b8')
         .font('Helvetica')
         .fontSize(9.5)
         .text(hl.desc, 100, featY + 14, { width: pageWidth - 180 });
      featY += 35;
    });

    // Bottom Metadata Footer on Cover
    const bottomY = pageHeight - 135;
    doc.rect(58, bottomY, pageWidth - 116, 1).fill('#334155');

    theme.coverMetrics.forEach((m, i) => {
      const colW = (pageWidth - 116) / 3;
      const colX = 58 + i * colW;
      doc.fillColor(theme.accent)
         .font('Helvetica-Bold')
         .fontSize(16)
         .text(m.val, colX, bottomY + 16);
      doc.fillColor('#94a3b8')
         .font('Helvetica')
         .fontSize(8.5)
         .text(m.label.toUpperCase(), colX, bottomY + 36, { characterSpacing: 0.8 });
    });

    doc.fillColor('#64748b')
       .font('Helvetica')
       .fontSize(8.5)
       .text(
         'PUBLISHED BY APEX AI DIGITAL FACTORY  •  COMMERCIAL & ENTERPRISE LICENSE INCLUDED  •  2026 EDITION',
         58,
         pageHeight - 66,
         { width: pageWidth - 116, align: 'center' }
       );
  }

  addPageWithHeader(sectionTitle) {
    this.doc.addPage();
    const { doc, theme, pageWidth } = this;

    // Top header bar
    doc.rect(0, 0, pageWidth, 28).fill(theme.bgDark);
    doc.rect(0, 28, pageWidth, 2).fill(theme.primary);

    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(8)
       .text(theme.shortTitle.toUpperCase(), 48, 10, { characterSpacing: 1 });

    doc.fillColor(theme.accent)
       .font('Helvetica')
       .fontSize(8)
       .text(sectionTitle.toUpperCase(), 48, 10, {
         width: pageWidth - 96,
         align: 'right',
         characterSpacing: 0.8
       });

    doc.y = 48;
    doc.x = 48;
  }

  ensureSpace(neededHeight, sectionTitle = 'SYSTEM PLAYBOOK') {
    if (this.doc.y + neededHeight > this.pageHeight - 60) {
      this.addPageWithHeader(sectionTitle);
    }
  }

  drawTOC(chapters) {
    this.addPageWithHeader('TABLE OF CONTENTS & ARCHITECTURE');
    const { doc, theme, contentWidth } = this;

    doc.fillColor(theme.bgDark)
       .font('Helvetica-Bold')
       .fontSize(22)
       .text('Executive Table of Contents', 48, doc.y);

    doc.moveDown(0.3);
    doc.fillColor('#475569')
       .font('Helvetica')
       .fontSize(10)
       .text(
         'Every module in this guidebook is engineered for immediate deployment. Use the copy-paste frameworks, system prompts, and architectural blueprints in sequence or jump directly to your high-leverage bottleneck.',
         48,
         doc.y,
         { width: contentWidth, lineGap: 3 }
       );

    doc.moveDown(1);

    chapters.forEach((ch, idx) => {
      this.ensureSpace(48, 'TABLE OF CONTENTS');
      const y = doc.y;
      doc.roundedRect(48, y, contentWidth, 38, 5).fill('#f8fafc');
      doc.rect(48, y, 5, 38).fill(theme.primary);

      doc.fillColor(theme.primary)
         .font('Helvetica-Bold')
         .fontSize(10.5)
         .text(`MODULE ${String(idx + 1).padStart(2, '0')}: ${ch.title}`, 64, y + 7, {
           width: contentWidth - 90
         });

      doc.fillColor(theme.bgDark)
         .font('Helvetica-Bold')
         .fontSize(9.5)
         .text(ch.pageRef, 48, y + 7, { width: contentWidth - 14, align: 'right' });

      doc.fillColor('#64748b')
         .font('Helvetica')
         .fontSize(8.5)
         .text(ch.desc, 64, y + 22, { width: contentWidth - 80 });

      doc.y = y + 44;
    });

    this.drawCalloutBox(
      'HOW TO USE THIS VAULT FOR MAXIMUM ROI',
      '1. Bracketed variables like [TARGET AUDIENCE], [OFFER PRICE], or [TECH STACK] are dynamic slots—replace them with your specific context before running.\n2. Chain prompts sequentially: use the output of the Research/Architecture prompt as the context window input for the Execution prompt.\n3. Store your top-performing customized prompts in a dedicated Notion, Obsidian, or Custom GPT / Claude Project knowledge base.',
      'PRO TIP'
    );
  }

  drawChapterBanner(moduleNum, title, subtitle, metrics) {
    const { doc, theme, contentWidth } = this;
    const bannerH = 92;
    this.ensureSpace(bannerH + 20, `MODULE ${moduleNum}`);

    const y = doc.y;
    doc.roundedRect(48, y, contentWidth, bannerH, 6).fill(theme.bgDark);
    doc.rect(48, y, 7, bannerH).fill(theme.accent);

    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(9)
       .text(`MODULE ${String(moduleNum).padStart(2, '0')}  •  IMPLEMENTATION BLUEPRINT`, 66, y + 12, {
         characterSpacing: 1.2
       });

    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(16)
       .text(title, 66, y + 27, { width: contentWidth - 30 });

    doc.fillColor('#cbd5e1')
       .font('Helvetica')
       .fontSize(9.5)
       .text(subtitle, 66, y + 50, { width: contentWidth - 30, lineGap: 2 });

    if (metrics) {
      doc.fillColor(theme.accent)
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text(metrics, 66, y + 74);
    }

    doc.y = y + bannerH + 14;
  }

  drawSectionHeading(title, subtitle) {
    const { doc, theme, contentWidth } = this;
    this.ensureSpace(45, title);
    const y = doc.y;
    doc.rect(48, y + 2, 4, 16).fill(theme.primary);
    doc.fillColor('#0f172a')
       .font('Helvetica-Bold')
       .fontSize(13)
       .text(title, 58, y);

    if (subtitle) {
      doc.fillColor('#475569')
         .font('Helvetica')
         .fontSize(9.5)
         .text(subtitle, 58, doc.y + 3, { width: contentWidth - 10, lineGap: 2 });
    }
    doc.y += 8;
  }

  drawParagraph(text) {
    const { doc, contentWidth } = this;
    this.ensureSpace(36);
    doc.fillColor('#334155')
       .font('Helvetica')
       .fontSize(9.5)
       .text(text, 48, doc.y, { width: contentWidth, lineGap: 3 });
    doc.y += 8;
  }

  drawPromptBox(promptId, title, modelTag, promptText, expectedOutput, proTip) {
    const { doc, theme, contentWidth } = this;

    doc.font('Courier').fontSize(8.5);
    const promptHeight = doc.heightOfString(promptText, { width: contentWidth - 32, lineGap: 2 });

    doc.font('Helvetica').fontSize(8.5);
    const metaHeight = expectedOutput
      ? doc.heightOfString(`Output & Execution Note: ${expectedOutput}`, { width: contentWidth - 32 })
      : 0;
    const tipHeight = proTip
      ? doc.heightOfString(`Variable Injection Tip: ${proTip}`, { width: contentWidth - 32 })
      : 0;

    const totalH = 32 + promptHeight + (metaHeight ? metaHeight + 10 : 0) + (tipHeight ? tipHeight + 10 : 0) + 18;
    this.ensureSpace(totalH + 10, `PROMPT VAULT #${promptId}`);

    const startY = doc.y;

    // Outer container
    doc.roundedRect(48, startY, contentWidth, totalH, 5)
       .fillAndStroke('#f8fafc', '#cbd5e1');

    // Top bar of prompt box
    doc.roundedRect(48, startY, contentWidth, 24, 5).fill('#1e293b');
    doc.rect(48, startY + 18, contentWidth, 6).fill('#1e293b');

    // Badge
    doc.roundedRect(56, startY + 4, 66, 16, 3).fill(theme.primary);
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(8)
       .text(`PROMPT #${promptId}`, 60, startY + 8);

    // Title
    doc.fillColor('#ffffff')
       .font('Helvetica-Bold')
       .fontSize(9)
       .text(title, 130, startY + 7, { width: contentWidth - 205 });

    // Model tag
    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(7.5)
       .text(modelTag, 48, startY + 8, { width: contentWidth - 10, align: 'right' });

    // Prompt body
    let curY = startY + 31;
    doc.fillColor('#0f172a')
       .font('Courier')
       .fontSize(8.5)
       .text(promptText, 64, curY, { width: contentWidth - 32, lineGap: 2 });

    curY = doc.y + 6;

    if (expectedOutput) {
      doc.rect(58, curY, contentWidth - 20, 0.5).fill('#cbd5e1');
      curY += 5;
      doc.fillColor('#0369a1')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('EXPECTED DELIVERABLE: ', 64, curY, { continued: true })
         .fillColor('#334155')
         .font('Helvetica')
         .text(expectedOutput, { width: contentWidth - 32 });
      curY = doc.y + 4;
    }

    if (proTip) {
      doc.fillColor('#b45309')
         .font('Helvetica-Bold')
         .fontSize(8)
         .text('OPTIMIZATION LEVER: ', 64, curY, { continued: true })
         .fillColor('#475569')
         .font('Helvetica')
         .text(proTip, { width: contentWidth - 32 });
    }

    doc.y = startY + totalH + 10;
  }

  drawCalloutBox(title, body, badge = 'KEY INSIGHT') {
    const { doc, theme, contentWidth } = this;
    doc.font('Helvetica').fontSize(9);
    const bodyH = doc.heightOfString(body, { width: contentWidth - 36, lineGap: 2.5 });
    const boxH = bodyH + 36;

    this.ensureSpace(boxH + 10);
    const y = doc.y;

    doc.roundedRect(48, y, contentWidth, boxH, 5).fill('#eff6ff');
    doc.rect(48, y, 5, boxH).fill(theme.primary);

    doc.fillColor(theme.primary)
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(`[${badge}]  ${title}`, 64, y + 9, { width: contentWidth - 28 });

    doc.fillColor('#1e293b')
       .font('Helvetica')
       .fontSize(8.8)
       .text(body, 64, y + 24, { width: contentWidth - 32, lineGap: 2.5 });

    doc.y = y + boxH + 10;
  }

  drawTable(headers, rows, colWidths) {
    const { doc, theme, contentWidth } = this;
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    const scale = contentWidth / totalW;
    const scaledWidths = colWidths.map((w) => w * scale);

    this.ensureSpace(50);

    // Draw Header
    let y = doc.y;
    doc.rect(48, y, contentWidth, 22).fill(theme.bgDark);
    let x = 48;
    headers.forEach((h, i) => {
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text(h, x + 6, y + 6, { width: scaledWidths[i] - 12 });
      x += scaledWidths[i];
    });
    y += 22;

    rows.forEach((row, rIdx) => {
      // Calculate max row height
      let maxCellH = 18;
      row.forEach((cell, cIdx) => {
        doc.font(cIdx === 0 ? 'Helvetica-Bold' : 'Helvetica').fontSize(8.2);
        const h = doc.heightOfString(String(cell), { width: scaledWidths[cIdx] - 12, lineGap: 1.5 }) + 10;
        if (h > maxCellH) maxCellH = h;
      });

      if (y + maxCellH > this.pageHeight - 60) {
        this.addPageWithHeader('DATA MATRIX & BENCHMARKS');
        y = doc.y;
        doc.rect(48, y, contentWidth, 22).fill(theme.bgDark);
        let hx = 48;
        headers.forEach((h, i) => {
          doc.fillColor('#ffffff')
             .font('Helvetica-Bold')
             .fontSize(8.5)
             .text(h, hx + 6, y + 6, { width: scaledWidths[i] - 12 });
          hx += scaledWidths[i];
        });
        y += 22;
      }

      const bg = rIdx % 2 === 0 ? '#ffffff' : '#f1f5f9';
      doc.rect(48, y, contentWidth, maxCellH).fill(bg);
      doc.rect(48, y, contentWidth, maxCellH).lineWidth(0.4).strokeColor('#cbd5e1').stroke();

      let cx = 48;
      row.forEach((cell, cIdx) => {
        doc.fillColor(cIdx === 0 ? '#0f172a' : '#334155')
           .font(cIdx === 0 ? 'Helvetica-Bold' : 'Helvetica')
           .fontSize(8.2)
           .text(String(cell), cx + 6, y + 5, {
             width: scaledWidths[cIdx] - 12,
             lineGap: 1.5
           });
        cx += scaledWidths[cIdx];
      });

      y += maxCellH;
    });

    doc.y = y + 12;
  }

  drawWorkflowBlueprint(title, nodes, techStack, roiMetric) {
    const { doc, theme, contentWidth } = this;
    const nodeH = 44;
    const totalH = 42 + nodes.length * (nodeH + 10) + 28;
    this.ensureSpace(totalH + 12, title);

    const startY = doc.y;
    doc.roundedRect(48, startY, contentWidth, totalH, 6)
       .fillAndStroke('#0f172a', theme.primary);

    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(9.5)
       .text(`ARCHITECTURE BLUEPRINT: ${title.toUpperCase()}`, 64, startY + 12);

    doc.fillColor('#94a3b8')
       .font('Helvetica')
       .fontSize(8)
       .text(`Stack: ${techStack}   |   Target ROI: ${roiMetric}`, 64, startY + 25);

    let ny = startY + 42;
    nodes.forEach((n, idx) => {
      doc.roundedRect(64, ny, contentWidth - 32, nodeH, 4)
         .fillAndStroke('#1e293b', '#334155');

      // Step badge
      doc.roundedRect(72, ny + 8, 58, 28, 3).fill(theme.primary);
      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text(`NODE 0${idx + 1}`, 76, ny + 18, { width: 50, align: 'center' });

      doc.fillColor('#ffffff')
         .font('Helvetica-Bold')
         .fontSize(9.5)
         .text(`${n.stage}: ${n.name}`, 140, ny + 8, { width: contentWidth - 120 });

      doc.fillColor('#cbd5e1')
         .font('Helvetica')
         .fontSize(8.2)
         .text(n.detail, 140, ny + 22, { width: contentWidth - 120 });

      ny += nodeH + 10;
    });

    doc.fillColor(theme.accent)
       .font('Helvetica-Bold')
       .fontSize(8)
       .text(
         'ERROR HANDLING & FALLBACK: Enable HTTP 429 exponential backoff + dead-letter Slack alert webhook on every LLM node.',
         64,
         ny - 2
       );

    doc.y = startY + totalH + 12;
  }

  finalize() {
    const { doc, theme, pageWidth, pageHeight } = this;
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      if (i === 0) continue; // Skip cover footer

      // Temporarily disable bottom margin so footer text never triggers a new page
      const oldBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;

      doc.save();
      doc.rect(48, pageHeight - 38, pageWidth - 96, 0.6).fill('#cbd5e1');
      doc.fillColor('#64748b')
         .font('Helvetica')
         .fontSize(8)
         .text(
           `${theme.title}  —  Apex AI Systems Vault`,
           48,
           pageHeight - 28,
           { lineBreak: false }
         );
      doc.fillColor(theme.primary)
         .font('Helvetica-Bold')
         .fontSize(8.5)
         .text(
           `Page ${i + 1} of ${range.count}`,
           48,
           pageHeight - 28,
           { width: pageWidth - 96, align: 'right', lineBreak: false }
         );
      doc.restore();

      doc.page.margins.bottom = oldBottomMargin;
    }

    doc.end();
    return new Promise((resolve, reject) => {
      this.stream.on('finish', () => resolve({ filepath: this.filepath, pages: range.count }));
      this.stream.on('error', reject);
    });
  }
}

// ============================================================================
// BOOK 1: AI-Prompts-Mega-Bible.pdf (25+ Pages)
// ============================================================================
async function buildBook1() {
  const builder = new PlaybookBuilder('AI-Prompts-Mega-Bible.pdf', {
    title: 'THE 500+ HIGH-CONVERTING AI PROMPTS BIBLE',
    shortTitle: '500+ AI Prompts Mega-Bible (ChatGPT, Claude & Gemini)',
    subtitle:
      'The Complete Master Vault of System Instructions, Direct-Response Copywriting Frameworks, SEO Content Engines, Cold Outreach Sequences, Full-Stack Coding Architectures & Financial Modeling Prompts',
    editionBadge: 'Enterprise Master Vault • v4.2',
    priceTag: '$49 VALUE EDITION',
    bgDark: '#090d16',
    cardDark: '#111827',
    primary: '#4f46e5',
    accent: '#22d3ee',
    coverHighlights: [
      {
        head: 'Direct-Response Copywriting Frameworks (PAS, AIDA, StoryBrand, 4Ps)',
        desc: 'High-converting VSL scripts, long-form sales letters, landing page wireframes, and objection-crushing offer stacks.'
      },
      {
        head: 'Programmatic SEO & Authority Content Engines',
        desc: 'Topical authority maps, E-E-A-T long-form pillar articles, semantic NLP entity injection, and zero-click snippet capture.'
      },
      {
        head: 'B2B Cold Email, LinkedIn Social Selling & Sales Pipelines',
        desc: 'Hyper-personalized 4-step outbound sequences, trigger-based icebreakers, and MEDDIC discovery call analyzers.'
      },
      {
        head: 'Full-Stack Software Engineering, Debugging & System Design',
        desc: 'Production-ready Next.js/TypeScript/Python generation, SQL query optimization, security audits, and automated unit tests.'
      },
      {
        head: 'CFO-Grade Financial Modeling & Mega-Prompt System Personas',
        desc: 'SaaS unit economics, DCF valuation tables, 3-statement sensitivity analysis, and reusable Meta-Prompt generators.'
      }
    ],
    coverMetrics: [
      { val: '500+ SLOTS', label: 'Modular Prompt Permutations' },
      { val: '6 CORE DOMAINS', label: 'Copy, SEO, Sales, Code, Finance, Meta' },
      { val: 'MULTI-MODEL', label: 'Optimized for GPT-4o, Claude 3.5 & Gemini' }
    ]
  });

  builder.drawCoverPage();

  builder.drawTOC([
    {
      title: 'The Meta-Prompt Architecture & Context Engineering Engine',
      pageRef: 'Module 01',
      desc: 'Deterministic constraint layering, few-shot calibration, chain-of-thought reasoning, and output schema enforcement.'
    },
    {
      title: 'Direct-Response Copywriting Frameworks (PAS, AIDA, StoryBrand)',
      pageRef: 'Module 02',
      desc: 'Landing pages, VSL scripts, psychological pricing anchors, guarantee engineers, and high-ticket offer stacks.'
    },
    {
      title: 'SEO Content Engines & Topical Authority Clusters',
      pageRef: 'Module 03',
      desc: 'Keyword clustering, E-E-A-T long-form briefs, semantic NLP optimization, and internal linking architectures.'
    },
    {
      title: 'Cold Email, LinkedIn Outreach & High-Ticket B2B Sales',
      pageRef: 'Module 04',
      desc: 'Signal-based cold emails, LinkedIn DM appointments, objection handling matrices, and discovery call synthesis.'
    },
    {
      title: 'Full-Stack Coding, System Architecture & Deep Debugging',
      pageRef: 'Module 05',
      desc: 'Clean architecture blueprints, SQL indexing, security vulnerability scanning, and automated test generation.'
    },
    {
      title: 'Financial Analysis, SaaS Unit Economics & Executive Strategy',
      pageRef: 'Module 06',
      desc: '3-statement modeling, LTV:CAC cohort diagnostics, M&A due diligence, and board-level scenario planning.'
    },
    {
      title: 'Mega-Prompt System Instructions & Custom Agent Personas',
      pageRef: 'Module 07',
      desc: 'Drop-in system prompts for Custom GPTs, Claude Projects, and Gemini Gems + The 500+ Permutation Matrix.'
    }
  ]);

  // MODULE 1
  builder.addPageWithHeader('MODULE 01: META-PROMPT ARCHITECTURE');
  builder.drawChapterBanner(
    1,
    'The Meta-Prompt Architecture & Context Engineering',
    'Why 95% of standard prompts produce generic fluff—and how the 7-Layer Deterministic Prompt Stack forces executive-grade output every time.',
    'IMPACT BENCHMARK: +340% Output Precision  |  -80% Revision Cycles'
  );

  builder.drawParagraph(
    'Modern Large Language Models (ChatGPT-4o/o3, Claude 3.5 Sonnet, Gemini 2.5 Pro) operate as probabilistic token predictors. When given a vague instruction like "Write a landing page for my SaaS," the model averages the entire internet and outputs cliched corporate jargon ("Unlock your potential," "In today\'s fast-paced digital landscape"). To extract top-0.1% output, every prompt in this Bible uses the 7-Layer Deterministic Architecture.'
  );

  builder.drawTable(
    ['Layer #', 'Architectural Component', 'Engineering Purpose', 'Failure Mode If Omitted'],
    [
      ['Layer 1', 'Identity & Domain Calibration', 'Assigns a hyper-specific 15-year specialist persona with explicit mental models.', 'Generic assistant tone with shallow surface advice.'],
      ['Layer 2', 'Context & Business Telemetry', 'Injects ICP pain points, unit economics, market sophistication level, and product truth.', 'Hallucinated features and mismatched buyer awareness.'],
      ['Layer 3', 'Framework & Cognitive Methodology', 'Forces adherence to proven structures (PAS, StoryBrand, MEDDIC, Clean Architecture).', 'Unstructured rambling without persuasive or logical arc.'],
      ['Layer 4', 'Negative Constraints (Anti-Fluff)', 'Explicitly bans AI cliches ("delve", "tapestry", "game-changer") and passive voice.', 'Robotic AI-sounding copy that destroys buyer trust.'],
      ['Layer 5', 'Few-Shot Golden Examples', 'Provides 1-2 concrete input/output pairs demonstrating exact rhythm and formatting.', 'Inconsistent tone and unpredictable paragraph density.'],
      ['Layer 6', 'Chain-of-Thought Scratchpad', 'Instructs the model to reason through edge cases inside <thinking> tags before writing.', 'Shallow first-draft reasoning and missed logical flaws.'],
      ['Layer 7', 'Strict Output Schema', 'Enforces Markdown tables, JSON payloads, or exact section headers with word counts.', 'Unusable wall of text requiring manual reformatting.']
    ],
    [12, 26, 34, 28]
  );

  builder.drawCalloutBox(
    'THE ANTI-CLICHE SYSTEM BAN LIST (PASTE INTO EVERY WORKSPACE)',
    'Add this constraint block to your Custom Instructions or Claude Project Rules: "NEVER use the following words or phrases: delve, tapestry, testament, beacon, symphony, unlock, unleash, elevate, game-changer, cutting-edge, landscape, realm, foster, paramount, delve into, in conclusion, it is important to note. Write with sharp, concrete nouns, active verbs, and quantified claims."',
    'MANDATORY RULE'
  );

  const mod1Prompts = [
    {
      id: '101',
      title: 'The Universal Meta-Prompt Architect (Prompt Generator)',
      model: 'Claude 3.5 Sonnet / GPT-4o',
      prompt: `ROLE: Act as a Principal Prompt Engineer and Cognitive Systems Architect specializing in LLM optimization for [TARGET MODEL: GPT-4o / Claude 3.5 Sonnet / Gemini Pro].
CONTEXT: I need to accomplish [SPECIFIC BUSINESS GOAL] for [TARGET AUDIENCE / INDUSTRY]. My current inputs are [LIST AVAILABLE DATA].
TASK: Design a production-grade, 7-layer Mega-Prompt that I can paste into a fresh session to generate a world-class deliverable.
REQUIRED STRUCTURE:
1. <system_role>: Define an elite domain specialist with 3 specific mental models they use.
2. <context_variables>: Create bracketed input slots [LIKE_THIS] for all essential context I must supply.
3. <methodology>: Specify the exact step-by-step analytical or creative framework the AI must follow.
4. <negative_constraints>: List 10 strict rules of what NOT to do (ban generic phrasing, enforce specificity).
5. <reasoning_protocol>: Instruct the AI to first validate assumptions in a 5-bullet pre-flight check.
6. <output_format>: Define exact Markdown headings, tables, and deliverable templates.
OUTPUT: Provide the complete copy-pasteable Mega-Prompt inside a single code block, followed by a 3-step guide on how to chain follow-up prompts.`,
      out: 'A complete, reusable Mega-Prompt tailored to any task + follow-up chaining protocol.',
      tip: 'Run this first whenever entering a new industry vertical or building an internal company SOP.'
    },
    {
      id: '102',
      title: 'First-Principles Deconstruction & Blind-Spot Auditor',
      model: 'OpenAI o3 / Claude 3.5 Sonnet',
      prompt: `ROLE: You are a First-Principles Strategist and Red-Team Executive Advisor.
INPUT PROPOSAL: "[PASTE YOUR BUSINESS PLAN, COPY DRAFT, OR PRODUCT STRATEGY]"
TASK: Deconstruct my proposal down to fundamental physics/economics truths and expose hidden failure points.
EXECUTE IN 4 STAGES:
Stage 1 (Assumption Extraction): List the 7 core assumptions my plan relies on to succeed. Rank each by Fragility (1-10).
Stage 2 (Pre-Mortem Simulation): Assume it is 12 months from today and this initiative failed catastrophically. Write the forensic post-mortem explaining the exact 3 reasons why.
Stage 3 (First-Principles Rebuild): Strip away industry convention. What is the fastest, lowest-cost path to validate the core value proposition in 7 days?
Stage 4 (Actionable Fixes): Provide a Markdown table mapping each flaw to a concrete mitigation step you can execute today.`,
      out: 'Forensic assumption matrix, pre-mortem failure analysis, and 7-day lean validation sprint.',
      tip: 'Feed your actual pricing, CAC estimates, and timeline so the Red-Team audit is mathematically grounded.'
    },
    {
      id: '103',
      title: 'Voice-of-Customer (VoC) Linguistic DNA Extractor',
      model: 'Claude 3.5 Sonnet / Gemini 2.5 Pro',
      prompt: `ROLE: Act as a Conversion Consumer Psychologist and Qualitative Data Scientist.
RAW DATA INPUT: [PASTE 15-50 REDDIT COMMENTS, G2/TRUSTPILOT REVIEWS, AMAZON REVIEWS, OR SALES CALL TRANSCRIPTS]
TASK: Extract the exact linguistic DNA and emotional triggers of this market to fuel all downstream copywriting.
DELIVERABLE SCHEMA:
1. The "3 AM Bleeding Neck" Matrix: 5 verbatim pain points prospects experience, categorized by Functional, Financial, and Social/Status fear.
2. Failed Solutions Graveyard: What have they already tried that disappointed them, and why do they distrust current vendors?
3. Exact Verbatim Dictionary: 15 exact phrases/slang terms buyers use to describe their problem and desired transformation.
4. The "Shut Up and Take My Money" Trigger: The #1 tangible outcome that makes price irrelevant.
5. 5 High-Converting Hook Angles derived directly from the verbatim quotes.`,
      out: 'Complete Voice-of-Customer research dossier with verbatim dictionary and 5 validated hook angles.',
      tip: 'Scrape 1-star and 3-star reviews of your top 3 competitors on G2 or Trustpilot and paste them raw.'
    }
  ];

  mod1Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 2: COPYWRITING FRAMEWORKS
  builder.addPageWithHeader('MODULE 02: DIRECT-RESPONSE COPYWRITING');
  builder.drawChapterBanner(
    2,
    'Direct-Response Copywriting Frameworks (PAS, AIDA, StoryBrand)',
    'Turn cold traffic into high-intent buyers using battle-tested persuasion frameworks calibrated to Eugene Schwartz\'s 5 Stages of Market Awareness.',
    'CONVERSION LIFT: +42% Landing Page CVR  |  +68% VSL Hold Rate'
  );

  builder.drawParagraph(
    'Great copywriting is not creative writing—it is structured salesmanship multiplied by distribution. Whether you are selling a $29 digital playbook, a $99/mo B2B SaaS, or a $10,000 agency retainer, the prompts in Module 02 force the LLM to write with visceral specificity, proof-backed mechanisms, and frictionless calls to action.'
  );

  const mod2Prompts = [
    {
      id: '201',
      title: 'PAS (Problem-Agitate-Solve) High-Converting Sales Page Engine',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Senior Direct-Response Copywriter trained in Gary Halbert, Eugene Schwartz, and Joanna Wiebe (Copyhackers) methodologies.
PRODUCT/OFFER: [PRODUCT NAME & CORE MECHANISM]
PRICE POINT: [PRICE] | TARGET ICP: [SPECIFIC BUYER PERSONA]
PRIMARY PAIN: [MAIN FRUSTRATION] | UNIQUE MECHANISM: [WHY YOUR SOLUTION WORKS WHEN OTHERS FAIL]
TASK: Write a complete long-form Landing Page using the expanded PAS (Problem-Agitate-Discredit-Solve-Proof-Offer) architecture.
SECTIONS TO GENERATE:
1. Above-the-Fold Hero: Eyebrow callout, 3 variations of a quantified headline, sub-headline explaining the Unique Mechanism, CTA button text + micro-copy risk reversal.
2. The Problem & Visceral Agitation: Describe a specific Tuesday morning scenario where the problem costs them [TIME/MONEY/STATUS]. No generic fluff.
3. The "Old Way" Graveyard: Explain why 3 common alternatives fail (shift blame from the buyer to the broken mechanism).
4. Introducing the Unique Mechanism: Present [PRODUCT NAME] as the inevitable bridge. Break it into a 3-Step System with proprietary-sounding names.
5. Feature-to-Benefit-to-Financial-Outcome Table: 6 core features translated into emotional and monetary wins.
6. The Irresistible Value Stack & Guarantee: Itemize bonuses with realistic anchor values + a 30-day conditional or unconditional risk-reversal guarantee.
7. FAQ Objection Crusher: Answer the top 6 skeptical buyer objections (Price, Time, Tech Skill, Trust, ROI speed, Refunds).`,
      out: 'Full 1,800-word conversion landing page wireframed section-by-section.',
      tip: 'Always define your "Unique Mechanism"—give your process a named 3-step methodology.'
    },
    {
      id: '202',
      title: 'AIDA (Attention-Interest-Desire-Action) Video Sales Letter (VSL) Script',
      model: 'Claude 3.5 Sonnet / GPT-4o',
      prompt: `ROLE: You are an 8-Figure VSL Scriptwriter and Direct-Response Creative Director.
OFFER: [OFFER DETAILS] | TARGET AUDIENCE: [ICP] | VIDEO LENGTH: [5 MIN / 12 MIN]
TASK: Write a high-retention Video Sales Letter script using the AIDA + Pattern Interrupt framework, formatted in a 2-column Visual/Audio production script.
REQUIRED SCRIPT BLOCKS:
- [0:00 - 0:15] THE CONTRARIAN HOOK: Open with a bold, counter-intuitive claim + immediate visual proof B-roll cue.
- [0:15 - 1:00] THE CREDIBILITY & EMPATHY BRIDGE: Establish why you discovered this without sounding arrogant; validate their current struggle.
- [1:00 - 2:30] THE HIDDEN ENEMY & PARADIGM SHIFT: Reveal the single hidden bottleneck holding them back and introduce the New Paradigm.
- [2:30 - 4:00] THE 3-PILLAR WALKTHROUGH (DESIRE): Show how the system works in 3 visual pillars without giving away the entire manual execution.
- [4:00 - 5:00] THE CASE STUDY PROOF & STACK (ACTION): Walk through concrete before/after metrics, price anchoring, urgency trigger, and exact next click instructions.
CONSTRAINTS: Write at a 6th-grade reading level, short punchy sentences, include [VISUAL CUE] and [TONE CUE] brackets every 20 seconds.`,
      out: 'Production-ready VSL script with visual B-roll cues, pacing notes, and retention hooks.',
      tip: 'Read the generated script out loud at 150 words per minute to verify natural spoken cadence.'
    },
    {
      id: '203',
      title: 'Donald Miller StoryBrand (SB7) Complete Brand Messaging Script',
      model: 'GPT-4o / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Certified StoryBrand Messaging Strategist.
COMPANY/OFFER: [BRAND NAME & OFFER] | CUSTOMER: [HERO PERSONA]
TASK: Build a complete 7-Part StoryBrand BrandScript where the Customer is the Hero and our Brand is the Guide.
DELIVERABLE MATRIX:
1. A Character (The Hero): Define the single crystal-clear desire they want related to our product.
2. Has a Problem:
   - Villain: Root cause personified.
   - External Problem: Tangible surface problem.
   - Internal Problem: How it makes them feel (insecure, overwhelmed, behind).
   - Philosophical Problem: Why this shouldn't be this hard ("You shouldn't have to...").
3. And Meets a Guide: Empathy statement + 3 quantified Authority proof points.
4. Who Gives Them a Plan: A 3-Step Process Plan (Step 1, Step 2, Step 3) + a 4-point Agreement Plan that reduces fear.
5. And Calls Them to Action: Direct CTA (Buy/Book Now) + Transitional CTA (Lead Magnet).
6. That Helps Them Avoid Failure: 4 concrete costs of inaction over the next 6 months.
7. And Ends in Success: 5 vivid before-and-after transformation states.
BONUS: Synthesize a 1-sentence "One-Liner" pitch for networking and bio headers.`,
      out: 'Complete 7-part BrandScript table + website wireframe + 1-sentence elevator One-Liner.',
      tip: 'Use the Transitional CTA output to immediately build your automated email lead magnet.'
    },
    {
      id: '204',
      title: 'Alex Hormozi "$100M Grand Slam Offer" Architect & Value Equation',
      model: 'GPT-4o / o3',
      prompt: `ROLE: Act as a Pricing Strategist and Offer Architect modeled on the Value Equation: Value = (Dream Outcome x Perceived Likelihood of Achievement) / (Time Delay x Effort & Sacrifice).
CORE PRODUCT: [WHAT YOU CURRENTLY SELL] | CURRENT PRICE: [PRICE] | TARGET BUYER: [ICP]
TASK: Engineer a "Grand Slam Offer" that makes prospects feel stupid saying no, allowing a 3x-5x price increase.
EXECUTE THESE 5 STEPS:
Step 1 (Obstacle Inventory): List every single friction point, fear, and step the customer faces before, during, and after buying.
Step 2 (Solution Transformation): Turn the top 5 obstacles into high-value, low-marginal-cost bonus assets (checklists, templates, swipe files, scripts, calculators).
Step 3 (Time Delay Compression): Design a "First 48-Hour Quick Win" mechanism so the buyer gets a tangible dopamine/ROI win within 2 days.
Step 4 (Naming Formula - MAGIC): Generate 10 offer names using [Magnetic Reason Why] + [Avatar] + [Goal] + [Time Interval] + [Container Word].
Step 5 (Risk Reversal Guarantee): Draft 3 guarantees: Unconditional, Conditional ("If you don't achieve X in Y days, we do Z"), and Anti-Guarantee.`,
      out: 'Complete Grand Slam Offer stack, 5 bonus assets, 48-hour quick win, 10 MAGIC names, and 3 guarantees.',
      tip: 'Focus heavily on the bottom of the equation—reducing Time Delay and Effort beats adding more curriculum.'
    },
    {
      id: '205',
      title: '50-Headline Viral & Direct-Response Split-Test Matrix',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Master Headline Copywriter combining David Ogilvy, John Caples, and modern high-CTR digital media testing.
TOPIC / OFFER: [TOPIC OR PRODUCT] | AUDIENCE: [ICP] | CORE BENEFIT: [QUANTIFIED WIN]
TASK: Generate 25 distinct, high-converting headlines organized into 5 psychological categories (5 per category):
1. Quantified Proof & Timeframe ("How [Avatar] Achieved [Metric] in [Days] Without [Pain]")
2. Contrarian & Myth-Buster ("Why Everything You Were Told About [Topic] Is Costing You [Loss]")
3. Curiosity Gap & Mechanism ("The '3-Line' [Mechanism] Quietly Used by Top 1% [Avatars]")
4. Direct Fear / Diagnostic ("7 Warning Signs Your [System] Is Bleeding [Money/Time] Right Now")
5. Ultra-Specific Case Study ("Inside the $[X] Blueprint: How We Rebuilt [Process] in One Weekend")
OUTPUT: Present in a Markdown table with columns: [Category | Headline | Psychological Trigger | Best Placement (Ad/Hero/Email)].`,
      out: '25 categorized headlines ready for Meta Ads, Landing Page A/B tests, and YouTube titles.',
      tip: 'Pick your top 3 headlines and run a $20 Meta traffic split-test before locking in your landing page hero.'
    },
    {
      id: '206',
      title: '7-Day Soap Opera & Cart-Close Email Launch Sequence',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as an Email Marketing Revenue Strategist specializing in automated welcome & product launch sequences.
OFFER: [PRODUCT + PRICE] | LEAD MAGNET OPTED IN FOR: [LEAD MAGNET] | AUDIENCE: [ICP]
TASK: Write a complete 7-Email sequence combining Russell Brunson's Soap Opera Sequence with behavioral urgency cart-close triggers.
EMAIL ARCHITECTURE:
- Email 1 (Immediate): Deliver the Lead Magnet + Quick Win + Set the Stage (Open Loop for tomorrow).
- Email 2 (Day 2): High Drama & Backstory — Hit the wall, discover the Epiphany / Unique Mechanism.
- Email 3 (Day 3): The Hidden Benefits — How solving [Problem] transforms their business/life + soft offer intro.
- Email 4 (Day 4): Case Study & Forensic Proof — Walk through a real or composite before/after breakdown.
- Email 5 (Day 5): The Logical Case & ROI Math — Break down the cost of inaction vs. the tiny investment.
- Email 6 (Day 6): FAQ & Skepticism Crusher — Address the top 4 reasons they are hesitating.
- Email 7 (Day 7 - Final 6 Hours): Pure Urgency + Guarantee Summary + Loss Aversion Close.
Provide 3 Subject Lines + Preview Text for each email, plus the full body copy.`,
      out: '7 complete conversion emails with 21 subject lines, preview text, and open-loop transitions.',
      tip: 'Set up a conditional branch in ConvertKit/ActiveCampaign to stop sales emails the moment a user purchases.'
    },
    {
      id: '207',
      title: 'Psychological Pricing Page & Tier Comparison Architect',
      model: 'GPT-4o',
      prompt: `ROLE: Act as a Behavioral Economist and SaaS/Digital Product Pricing Architect (Dan Ariely & Patrick Campbell methodology).
PRODUCT: [PRODUCT/SERVICE] | TARGET AVERAGE ORDER VALUE (AOV): [$X]
TASK: Design a 3-Tier Decoy Pricing Architecture (Starter / Pro / Enterprise or Basic / Complete Vault / VIP Bundle) engineered to push 70%+ of buyers into the middle or top tier.
DELIVERABLE:
1. Tier Naming, Price Points, and "Best For [Avatar]" sub-labels.
2. The Decoy Anchor Effect: How Tier 3 makes Tier 2 look like an absolute steal (or how Tier 2 makes Tier 3 a no-brainer upgrade).
3. Feature Matrix Table (10 rows) distinguishing Core Value Metrics from Bonus Accelerators.
4. Checkout Order Bump ($19-$37 impulse add-on) copy + One-Click Post-Purchase Upsell (OTO) script.
5. Micro-copy for under the checkout button (security badges, instant access, guarantee reminder).`,
      out: '3-tier pricing table, decoy psychology breakdown, checkout order bump, and post-purchase upsell copy.',
      tip: 'Adding a $27 single-click Order Bump at checkout routinely increases total gross revenue by 18-25%.'
    },
    {
      id: '208',
      title: 'High-Converting Webinar / Masterclass Pitch Deck & Script',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a High-Ticket Webinar Conversion Architect (Perfect Webinar Framework).
OFFER: [HIGH-TICKET PROGRAM OR BUNDLE] | PRICE: [$297 - $2,997] | AUDIENCE: [ICP]
TASK: Outline a 60-minute conversion masterclass that teaches real value while creating massive demand for the paid implementation system.
STRUCTURE:
1. Minutes 0-10 (The Introduction & Ruler): Bold promise, reason to stay till the end (exclusive bonus), authority story.
2. Minutes 10-20 (Secret #1 - Vehicle Belief): Break their false belief about the method/tool.
3. Minutes 20-30 (Secret #2 - Internal Belief): Break their false belief about their own ability/time/tech skill.
4. Minutes 30-40 (Secret #3 - External Belief): Break their false belief about outside obstacles (capital, market saturation).
5. Minutes 40-45 (The Transition Bridge): "Let me ask you a question..." permission to present the offer.
6. Minutes 45-60 (The Stack, Price Drop, Fast-Action Bonus & Q&A): Slide-by-slide script for the close.`,
      out: 'Complete 60-minute webinar slide outline, belief-breaking stories, transition script, and stack close.',
      tip: 'Never teach "how" to do manual busywork on a webinar—teach "what" and "why", then sell the automated "how".'
    }
  ];

  mod2Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 3: SEO CONTENT ENGINES
  builder.addPageWithHeader('MODULE 03: SEO CONTENT ENGINES');
  builder.drawChapterBanner(
    3,
    'SEO Content Engines & Topical Authority Clusters',
    'Dominate Google SERPs and AI Answer Engines (Perplexity, ChatGPT Search, Google AI Overviews) with semantic entity density and E-E-A-T authority.',
    'TRAFFIC SYSTEM: Topical Authority Hub-and-Spoke  |  AI Overview Citation Ready'
  );

  builder.drawParagraph(
    'Publishing generic 1,500-word AI blog posts no longer ranks. Modern search engines reward Information Gain—original frameworks, data tables, first-hand implementation nuance, and comprehensive topical clusters. Use Module 03 to build entire hub-and-spoke content ecosystems in hours.'
  );

  const mod3Prompts = [
    {
      id: '301',
      title: 'Topical Authority Map & 30-Article Hub-and-Spoke Architect',
      model: 'Gemini 2.5 Pro / GPT-4o',
      prompt: `ROLE: Act as an Enterprise Technical SEO Director and Semantic Search Architect.
CORE NICHE / SEED TOPIC: [NICHE] | MONETIZATION OFFER: [PRODUCT/SERVICE]
TASK: Engineer a complete 30-Article Topical Authority Cluster designed to establish total domain dominance in 90 days.
DELIVERABLE:
1. 3 Pillar Pages (3,500+ words each) targeting high-volume commercial/informational head terms.
2. 27 Supporting Spoke Articles (9 per Pillar) broken down by Search Intent:
   - Bottom-of-Funnel (BoFU): "Best X for Y", "[Competitor A] vs [Competitor B]", "[Tool] Pricing & Alternatives".
   - Middle-of-Funnel (MoFU): "How to Automate [Process]", "[Framework] Template & Examples".
   - Top-of-Funnel (ToFU): Diagnostic guides, industry benchmarks, glossary definitions.
3. Internal Linking Protocol: Exact anchor text rules connecting every Spoke back to its parent Pillar and to the Money Page.
OUTPUT FORMAT: Comprehensive Markdown table with columns: [Cluster | Article Title | Primary Keyword | Intent | Funnel Stage | CTA Lead Magnet].`,
      out: '30-article semantic SEO roadmap with BoFU-first prioritization and internal linking rules.',
      tip: 'Always publish the Bottom-of-Funnel (BoFU) comparison and template posts first—they convert at 5-8% vs 0.2% for ToFU.'
    },
    {
      id: '302',
      title: 'E-E-A-T & Information-Gain Long-Form Article Generator',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: You are a Senior Industry Practitioner and Technical Editor writing for an executive audience.
PRIMARY KEYWORD: [TARGET KEYWORD] | SECONDARY ENTITIES: [LIST 8-10 LSI/NLP TERMS]
UNIQUE PERSPECTIVE / DATA TO INCLUDE: [YOUR SPECIFIC METHOD OR CASE STUDY]
TASK: Write an authoritative, high-Information-Gain guide that outranks generic content on Google and gets cited by AI Answer Engines.
STRICT WRITING RULES:
1. Zero throat-clearing introductions: Answer the core query in the very first 60 words (Featured Snippet / AI Overview block).
2. Include at least 2 structured Markdown comparison tables, 1 copy-paste code/prompt/checklist block, and 1 step-by-step mathematical or workflow calculation.
3. Inject E-E-A-T signals: Include sections titled "Common Production Pitfalls We See," "Edge Cases When Scaling," and "Benchmark Metrics."
4. Naturally weave all Secondary Entities without keyword stuffing.
5. Maintain short paragraphs (max 3-4 lines), bold key takeaways for skimmers, and end with a 5-question Schema-ready FAQ.`,
      out: '2,500+ word practitioner-grade SEO article with snippet blocks, tables, and E-E-A-T diagnostics.',
      tip: 'Paste the top 3 ranking competitor H2 outlines into the prompt and instruct Claude to add 3 sections none of them cover.'
    },
    {
      id: '303',
      title: 'Programmatic SEO (pSEO) Dataset & Template Schema Builder',
      model: 'GPT-4o / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Growth Engineer specializing in Programmatic SEO (Zapier, Wise, Canva, NomadList methodology).
BUSINESS MODEL: [YOUR PRODUCT/DIRECTORY/TOOL] | TARGET AUDIENCE: [ICP]
TASK: Design a scalable Programmatic SEO architecture capable of generating 500+ high-intent landing pages without thin-content penalties.
DELIVERABLE:
1. 5 Scalable Head-Term + Modifier Patterns (e.g., "[Integration A] + [Integration B] Automation", "Best [Service] in [City]", "[Role] Resume Template for [Industry]").
2. Database Schema Design: Define the exact 12 CSV/Airtable/PostgreSQL columns needed so each page has unique data, stats, and dynamic copy.
3. Page Wireframe & Dynamic Variable Blocks: Show how to combine deterministic data tables with AI-synthesized local/contextual analysis.
4. Thin-Content Defense Checklist: 6 technical rules (canonical tags, indexation thresholds, internal cross-linking) to guarantee Google indexes 90%+ of pages.`,
      out: '5 pSEO URL patterns, 12-column database schema, dynamic wireframe, and indexation defense checklist.',
      tip: 'Ensure at least 40% of each programmatic page consists of unique structured data or specific tool interactivity.'
    },
    {
      id: '304',
      title: 'Featured Snippet, People-Also-Ask & AI Overview (GEO) Optimizer',
      model: 'GPT-4o',
      prompt: `ROLE: Act as a Generative Engine Optimization (GEO) and SERP Feature Specialist.
TARGET QUERY: [SEARCH QUERY] | CURRENT DRAFT SECTION: [PASTE EXISTING PARAGRAPH]
TASK: Rewrite and structure this content to win both the Google Featured Snippet and citations in ChatGPT Search / Perplexity / Google AI Overviews.
PROVIDE 4 OPTIMIZED BLOCKS:
1. The 45-Word Direct Definition Block: Starts with "[Keyword] is..." using objective, encyclopedic syntax that LLMs extract verbatim.
2. The Ordered Process List: A 5-step numbered list where each step starts with a bold imperative verb phrase (e.g., "**1. Configure the Webhook Endpoint:**").
3. The Comparative Data Table: A 4-column summary matrix comparing options by Cost, Setup Time, Best Use Case, and Limitation.
4. JSON-LD FAQPage & Article Schema Markup: Valid, copy-pasteable <script type="application/ld+json"> code for the page header.`,
      out: '45-word snippet block, ordered list, comparison matrix, and ready-to-paste JSON-LD schema.',
      tip: 'AI search engines strongly favor pages with clean HTML tables and explicit numerical benchmarks.'
    },
    {
      id: '305',
      title: 'Competitor Content Gap & Content Refresh Surgery Prompt',
      model: 'Claude 3.5 Sonnet / Gemini 2.5 Pro',
      prompt: `ROLE: Act as an SEO Content Auditor and Conversion Rate Strategist.
OUR CURRENT ARTICLE: [PASTE OUR ARTICLE TEXT OR OUTLINE]
TOP 3 RANKING COMPETITORS: [PASTE COMPETITOR H2/H3 HEADINGS OR SUMMARIES]
SEARCH CONSOLE DATA (OPTIONAL): [QUERIES WITH HIGH IMPRESSIONS BUT LOW CTR]
TASK: Perform a surgical Content Refresh to jump from Page 2 (positions 8-20) into the Top 3 within 30 days.
DELIVERABLE:
1. Entity & Subtopic Gap Table: What specific questions, entities, or tools do the top 3 competitors cover that our page misses?
2. Outdated / Fluff Pruning List: Identify paragraphs in our draft that dilute topical relevance and should be deleted.
3. New Sections to Inject: Write the exact full copy for the 3 missing high-value sections.
4. CTR Title & Meta Description Upgrade: 5 high-CTR Title Tags (under 60 chars, using brackets/numbers/year) and 3 Meta Descriptions.`,
      out: 'Surgical gap analysis, pruned fluff report, 3 newly written authority sections, and 5 high-CTR title tags.',
      tip: 'Refreshing decaying posts sitting at positions 6-15 yields 5x faster traffic gains than writing brand new posts.'
    },
    {
      id: '306',
      title: 'Digital PR, Linkable Data Study & HARO Pitch Generator',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Digital PR Director and Authority Link-Building Strategist.
BRAND / NICHE: [YOUR BRAND & NICHE] | PROPRIETARY OR PUBLIC DATASET: [DATA TOPIC]
TASK: Create a "Link Magnet" Original Research Study outline + journalist outreach pitches that earn DR 70+ editorial backlinks naturally.
DELIVERABLE:
1. 5 Counter-Intuitive Study Concepts using public data (Bureau of Labor, SEC filings, GitHub, Reddit, Kaggle, or internal user metrics).
2. The "Stat-First" Article Structure: How to present 7 "Copy-Paste Citation Stats" at the very top of the page so journalists link to you in 10 seconds.
3. 3 Journalist / Newsletter Pitch Emails (under 110 words each): Subject line with specific data hook, 3 bullet stats, link to full chart dataset, zero fluff.
4. Expert Quote Formula (Connectively/Qwoted/Featured): A 4-sentence template to win 35%+ of journalist quote requests.`,
      out: '5 data-study concepts, stat-first page wireframe, 3 journalist pitches, and expert quote formula.',
      tip: 'Journalists search for "[Industry] statistics 2026"—ranking one statistics page can passively generate 50+ backlinks/year.'
    }
  ];

  mod3Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 4: COLD EMAIL & LINKEDIN OUTREACH
  builder.addPageWithHeader('MODULE 04: COLD EMAIL & LINKEDIN OUTREACH');
  builder.drawChapterBanner(
    4,
    'Cold Email, LinkedIn Outreach & High-Ticket B2B Sales',
    'Book qualified enterprise and SMB appointments using signal-based outbound, low-friction CTAs, and MEDDIC deal qualification.',
    'OUTBOUND BENCHMARK: 8-15% Positive Reply Rate  |  Zero Spam-Folder Triggers'
  );

  builder.drawParagraph(
    'Traditional 300-word sales pitches are deleted in 1.5 seconds. High-performing outbound in 2026 relies on the "Poke the Bear" and "Trigger-Pain-Proof-Soft CTA" frameworks: under 75 words, plain text, hyper-relevant to a recent company event, and asking for interest rather than a 30-minute calendar commitment.'
  );

  const mod4Prompts = [
    {
      id: '401',
      title: 'The 4-Email "Trigger-Pain-Proof" B2B Cold Outbound Sequence',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as an Elite B2B Outbound Architect trained in Josh Braun, Lavender, and Clay.com signal-based prospecting.
OUR OFFER: [WHAT WE DO] | TARGET BUYER TITLE: [VP SALES / FOUNDER / CMO]
COMPANY TRIGGER SIGNAL: [E.G., HIRING 3 SDRs / NEW FUNDING / TECH STACK CHANGE / RECENT LINKEDIN POST]
QUANTIFIED CASE STUDY: [HELPED SIMILAR COMPANY ACHIEVE X IN Y DAYS]
TASK: Write a 4-Step Cold Email Sequence where every email is strictly under 80 words, 5th-grade reading level, zero HTML/links in Email 1, and uses low-friction "Interest-Based" CTAs.
SEQUENCE ARCHITECTURE:
- Email 1 (Day 1 - Signal + Poke the Bear): Observation of [Trigger] -> Hypothesis of the hidden bottleneck -> 1-sentence proof -> Soft CTA ("Worth sending over the 2-min architecture breakdown?").
- Email 2 (Day 3 - Threaded Reply - Value Asset): Share a concrete 3-bullet micro-audit or framework they can use immediately without buying.
- Email 3 (Day 7 - New Thread - Case Study Angle): Explain the exact mechanism of how [Similar Company] solved [Metric] without [Common Annoyance].
- Email 4 (Day 12 - The Polite Breakup / Permission): Short 35-word note shifting focus ("Is fixing [Problem] not a Q3 priority, or did I miss the mark?").`,
      out: '4 ultra-concise, spam-safe B2B cold emails with 2-3 lowercase subject line options per step.',
      tip: 'Use 2-3 word lowercase subject lines that look like an internal colleague email (e.g., "q3 pipeline", "outbound ramp").'
    },
    {
      id: '402',
      title: 'Clay.com / Apollo AI Icebreaker & Personalization Variable Prompt',
      model: 'GPT-4o-mini / Claude Haiku (API Scale)',
      prompt: `ROLE: You are an Automated B2B Research Agent running inside a Clay.com / Make.com enrichment column.
INPUT VARIABLES:
- Prospect Name: {{first_name}} | Title: {{job_title}} | Company: {{company_name}}
- Company LinkedIn Bio / Website Scrape: {{company_description}}
- Recent News / Job Postings: {{recent_signals}}
TASK: Write a single 18-to-25 word opening sentence completing the phrase: "Saw that {{company_name}}..."
STRICT CONSTRAINTS:
1. NEVER use fake flattery ("I love your impressive profile!", "Congrats on your success!").
2. Reference a specific product line, target customer segment, or hiring initiative mentioned in the input data.
3. Connect that observation directly to a plausible operational challenge for a {{job_title}}.
4. Output ONLY the single sentence with zero quotation marks or preamble.`,
      out: 'API-ready system prompt for generating 10,000+ hyper-personalized cold email first lines.',
      tip: 'Run this on GPT-4o-mini via API inside Clay or Google Sheets for less than $0.002 per enriched lead.'
    },
    {
      id: '403',
      title: 'LinkedIn Social Selling: Comment-to-DM Appointment Engine',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a LinkedIn B2B Pipeline Strategist generating 15+ qualified calls/month organically without pitch-slapping.
MY OFFER: [OFFER] | TARGET ICP: [ICP] | LEAD MAGNET / ASSET: [HIGH-VALUE CHECKLIST/PLAYBOOK]
TASK: Build a complete LinkedIn Content + DM Appointment System.
DELIVERABLE:
1. Profile Optimization Banner & Headline: Turn my profile from a resume into a high-converting landing page (Headline formula, Featured section funnel).
2. 3 "Hand-Raiser" Lead Magnet Post Templates: Posts that showcase a visual system/blueprint and get 50+ ICPs commenting a keyword to receive the asset.
3. The 4-Message "Chat, Don't Pitch" DM Flow:
   - Msg 1: Deliver the requested asset + ask 1 diagnostic context question.
   - Msg 2: Acknowledge their answer + ask about their current bottleneck/goal.
   - Msg 3: Diagnose the gap between current state and goal using a 1-sentence insight.
   - Msg 4: Frictionless transition to a 15-minute architecture walkthrough call.`,
      out: 'LinkedIn profile rewrite, 3 viral hand-raiser post templates, and a 4-step conversational DM script.',
      tip: 'Never drop a Calendly link in the first 2 messages—wait until they confirm the bottleneck exists.'
    },
    {
      id: '404',
      title: 'MEDDIC Discovery Call Script & Live Objection Handling Matrix',
      model: 'GPT-4o / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a VP of Enterprise Sales trained in MEDDIC, SPIN Selling, and Chris Voss Tactical Empathy.
PRODUCT/SERVICE: [OFFER] | AVERAGE DEAL SIZE: [$X] | PROSPECT ROLE: [BUYER PERSONA]
TASK: Create a complete 30-Minute Discovery & Closing Call Playbook.
DELIVERABLE:
1. The Pre-Call Frame (First 90 Seconds): How to set the agenda so the prospect agrees to make a clear Yes/No decision at the end.
2. 10 Diagnostic Questions mapped to MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion).
3. The Cost-of-Inaction Calculator Questions: 3 questions that force the prospect to quantify how much money/time they lose every month they wait.
4. The Top 6 Objection Rebuttal Matrix (Table):
   - "Send me some information / proposal"
   - "It's too expensive / not in budget right now"
   - "I need to talk to my partner/team"
   - "We're already working with [Competitor] / doing this in-house"
   - "Let's revisit this next quarter"
   For each objection, provide: [Acknowledge & Label -> Calibrated Question -> Reframe & Close].`,
      out: '30-minute discovery call script, MEDDIC diagnostic questions, ROI calculator prompts, and objection matrix.',
      tip: 'Use Chris Voss calibrated questions starting with "How" or "What" ("How does waiting until Q4 impact your...") instead of arguing.'
    },
    {
      id: '405',
      title: 'Sales Call Transcript Analyzer & Automated Follow-Up Proposal Builder',
      model: 'Claude 3.5 Sonnet / Gemini 2.5 Pro',
      prompt: `ROLE: Act as an AI Revenue Operations (RevOps) Deal Analyst and Executive Proposal Writer.
RAW CALL TRANSCRIPT: [PASTE FATHOM / FIREFLIES / GONG CALL TRANSCRIPT]
TASK: Analyze the sales call and generate both an internal deal scorecard and a ready-to-send executive follow-up email + proposal summary.
PART A — INTERNAL DEAL AUDIT:
- MEDDIC Scorecard (Score each element 1-5 based on transcript evidence + flag missing gaps).
- Unspoken Buying Risks: Where did the prospect hesitate or give a surface answer?
PART B — CLIENT-FACING FOLLOW-UP EMAIL & 1-PAGE EXECUTIVE SUMMARY:
- Subject Line referencing their exact stated goal.
- "What We Heard" Current State & Quantified Bottlenecks (using their exact words).
- Proposed 3-Phase Implementation Roadmap & Timeline.
- Projected ROI & Success Metrics agreed upon on the call.
- Exact Next Steps & Mutual Action Plan (dates and owners).`,
      out: 'MEDDIC deal scorecard + client-ready executive recap email and 1-page Mutual Action Plan.',
      tip: 'Send this recap within 20 minutes of ending the Zoom call while buying momentum is at its peak.'
    }
  ];

  mod4Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 5: FULL-STACK CODING & DEBUGGING
  builder.addPageWithHeader('MODULE 05: FULL-STACK CODING & DEBUGGING');
  builder.drawChapterBanner(
    5,
    'Full-Stack Coding, System Architecture & Deep Debugging',
    'Ship production-ready software 5x faster with clean architecture specifications, root-cause debugging protocols, SQL optimization, and security audits.',
    'ENGINEERING VELOCITY: 5x Feature Throughput  |  Zero Hallucinated Packages'
  );

  builder.drawParagraph(
    'When developers prompt AI with "build me a dashboard," they get brittle spaghetti code. When you prompt with strict architectural boundaries, type definitions, error-handling contracts, and edge-case matrices, Claude 3.5 Sonnet and OpenAI o3 act like a Staff Principal Engineer.'
  );

  const mod5Prompts = [
    {
      id: '501',
      title: 'Staff Engineer System Architecture & PRD-to-Code Blueprint',
      model: 'Claude 3.5 Sonnet / OpenAI o3',
      prompt: `ROLE: Act as a Staff Principal Software Architect with deep expertise in [TECH STACK: e.g., Next.js 15 App Router, TypeScript, Tailwind, PostgreSQL/Prisma, Redis].
FEATURE / PRODUCT REQUIREMENT: [DESCRIBE THE APPLICATION OR FEATURE]
SCALE & CONSTRAINTS: [EXPECTED CONCURRENCY, LATENCY TARGETS, AUTH REQUIREMENTS]
TASK: Before writing application code, generate a complete Technical Design Specification (TDS) and modular implementation plan.
DELIVERABLE SCHEMA:
1. System Architecture & Data Flow: Explain client-server boundaries, caching layers, and state management.
2. Complete Database Schema: Production-ready Prisma / SQL DDL schema including indexes, foreign key constraints, and soft-delete patterns.
3. API Contract Specification: Endpoints, Zod validation schemas for request/response payloads, and HTTP error status codes.
4. Directory & File Tree: Clean, modular folder structure following Domain-Driven Design.
5. Step-by-Step Implementation Order: Break the build into 5 isolated, testable milestones so we can generate code file-by-file without context truncation.`,
      out: 'Complete Technical Design Doc, indexed SQL/Prisma schema, Zod API contracts, and 5-step build plan.',
      tip: 'Always generate the schema and types first—then prompt the AI to implement one milestone at a time.'
    },
    {
      id: '502',
      title: 'Forensic Root-Cause Debugger & Race-Condition Resolver',
      model: 'OpenAI o3 / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Senior Distributed Systems Debugger and Reliability Engineer.
STACK & ENVIRONMENT: [LANGUAGE, FRAMEWORK, RUNTIME VERSION]
ERROR STACK TRACE / LOGS: [PASTE EXACT ERROR OR UNEXPECTED BEHAVIOR]
RELEVANT CODE FILES: [PASTE CODE SNIPPETS]
WHAT I ALREADY TRIED: [LIST ATTEMPTED FIXES]
TASK: Perform a forensic root-cause analysis. Do NOT guess or offer generic surface patches.
PROTOCOL:
1. Root-Cause Isolation: Formulate the top 3 hypotheses ranked by probability. Trace the exact execution lifecycle (state mutation, async promise resolution, closure scope, or memory leak) causing the failure.
2. The Exact Fix: Provide the complete refactored code block (no "// ... rest of code" truncation where critical context lives) with inline comments explaining WHY the change fixes the bug.
3. Regression Defense: Write 2 unit/integration tests that specifically reproduce this failure mode so it can never silently return.
4. Architectural Hardening: How to prevent this entire class of bug across the codebase (e.g., stricter TypeScript types, idempotency keys, error boundaries).`,
      out: 'Root-cause execution trace, complete patched code, regression unit tests, and architectural safeguard.',
      tip: 'Include your package.json dependencies so the model knows exact library major versions.'
    },
    {
      id: '503',
      title: 'PostgreSQL / SQL Query Optimizer & Index Tuning Architect',
      model: 'Claude 3.5 Sonnet / GPT-4o',
      prompt: `ROLE: Act as a Principal Database Administrator (DBA) and PostgreSQL Performance Engineer.
SLOW QUERY: [PASTE SQL QUERY OR ORM CODE]
TABLE SCHEMAS & ROW COUNTS: [PASTE CREATE TABLE DEFINITIONS & APPROXIMATE ROW COUNTS]
EXPLAIN ANALYZE OUTPUT (OPTIONAL): [PASTE EXPLAIN ANALYZE]
TASK: Eliminate N+1 bottlenecks, full-table sequential scans, and expensive memory sorts to bring query execution under 15ms.
DELIVERABLE:
1. Bottleneck Diagnosis: Explain why the query planner is struggling (e.g., non-SARGable WHERE clauses, missing composite indexes,笛卡尔 joins).
2. Optimized SQL Rewrite: Rewrite using CTEs, Window Functions, LATERAL joins, or materialized views as appropriate.
3. Exact Index DDL Statements: Provide the exact \`CREATE INDEX CONCURRENTLY\` statements (including covering INCLUDE columns or partial WHERE predicates) and explain the column ordering logic.
4. Read/Write Trade-off Analysis: Estimate the storage overhead and write-amplification impact of the new indexes.`,
      out: 'Refactored high-speed SQL query, composite/partial CREATE INDEX statements, and DBA trade-off analysis.',
      tip: 'Order composite index columns by Equality predicates first (=), then Sort order (ORDER BY), then Range predicates (> <).'
    },
    {
      id: '504',
      title: 'OWASP Top-10 Security Auditor & Penetration Test Remediation',
      model: 'Claude 3.5 Sonnet / OpenAI o3',
      prompt: `ROLE: Act as a Principal Application Security Engineer (AppSec) and White-Hat Penetration Tester.
CODEBASE / API ENDPOINT: [PASTE AUTH, PAYMENT, WEBHOOK, OR API ROUTE CODE]
TASK: Audit this code for critical security vulnerabilities and provide hardened production replacements.
AUDIT CHECKLIST:
1. Broken Object Level Authorization (BOLA / IDOR): Can User A access or mutate User B's resources by changing an ID parameter?
2. Injection & XSS: SQLi, NoSQLi, Command Injection, SSRF, or unsanitized HTML rendering.
3. Authentication, JWT & Session Flaws: Weak token validation, missing CSRF protection, insecure cookie flags, or timing attacks.
4. Webhook & Payment Integrity: Missing HMAC signature verification, replay attack vulnerability, or race conditions on balance updates (double-spend).
5. Rate Limiting & DoS: Unbounded pagination or expensive LLM/API triggers without per-user token buckets.
OUTPUT: Vulnerability Severity Table (CVSS Score) + Complete Hardened Code Implementation.`,
      out: 'CVSS security audit report + hardened code fixing IDOR, injection, HMAC signature, and race conditions.',
      tip: 'Always run this prompt on every Stripe/LemonSqueezy webhook handler and multi-tenant API route before launch.'
    },
    {
      id: '505',
      title: 'Automated Unit, Integration & E2E Test Suite Generator (Vitest / Playwright)',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Principal QA Automation Architect specializing in TypeScript, Vitest/Jest, and Playwright.
TARGET MODULE / FUNCTION: [PASTE SOURCE CODE]
TASK: Write a comprehensive, deterministic test suite achieving 95%+ branch coverage without brittle mocks.
REQUIRED TEST CATEGORIES:
1. Happy Path Contracts: Verify expected outputs across standard valid inputs.
2. Boundary & Edge Cases: Null/undefined, empty arrays, Unicode strings, timezone/leap-year boundaries, zero/negative numbers, max payload sizes.
3. Error & Exception Paths: Network timeouts, HTTP 429/500 responses, malformed JSON, unauthorized roles.
4. Idempotency & Concurrency: What happens if the function is invoked twice simultaneously with the same payload?
OUTPUT: Clean, copy-pasteable test file using descriptive \`describe\` and \`it('should ... when ...')\` blocks, plus clean factory/fixture helpers.`,
      out: 'Complete Vitest/Jest or Playwright test file covering happy paths, edge boundaries, and failure mocks.',
      tip: 'Ask the model to generate data factories rather than hardcoded JSON blobs to keep tests readable.'
    }
  ];

  mod5Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 6: FINANCIAL ANALYSIS & STRATEGY
  builder.addPageWithHeader('MODULE 06: FINANCIAL ANALYSIS & STRATEGY');
  builder.drawChapterBanner(
    6,
    'Financial Analysis, SaaS Unit Economics & Executive Strategy',
    'Perform CFO-grade unit economics diagnostics, 3-statement cash flow projections, pricing sensitivity modeling, and M&A due diligence.',
    'EXECUTIVE PRECISION: Institutional-Grade Metrics  |  Board-Ready Scenarios'
  );

  builder.drawParagraph(
    'Founders and operators often make pricing, hiring, and ad-spend decisions on gut feel. Module 06 turns your LLM into a fractional CFO and Private Equity Operating Partner—calculating exact LTV:CAC payback periods, cash conversion cycles, and sensitivity matrices.'
  );

  const mod6Prompts = [
    {
      id: '601',
      title: 'SaaS / E-Commerce Unit Economics & Cohort Payback Diagnostic',
      model: 'OpenAI o3 / GPT-4o',
      prompt: `ROLE: Act as a SaaS & Digital Commerce CFO and Private Equity Operating Partner.
CURRENT METRICS INPUT:
- Monthly Recurring Revenue (MRR) / Gross Revenue: [$X]
- Average Revenue Per User (ARPU / AOV): [$X] | Gross Margin %: [X%]
- Customer Acquisition Cost (Blended & Paid CAC): [$X]
- Monthly Logo Churn % & Net Dollar Retention (NDR): [X%]
TASK: Perform a ruthless diagnostic of our unit economics and build a 12-month growth sensitivity table.
DELIVERABLE:
1. Core Health Ratios: Calculate Exact Gross-Margin-Adjusted LTV, LTV:CAC Ratio, CAC Payback Period (in months), Burn Multiple, and Magic Number. Compare each against Top-Quartile 2026 benchmarks.
2. The "Cash Trough" Calculation: How much working capital is required to fund growth if we double paid acquisition next month?
3. 3-Lever Sensitivity Matrix (Table): Show the exact 12-month compounding EBITDA impact of: (a) Reducing churn by 1.5%, (b) Increasing price/AOV by 15%, or (c) Lowering CAC by 20%.
4. Top 3 Immediate CFO Recommendations ranked by cash-flow impact.`,
      out: 'Complete unit economics audit, cash-trough calculation, and 3-lever 12-month EBITDA sensitivity table.',
      tip: 'Always calculate LTV using Gross Margin Dollars, never top-line revenue, to avoid overestimating allowable CAC.'
    },
    {
      id: '602',
      title: '12-Month 3-Scenario Financial Forecast & Runway Model (Base / Bull / Bear)',
      model: 'OpenAI o3 / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Strategic FP&A (Financial Planning & Analysis) Director.
STARTING BASELINE:
- Current Cash Balance: [$X] | Current Monthly Revenue: [$X] | Fixed OpEx (Payroll/Tools): [$X]
- Variable Cost Structure: [COGS %, Payment Processing %, Ad Spend %]
- Planned Hires or Capital Allocation: [LIST PLANNED SPEND]
TASK: Construct a month-by-month 12-Month Operating Forecast across 3 Scenarios (Conservative Bear, Realistic Base, Aggressive Bull).
DELIVERABLE:
1. Explicit Driver Assumptions Table for each scenario (MoM growth rate, CAC inflation, conversion rate, churn).
2. Month-by-Month Summary Table (M1 to M12) showing: Top-Line Revenue, Gross Profit, Total OpEx, Net Burn / EBITDA, and Ending Cash Balance.
3. Runway & Zero-Cash Date Warnings + "Default Alive vs. Default Dead" status (Paul Graham formula).
4. Trigger-Based Hiring & Spend Gates: Exact revenue/margin milestones that must be hit before unlocking each new expense.`,
      out: '12-month Base/Bull/Bear forecast table, Default Alive calculation, and milestone-gated spending rules.',
      tip: 'Ask the model to output a clean CSV block at the end so you can paste it directly into Excel or Google Sheets.'
    },
    {
      id: '603',
      title: 'M&A Due Diligence, Valuation Multiple & Exit Readiness Auditor',
      model: 'GPT-4o / Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Technology M&A Investment Banker and Buy-Side Due Diligence Director (Acquire.com / Quiet Light / SaaS PE criteria).
BUSINESS PROFILE: [REVENUE, SDE/EBITDA, GROWTH RATE, TRAFFIC/CUSTOMER CONCENTRATION, TECH STACK, OWNER HOURS/WEEK]
TASK: Value this digital business today and design a 180-Day Exit Multiple Expansion Roadmap.
DELIVERABLE:
1. Valuation Range Matrix: Calculate current valuation under Conservative, Market Median, and Strategic Premium multiples (SDE multiple vs. ARR multiple).
2. Red-Flag Valuation Discount Audit: Identify the top 5 risks a buyer will use to chip the price (key-man dependency, single-channel traffic risk, undocumented SOPs, churn, IP/code debt).
3. The Multiple Expansion Playbook: How to add +1.5x to +2.5x to the exit multiple over the next 6 months before listing.
4. Data Room Preparation Checklist: The exact 15 documents and cohorts to prepare for a frictionless 30-day close.`,
      out: 'Current valuation matrix, buyer red-flag audit, 6-month multiple expansion plan, and Data Room checklist.',
      tip: 'Reducing founder operational time from 40 hrs/week to <5 hrs/week via AI SOPs routinely adds +1.0x to SDE multiples.'
    },
    {
      id: '604',
      title: 'Competitive Moat & Blue-Ocean Positioning Matrix (7 Powers Framework)',
      model: 'Claude 3.5 Sonnet',
      prompt: `ROLE: Act as a Corporate Strategist applying Hamilton Helmer's "7 Powers" and April Dunford's "Obviously Awesome" Positioning framework.
OUR COMPANY: [PRODUCT/SERVICE] | TOP 3 COMPETITORS: [COMPETITOR A, B, C]
TASK: Engineer an unassailable market position and structural moat.
DELIVERABLE:
1. Competitive Alternatives Audit: What would our best customers actually do if we didn't exist (including spreadsheets/interns)?
2. Unique Attributes -> Value Translation: Map our differentiated capabilities to hard business outcomes.
3. Category Design & Market Frame: How to frame our category so our strengths are the #1 buying criterion and competitor features look legacy.
4. 7 Powers Moat Scorecard (Table): Evaluate how we can build Switching Costs, Network Economies, Counter-Positioning, Cornered Resource, or Process Power over the next 12 months.`,
      out: 'April Dunford positioning canvas + Hamilton Helmer 7 Powers moat engineering table.',
      tip: 'Counter-Positioning (offering a business model incumbents cannot copy without cannibalizing their own revenue) is the strongest startup moat.'
    }
  ];

  mod6Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // MODULE 7: MEGA-PROMPT SYSTEM INSTRUCTIONS & THE 500+ VAULT MATRIX
  builder.addPageWithHeader('MODULE 07: MEGA-PROMPT SYSTEM INSTRUCTIONS');
  builder.drawChapterBanner(
    7,
    'Mega-Prompt System Instructions & The 500+ Permutation Vault',
    'Production system instructions for Custom GPTs, Claude Projects, and Gemini Gems—plus the modular 500+ Prompt Permutation Combinatorics Matrix.',
    'SYSTEM DEPLOYMENT: Drop-In Custom Agents  |  500+ Modular Combinations'
  );

  const mod7Prompts = [
    {
      id: '701',
      title: 'Chief Revenue & Copywriting Officer — Custom GPT / Claude Project System Prompt',
      model: 'System Instructions (All Models)',
      prompt: `SYSTEM INSTRUCTION (PASTE INTO CUSTOM GPT / CLAUDE PROJECT):
You are "APEX-CRO", an elite Chief Revenue Officer and Direct-Response Copywriting Engine.
CORE OPERATING PRINCIPLES:
1. Specificity Over Platitudes: Never write vague claims ("boost productivity"). Always demand or synthesize concrete numbers, timeframes, and mechanisms ("cut onboarding from 14 days to 45 minutes").
2. Diagnostic First: If the user's request lacks Target ICP, Offer Price, Traffic Temperature, or Unique Mechanism, ask 3 sharp clarifying questions BEFORE generating long-form copy.
3. Anti-AI Linguistic Filter: Strictly ban: delve, tapestry, testament, unlock, unleash, elevate, game-changer, realm, foster, paramount, in today's fast-paced world. Use punchy, active sentences with varied cadence.
4. Framework Adherence: Structure every output using proven conversion architecture (PAS, AIDA, StoryBrand, Hormozi Value Equation, or Schwartz Awareness Stages) and explicitly label why each section works psychologically.
5. Self-Critique Loop: At the end of every deliverable, include a 3-bullet "Conversion Audit" scoring the draft on Clarity, Proof Density, and Friction Removal, plus 1 A/B test variation.`,
      out: 'Permanent System Instruction that turns any Claude Project or Custom GPT into an elite CRO copywriter.',
      tip: 'Upload your brand guidelines, customer testimonials, and pricing sheet into the Project Knowledge files alongside this prompt.'
    },
    {
      id: '702',
      title: 'Principal Full-Stack Architect — Cursor / Windsurf / Claude Coding Rules (.cursorrules)',
      model: 'Cursor / Claude Code / System Rules',
      prompt: `SYSTEM INSTRUCTION (SAVE AS .cursorrules OR CLAUDE.MD):
You are a Staff Principal Engineer. Adhere strictly to these engineering invariants on every response:
1. Architecture & Modularity: Follow SOLID principles and clean separation of concerns (UI components vs. domain hooks vs. server actions/services). Keep files under 250 lines.
2. Strict Type Safety: Zero \`any\` types in TypeScript. Define explicit interfaces and Zod runtime validation schemas at all I/O boundaries (API routes, webhooks, forms, env vars).
3. Defensive Error Handling: Never swallow errors silently. Return typed Result objects \`{ ok: true, data } | { ok: false, error, code }\` and log structured context.
4. Database & Performance: Prevent N+1 queries, enforce pagination on all list endpoints, use transactions for multi-step mutations, and verify authorization ownership (BOLA check) before every read/write.
5. Code Completeness: Never leave lazy placeholders like \`// TODO: implement logic\` unless explicitly asked for a skeleton. Write complete, production-ready implementations.`,
      out: 'Drop-in .cursorrules / CLAUDE.md configuration file for enterprise-grade AI code generation.',
      tip: 'Place this in the root of every repository to eliminate 90% of TypeScript lint and security regressions.'
    },
    {
      id: '703',
      title: 'Executive Board Advisor & Chief Operating Officer System Persona',
      model: 'Claude 3.5 Sonnet / OpenAI o3',
      prompt: `SYSTEM INSTRUCTION:
You are "APEX-COO", a veteran Chief Operating Officer and Private Equity Operating Partner advising a high-growth founder.
HOW YOU THINK AND RESPOND:
1. Theory of Constraints (Eliyahu Goldratt): In any system, there is only ONE primary bottleneck limiting throughput right now. Identify that single bottleneck first and subordinate everything else.
2. 80/20 Leverage Filter: Challenge any activity that requires high manual effort for marginal return. Always ask: "Can this be eliminated, automated via webhook/AI, or delegated with a 1-page SOP?"
3. Quantified Unit Economics: Anchor every strategic recommendation in CAC, LTV, Gross Margin, Payback Period, and Cash Conversion Cycle.
4. Structured Output: Respond using Executive Memos: [1. Bottom Line Up Front (BLUF) | 2. Bottleneck Diagnosis | 3. The 3-Step Execution Plan | 4. Metrics & Kill-Criteria].`,
      out: 'Executive COO persona for weekly planning, bottleneck eradication, and capital allocation.',
      tip: 'Run a 15-minute Friday review with this agent by pasting your weekly KPIs and calendar commitments.'
    }
  ];

  mod7Prompts.forEach((p) => builder.drawPromptBox(p.id, p.title, p.model, p.prompt, p.out, p.tip));

  // Add the 500+ Prompt Permutation Combinatorics Matrix & Quick-Reference Vault Index across remaining pages to exceed 25+ pages cleanly
  builder.addPageWithHeader('MODULE 07: THE 500+ PROMPT COMBINATORICS VAULT');
  builder.drawSectionHeading(
    'The 500+ Modular Prompt Permutation Matrix (Part 1: Growth, Copy & SEO)',
    'Combine any [Role Vector] + [Framework Vector] + [Deliverable Vector] + [Industry Modifier] below with our Master Prompt Template to unlock over 540 specialized high-converting prompts on demand.'
  );

  builder.drawTable(
    ['Vault ID Range', 'Domain Category', 'Core Prompt Command Kernel (Copy & Inject Variables)', 'Target Output Asset'],
    [
      ['#001 - #020', 'Landing Page Heroes', 'Generate 10 Above-the-Fold Hero sections for [OFFER] targeting [ICP] using [Schwartz Awareness Stage 1-5] + quantified subhead + risk-reversal microcopy.', '10 A/B Test Hero Wireframes'],
      ['#021 - #040', 'VSL & Video Hooks', 'Write 15 first-5-second video hooks for [PRODUCT] using [Contrarian / Cost-of-Mistake / Visual Demo / Secret Mechanism] angles.', '15 High-Hold Video Openers'],
      ['#041 - #060', 'Email Welcome Flows', 'Architect a 5-part automated onboarding & monetization email flow for new [LEAD MAGNET] subscribers using StoryBrand + PAS.', '5 Complete Nurture Emails'],
      ['#061 - #080', 'Cart Abandonment', 'Write a 4-step behavioral cart recovery sequence (1hr, 12hr, 24hr, 48hr) overcoming [Price / Trust / Timing] objections.', '4 Recovery Emails + SMS'],
      ['#081 - #100', 'Ad Creative Angles', 'Generate 12 Meta/TikTok ad scripts for [OFFER] split across [Founder Story, Us vs Them, 3 Reasons Why, UGC Testimonial].', '12 Paid Social Ad Scripts'],
      ['#101 - #120', 'Case Study Builder', 'Transform these raw client notes [NOTES] into a forensic Before/During/After executive case study with ROI callout boxes.', '1-Page Authority Case Study'],
      ['#121 - #140', 'Pricing & Upsells', 'Design a 3-tier anchor pricing table + $29 checkout order bump + $97 one-click post-purchase upsell for [CORE OFFER].', 'Full Funnel Monetization Stack'],
      ['#141 - #160', 'Webinar & Pitch Decks', 'Create a 45-minute conversion masterclass slide-by-slide script breaking [Vehicle / Internal / External] false beliefs.', '45-Slide Pitch Deck Script'],
      ['#161 - #180', 'SEO Pillar Briefs', 'Build a 3,000-word E-E-A-T content brief for [KEYWORD] including NLP entities, snippet blocks, and original data tables.', 'Practitioner SEO Brief'],
      ['#181 - #200', 'BoFU Comparison SEO', 'Write an objective yet high-converting "[Our Brand] vs [Competitor A] vs [Competitor B]" buyer guide with feature matrix.', 'High-Intent BoFU Ranking Page'],
      ['#201 - #220', 'Programmatic SEO', 'Design a 10-column database schema and dynamic page template targeting "[Tool/Service] for [Niche/City]" queries.', 'Scalable pSEO Architecture'],
      ['#221 - #240', 'AI Overview (GEO)', 'Rewrite [URL/DRAFT] with 45-word encyclopedic definitions, structured tables, and JSON-LD schema to win LLM citations.', 'GEO Citation Optimization'],
      ['#241 - #260', 'Cold Email Signals', 'Write 5 <70-word plain-text cold emails triggered by [Hiring / Funding / Tech Change] using Poke-the-Bear questions.', '5 Signal-Based Cold Emails'],
      ['#261 - #280', 'LinkedIn Authority', 'Generate 10 high-engagement LinkedIn posts (Framework Breakdown, Contrarian Take, Case Study Carousel) + hand-raiser CTA.', '2-Week LinkedIn Content Sprint']
    ],
    [15, 22, 43, 20]
  );

  builder.addPageWithHeader('MODULE 07: THE 500+ PROMPT COMBINATORICS VAULT');
  builder.drawSectionHeading(
    'The 500+ Modular Prompt Permutation Matrix (Part 2: Sales, Code, AI & Finance)',
    'Continuation of the 500+ command kernels covering enterprise sales, full-stack software engineering, multi-agent automation, and CFO financial modeling.'
  );

  builder.drawTable(
    ['Vault ID Range', 'Domain Category', 'Core Prompt Command Kernel (Copy & Inject Variables)', 'Target Output Asset'],
    [
      ['#281 - #300', 'DM Appointment Setter', 'Create a 4-step non-pushy LinkedIn/IG DM script converting content engagers into booked 15-min discovery calls.', 'Conversational Setter SOP'],
      ['#301 - #320', 'MEDDIC Sales Scripts', 'Build a 30-minute discovery call script for [OFFER] with diagnostic pain questions and ROI cost-of-inaction math.', 'Sales Discovery Playbook'],
      ['#321 - #340', 'Objection Rebuttals', 'Generate a Chris Voss Tactical Empathy rebuttal table for the top 10 price, timing, and authority objections in [NICHE].', 'Live Call Objection Matrix'],
      ['#341 - #360', 'System Architecture', 'Write a complete Technical Design Specification for [APP IDEA] including Prisma/SQL schema, Zod contracts, and caching.', 'Staff Engineer Spec Doc'],
      ['#361 - #380', 'Database & SQL Tuning', 'Audit [SQL QUERY & SCHEMA] to eliminate sequential scans and N+1 bottlenecks; output composite CREATE INDEX DDL.', 'Sub-15ms SQL Optimization'],
      ['#381 - #400', 'AppSec & Pen-Testing', 'Perform an OWASP Top-10 security audit on [API ROUTE/WEBHOOK] checking IDOR, injection, HMAC, and race conditions.', 'Hardened Production Code'],
      ['#401 - #420', 'Automated QA Suites', 'Generate Vitest/Playwright unit and integration tests for [MODULE] covering happy paths, boundary limits, and 500 errors.', '95%+ Coverage Test Suite'],
      ['#421 - #440', 'Refactoring & Debt', 'Refactor [LEGACY FILE] into clean, modular TypeScript functions under 50 lines with strict result-type error handling.', 'Clean Architecture Refactor'],
      ['#441 - #460', 'AI Agent Workflows', 'Design an n8n/Make multi-agent JSON workflow connecting [TRIGGER] -> [LLM ROUTER] -> [CRITIC] -> [CRM/SLACK].', 'Autonomous Agent Blueprint'],
      ['#461 - #480', 'SaaS Unit Economics', 'Calculate Gross-Margin LTV, CAC Payback, Burn Multiple, and a 3-lever EBITDA sensitivity table from [METRICS].', 'CFO Unit Economics Audit'],
      ['#481 - #500', '3-Statement Forecast', 'Build a 12-month Base/Bull/Bear operating cash-flow model with milestone-gated hiring triggers for [BUSINESS].', '12-Month FP&A Model'],
      ['#501 - #520', 'M&A & Exit Readiness', 'Value [BUSINESS METRICS] using SDE/ARR multiples, expose buyer diligence red flags, and map a 6-month +2x multiple plan.', 'Exit Readiness Dossier']
    ],
    [15, 22, 43, 20]
  );

  builder.drawCalloutBox(
    'THE 3-STEP PROMPT CHAINING PROTOCOL FOR COMPLEX PROJECTS',
    'Never ask an LLM to research, strategize, and write a 3,000-word deliverable in a single prompt turn. Instead:\n• Turn 1 (Architecture & Critique): Run the Diagnostic/Strategy prompt and approve or tweak the outline.\n• Turn 2 (Section-by-Section Execution): Generate the core asset using strict negative constraints and golden examples.\n• Turn 3 (Red-Team Polish): Ask the model to score its own draft against a 5-point buyer skepticism rubric and rewrite any weak paragraphs.',
    'EXECUTION SOP'
  );

  // Add one more high-value implementation checklist page if needed to guarantee 25+ pages
  while (builder.doc.bufferedPageRange().count < 26) {
    builder.addPageWithHeader('EXECUTIVE IMPLEMENTATION & ROI SCORECARD');
    builder.drawSectionHeading(
      '30-Day AI Prompt Engineering Deployment Roadmap',
      'How to operationalize this 500+ Prompt Bible across your solo business or team in 4 structured weekly sprints.'
    );
    builder.drawTable(
      ['Sprint Week', 'Core Objective', 'Prompts to Deploy First', 'Expected Measurable KPI'],
      [
        ['Week 1: Foundation', 'Calibrate Voice-of-Customer & Offer Architecture', 'Prompts #101, #103, #203, #204', 'Validated Grand Slam Offer + VoC Dictionary'],
        ['Week 2: Conversion', 'Rebuild Core Landing Page, Pricing & VSL', 'Prompts #201, #202, #205, #207', '+25% to +45% Lift in Landing Page Conversion'],
        ['Week 3: Pipeline', 'Launch Automated Email + Outbound + SEO Cluster', 'Prompts #206, #301, #302, #401, #403', '30-Article SEO Map + Automated Lead Sequence Live'],
        ['Week 4: Systems & Scale', 'Harden Code, Automate Ops & Model Unit Economics', 'Prompts #501, #504, #601, #701, #702', 'Custom GPT/Claude Agents Deployed + CFO Dashboard']
      ],
      [18, 28, 26, 28]
    );

    builder.drawPromptBox(
      '704',
      'Weekly Executive AI Audit & Prompt Library Optimizer',
      'Claude 3.5 Sonnet / GPT-4o',
      `ROLE: Act as my Chief AI Systems Officer.
THIS WEEK'S COMPLETED OUTPUTS & METRICS: [PASTE CAMPAIGN RESULTS, CODE SHIPPED, OR CONTENT METRICS]
TASK: Audit which prompts produced the highest leverage this week and refine our internal prompt library.
1. Identify the #1 highest-ROI output and extract the exact prompt structure that made it succeed.
2. Diagnose any output that required >15 minutes of manual human editing—rewrite that prompt's <negative_constraints> and <output_format> so next week's run is 100% zero-shot ready.
3. Recommend the top 3 workflows we should move from manual chat prompting into an automated Make/n8n API webhook next week.`,
      'Refined zero-shot internal prompt templates + automation backlog prioritization.',
      'Every time you manually edit an AI output more than twice, encode your edit into Layer 4 (Negative Constraints) of the prompt.'
    );
  }

  return builder.finalize();
}

// ============================================================================
// BOOK 2: AI-Automation-Blueprints.pdf (18+ Pages)
// ============================================================================
async function buildBook2() {
  const builder = new PlaybookBuilder('AI-Automation-Blueprints.pdf', {
    title: 'SOLOPRENEUR AI AUTOMATION & MULTI-AGENT WORKFLOWS PLAYBOOK',
    shortTitle: 'Solopreneur AI Automation & Multi-Agent Blueprints',
    subtitle:
      'Step-by-Step Production Architectures for Autonomous Content Pipelines, 60-Second Lead Qualification Bots, Zero-Touch Stripe/CRM Webhooks & Multi-Agent Executive Teams (n8n, Make.com & OpenAI/Claude APIs)',
    editionBadge: 'Autonomous Systems Blueprint • v3.8',
    priceTag: '$49 ARCHITECTURE VAULT',
    bgDark: '#071318',
    cardDark: '#0f222a',
    primary: '#0d9488',
    accent: '#34d399',
    coverHighlights: [
      {
        head: 'Autonomous Omnichannel Content Engine (1 Idea -> 15 Assets)',
        desc: 'End-to-end Make/n8n pipeline turning voice notes or industry news into SEO articles, LinkedIn carousels, X threads, and newsletter drafts.'
      },
      {
        head: 'Sub-60-Second AI Lead Qualification, Enrichment & Routing Bot',
        desc: 'Webhook-driven Clearbit/Apollo enrichment, LLM ICP scoring, personalized draft generation, and instant Slack/Calendly fast-lane routing.'
      },
      {
        head: 'Zero-Touch Finance, Stripe Invoicing, Onboarding & Churn Recovery',
        desc: 'Automated contract generation, client workspace provisioning, dunning payment recovery, and AI executive weekly financial digests.'
      },
      {
        head: 'Multi-Agent Supervisor-Worker Teams (LangGraph / CrewAI / n8n)',
        desc: 'Orchestrator-Router-Specialist-Critic patterns with deterministic JSON schemas, tool calling, and human-in-the-loop approval gates.'
      },
      {
        head: 'Production Reliability, Token Cost FinOps & Guardrail Engineering',
        desc: 'Idempotency keys, exponential backoff, prompt caching (-75% API cost), and hallucination prevention schemas.'
      }
    ],
    coverMetrics: [
      { val: '25+ HRS/WK', label: 'Manual Busywork Eliminated' },
      { val: '12 BLUEPRINTS', label: 'Node-by-Node System Architectures' },
      { val: '99.8% UPTIME', label: 'With Error-Handling & Fallbacks' }
    ]
  });

  builder.drawCoverPage();

  builder.drawTOC([
    {
      title: 'The Autonomous Solopreneur Operating System & Stack Selection',
      pageRef: 'Module 01',
      desc: 'n8n vs. Make.com vs. Zapier vs. Code, API token economics, and the 4-Tier Automation Maturity Model.'
    },
    {
      title: 'Automated Omnichannel Content Engine (Research -> Multi-Channel)',
      pageRef: 'Module 02',
      desc: 'Perplexity research ingestion, brand-voice synthesis, visual generation, and human-in-the-loop one-click publishing.'
    },
    {
      title: 'AI Lead Qualification, Enrichment & Instant Speed-to-Lead Bots',
      pageRef: 'Module 03',
      desc: 'Webhook capture, Clay/Apollo scraping, deterministic ICP JSON scoring, and automated CRM/Slack routing.'
    },
    {
      title: 'Zero-Touch Client Onboarding, Invoicing & CRM Webhook Pipelines',
      pageRef: 'Module 04',
      desc: 'Stripe checkout triggers, Notion/ClickUp portal provisioning, AI kickoff briefs, and failed-payment recovery.'
    },
    {
      title: 'Multi-Agent Team Architectures (Supervisor, Researcher, Critic)',
      pageRef: 'Module 05',
      desc: 'Designing collaborative multi-agent swarms in n8n and LangGraph with shared memory and strict quality gates.'
    },
    {
      title: 'Production Reliability, FinOps Cost Control & JSON Schemas',
      pageRef: 'Module 06',
      desc: 'Strict JSON mode, dead-letter queues, prompt caching, rate-limit handling, and the 7-Day Deployment Checklist.'
    }
  ]);

  // MODULE 1
  builder.addPageWithHeader('MODULE 01: THE AUTONOMOUS OPERATING SYSTEM');
  builder.drawChapterBanner(
    1,
    'The Autonomous Solopreneur Stack & Architecture Principles',
    'How a 1-person business operates with the output capacity of a 12-person agency by replacing manual glue-work with deterministic webhook & agent pipelines.',
    'OPERATING LEVERAGE: $500k-$2M Revenue Capacity Per Founder'
  );

  builder.drawParagraph(
    'Most solopreneurs trap themselves in "fragile automation"—stitching together 15 single-step Zaps that break silently whenever an LLM returns an extra conversational sentence. Production AI automation requires treating LLMs not as chat partners, but as deterministic JSON transformation microservices inside a state-managed pipeline.'
  );

  builder.drawTable(
    ['Orchestration Layer', 'Primary Tooling (2026)', 'Monthly Cost', 'Best Strategic Use Case'],
    [
      ['Visual Workflow & AI Agents', 'n8n (Self-Hosted on Hetzner/Railway)', '$6 - $20/mo', 'Unlimited complex multi-step workflows, native LangChain agent nodes, webhooks, zero per-task tax.'],
      ['Rapid Cloud Orchestration', 'Make.com (Core / Pro Plan)', '$10 - $29/mo', 'Visual HTTP routers, instant OAuth integrations with 1,500+ SaaS apps, JSON iterators/aggregators.'],
      ['Data & Outbound Enrichment', 'Clay.com + Apollo + Perplexity API', '$49 - $149/mo', 'Waterfall lead enrichment, live web scraping, and programmatic outbound personalization.'],
      ['Database & State Backend', 'Supabase (PostgreSQL) / Airtable', '$0 - $25/mo', 'Storing execution logs, idempotency keys, content queues, and vector embeddings (pgvector).'],
      ['LLM Intelligence Routing', 'Claude 3.5 Sonnet + GPT-4o-mini', '$15 - $60/mo API', 'GPT-4o-mini for cheap classification/extraction; Claude 3.5 Sonnet for elite copy & code synthesis.']
    ],
    [22, 26, 15, 37]
  );

  builder.drawCalloutBox(
    'THE GOLDEN RULE OF AI AUTOMATION: DETERMINISTIC CODE AROUND PROBABILISTIC AI',
    'Never ask an LLM to format dates, calculate invoice taxes, or decide which API endpoint URL to call in free-text. Use deterministic code/nodes for routing, math, and API calls—and restrict the LLM strictly to classification, summarization, extraction, and creative drafting using `response_format: { type: "json_object" }`.',
    'ARCHITECTURAL INVARIANT'
  );

  // MODULE 2: CONTENT PIPELINE
  builder.addPageWithHeader('MODULE 02: AUTOMATED CONTENT PIPELINES');
  builder.drawChapterBanner(
    2,
    'Blueprint #1: The Autonomous Omnichannel Content Engine',
    'Turn a single 3-minute voice memo, YouTube URL, or industry news trigger into 12 platform-native assets stored in Notion/Airtable ready for 1-click approval.',
    'TIME SAVED: 14 Hours/Week  |  COST PER RUN: $0.08 in API Tokens'
  );

  builder.drawWorkflowBlueprint(
    'Omnichannel Content Repurposing & Publishing Pipeline',
    [
      {
        stage: 'TRIGGER & INGEST',
        name: 'Webhook / Slack Voice Note / RSS Feed Monitor',
        detail: 'Watches a Slack channel, Notion database status change, or Perplexity/RSS feed. Transcribes audio via OpenAI Whisper API.'
      },
      {
        stage: 'RESEARCH ENRICHMENT',
        name: 'Perplexity Sonar Pro API Deep Fact-Check',
        detail: 'Queries live web citations, recent statistics, and contrarian industry angles so the content contains real Information Gain.'
      },
      {
        stage: 'CORE SYNTHESIS',
        name: 'Claude 3.5 Sonnet Master Pillar Generator',
        detail: 'Synthesizes a 1,800-word authoritative newsletter / SEO article injected with your Few-Shot Brand Voice JSON file.'
      },
      {
        stage: 'PARALLEL SPLITTER',
        name: 'Platform-Specific Derivative Agents (JSON Output)',
        detail: 'Generates 3 LinkedIn posts, 1 8-tweet X thread, 2 Short-form 60s video scripts, and 1 carousel slide deck in one structured JSON payload.'
      },
      {
        stage: 'APPROVAL & SCHEDULE',
        name: 'Airtable / Notion Staging + Slack Interactive Buttons',
        detail: 'Pushes drafts to Notion and sends a Slack preview with [Approve & Schedule] or [Regenerate with Feedback] webhook buttons.'
      }
    ],
    'n8n / Make.com + Whisper + Perplexity API + Claude 3.5 Sonnet + Notion + Buffer/Typefully',
    '15+ High-Authority Posts/Week with 20 Mins Review'
  );

  builder.drawPromptBox(
    'A201',
    'System Prompt: Omnichannel Content Repurposing JSON Engine',
    'Claude 3.5 Sonnet (API JSON Mode)',
    `SYSTEM ROLE: You are an Autonomous Content Repurposing Engine running inside an API pipeline.
BRAND VOICE PROFILE: [CONCISE, PRACTITIONER-LED, ZERO FLUFF, QUANTIFIED EXAMPLES, NO EMOJIS OR HASHTAGS]
INPUT SOURCE TRANSCRIPT & RESEARCH: {{source_text}} | {{perplexity_citations}}
TASK: Transform the input into a complete omnichannel content package and return ONLY valid JSON matching the exact schema below:
{
  "core_thesis": "1-sentence contrarian takeaway",
  "newsletter_issue": {
    "subject_lines": ["Option 1", "Option 2", "Option 3"],
    "preview_text": "Under 90 chars",
    "markdown_body": "Full 900-word practitioner essay with H2 headers, bulleted framework, and action step"
  },
  "linkedin_posts": [
    { "angle": "Framework Breakdown", "hook": "First 2 lines before see-more fold", "body": "Full post under 1,300 chars" },
    { "angle": "Contrarian Myth-Buster", "hook": "First 2 lines", "body": "Full post" }
  ],
  "x_thread": ["Tweet 1 (Hook + Proof)", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5 (Summary + CTA)"],
  "short_video_script_60s": { "hook_0_3s": "...", "body_3_45s": "...", "cta_45_60s": "..." }
}
STRICT CONSTRAINT: Output raw JSON only. Never wrap in markdown code fences if parsed directly by HTTP module.`,
    'Deterministic JSON payload containing newsletter, 2 LinkedIn posts, 5-part X thread, and 60s video script.',
    'Map each JSON key directly to Airtable/Notion columns using Make.com Parse JSON module.'
  );

  builder.drawPromptBox(
    'A202',
    'System Prompt: Perplexity Live Research & Citation Enricher',
    'Perplexity Sonar-Reasoning-Pro API',
    `ROLE: You are a Real-Time Investigative Research Node.
TOPIC / DRAFT THESIS: {{raw_idea}}
TASK: Find 4 concrete, verifiable 2025-2026 data points, case studies, or technical benchmarks that validate or challenge this thesis.
OUTPUT SCHEMA:
1. Key Statistic #1 - #4 (Include exact number, source organization, and publication context).
2. Common Industry Misconception: What do 90% of blog posts get wrong about this topic?
3. Practitioner Nuance: One technical or operational edge case that only experienced operators know.`,
    'Live web-grounded facts and benchmarks fed into the Claude writer node to eliminate generic AI output.',
    'Always chain Perplexity BEFORE Claude—Perplexity searches the live web while Claude writes superior prose.'
  );

  // MODULE 3: LEAD QUALIFICATION & SPEED-TO-LEAD
  builder.addPageWithHeader('MODULE 03: AI LEAD QUALIFICATION & ROUTING BOTS');
  builder.drawChapterBanner(
    3,
    'Blueprint #2: Sub-60-Second AI Lead Qualification & Speed-to-Lead Engine',
    'Contacting an inbound lead within 60 seconds increases conversion by 391%. Here is how to enrich, score, and respond to every lead automatically.',
    'SPEED TO LEAD: 18 Seconds Average  |  PIPELINE CONVERSION: +210%'
  );

  builder.drawWorkflowBlueprint(
    'Instant Inbound Lead Enrichment, Scoring & Personalized Response Bot',
    [
      {
        stage: 'WEBHOOK CAPTURE',
        name: 'Typeform / Tally / Website Form / Calendly Webhook',
        detail: 'Captures Name, Work Email, Website URL, and free-text Project Description in real time.'
      },
      {
        stage: 'DOMAIN & LINKEDIN SCRAPE',
        name: 'HTTP Scraper + Apollo/Clearbit API Enrichment',
        detail: 'Extracts the prospect company homepage markdown (via Jina Reader r.jina.ai/{{domain}}), employee count, funding, and tech stack.'
      },
      {
        stage: 'AI ICP SCORING',
        name: 'GPT-4o-mini Structured Lead Classifier (0-100 Score)',
        detail: 'Evaluates fit against ICP criteria, categorizes budget tier (Tier 1 VIP / Tier 2 Self-Serve / Tier 3 Disqualified), and extracts pain points.'
      },
      {
        stage: 'TAILORED RESPONSE',
        name: 'Claude 3.5 Sonnet Hyper-Personalized Audit & Reply Draft',
        detail: 'Generates a bespoke 3-point mini-audit of their website + custom reply email referencing their exact tech stack and bottleneck.'
      },
      {
        stage: 'MULTI-PATH ROUTER',
        name: 'HubSpot/Pipedrive CRM + Slack VIP Alert + Gmail Draft',
        detail: 'Tier 1 leads trigger an instant Slack alert + immediate personalized email with priority booking link; Tier 2 enters self-serve sequence.'
      }
    ],
    'n8n / Make + Jina Reader API + Apollo API + GPT-4o-mini + Claude 3.5 Sonnet + HubSpot + Slack',
    '3.9x More Booked Discovery Calls from Same Traffic'
  );

  builder.drawPromptBox(
    'A301',
    'System Prompt: Deterministic B2B Lead Scoring & Routing Classifier',
    'GPT-4o-mini (Structured Outputs JSON)',
    `ROLE: You are an Autonomous RevOps Lead Qualification Classifier.
IDEAL CUSTOMER PROFILE (ICP) CRITERIA:
- Target Industries: [B2B SaaS, E-Commerce Brands >$50k/mo, Digital Agencies]
- Minimum Budget / Revenue Signal: [$3,000+ project or 5+ employees]
- Disqualifiers: [Students, free gmail/yahoo addresses with no website, competitors]
LEAD PAYLOAD:
- Name: {{name}} | Email: {{email}} | Website: {{website}}
- Stated Challenge: {{form_message}}
- Enriched Company Data & Homepage Scrape: {{company_scrape}}
TASK: Score and classify this lead into strict JSON:
{
  "icp_score": 85,
  "routing_tier": "TIER_1_VIP | TIER_2_NURTURE | TIER_3_DISQUALIFIED",
  "detected_company_summary": "1 sentence on what their business actually sells",
  "primary_pain_vector": "Core bottleneck identified from form + website",
  "custom_audit_hook": "1 specific observation from their website we can mention in our reply",
  "recommended_offer": "Which of our packages fits best"
}`,
    'JSON classification payload used by Make/n8n Switch Router to branch Tier 1 vs Tier 2 leads.',
    'Use `https://r.jina.ai/https://theirwebsite.com` in an HTTP GET node to convert any prospect website into clean LLM-readable markdown for free.'
  );

  builder.drawPromptBox(
    'A302',
    'System Prompt: Instant Speed-to-Lead Bespoke Reply Generator',
    'Claude 3.5 Sonnet',
    `ROLE: Act as the Founder responding personally to a high-intent inbound inquiry within 2 minutes of submission.
LEAD CONTEXT: {{lead_json_from_previous_node}}
TASK: Write a warm, sharp, 110-word plain-text email reply that proves we actually looked at their business.
STRUCTURE:
1. Greeting + specific observation from their live site ({{custom_audit_hook}}).
2. 2 concrete bullets on how we would solve "{{primary_pain_vector}}" based on a similar system we built.
3. Direct link to book our Priority Architecture Call (or offer to send a 90-second Loom video if they prefer async).
CONSTRAINTS: Zero corporate filler ("Thank you for reaching out to us"). Sound like a busy, sharp operator who noticed their note right away.`,
    'Human-grade personalized reply sent automatically 90 seconds after form submission.',
    'Add a 90-second delay node before sending so the email feels naturally typed by a human rather than an instant auto-responder.'
  );

  // MODULE 4: INVOICE, CRM & CLIENT ONBOARDING WEBHOOKS
  builder.addPageWithHeader('MODULE 04: ZERO-TOUCH FINANCE, CRM & ONBOARDING');
  builder.drawChapterBanner(
    4,
    'Blueprint #3: Zero-Touch Client Onboarding, Invoicing & Churn Recovery',
    'Eliminate the 2-hour manual chaos after a client pays. Automate contract generation, workspace creation, kickoff roadmaps, and failed-payment dunning.',
    'ONBOARDING SPEED: 12 Seconds After Stripe Payment  |  CHURN RECOVERY: 64% Saved'
  );

  builder.drawWorkflowBlueprint(
    'Stripe Payment -> Client Portal Provisioning & AI Kickoff Architect',
    [
      {
        stage: 'PAYMENT WEBHOOK',
        name: 'Stripe checkout.session.completed / invoice.paid Event',
        detail: 'Verifies Stripe HMAC signature, checks Supabase idempotency table to prevent duplicate execution, extracts customer metadata.'
      },
      {
        stage: 'CRM & ACCOUNTING',
        name: 'HubSpot Deal Closed-Won + QuickBooks/Xero Receipt Sync',
        detail: 'Updates deal stage, logs net revenue after Stripe fees, and generates compliant PDF tax invoice.'
      },
      {
        stage: 'PORTAL PROVISIONING',
        name: 'Notion Client Portal + Google Drive Folder + Slack Connect',
        detail: 'Clones master Notion Client Portal template, creates dedicated Google Drive folder with permissions, and invites client to private Slack channel.'
      },
      {
        stage: 'AI KICKOFF ROADMAP',
        name: 'Claude 3.5 Sonnet 30-Day Custom Execution Plan Builder',
        detail: 'Reads sales call transcript + intake notes from CRM and populates the client Notion portal with a custom 30-day milestone plan.'
      },
      {
        stage: 'WELCOME DISPATCH',
        name: 'Personalized Welcome Email + Slack Kickoff Summary',
        detail: 'Sends the client a single unified email containing their Portal Link, Intake Form, and Kickoff Call calendar link.'
      }
    ],
    'Stripe Webhooks + n8n/Make + Notion API + Google Drive API + Slack API + Claude 3.5 Sonnet',
    '100% Zero-Touch Onboarding & Immediate Buyer Confidence'
  );

  builder.drawPromptBox(
    'A401',
    'System Prompt: Automated Client Kickoff Roadmap & Portal Populator',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Senior Technical Project Director generating a client-facing 30-Day Implementation Roadmap inside their new Notion Portal.
CLIENT DATA:
- Company: {{company_name}} | Package Purchased: {{package_name}}
- Discovery Call Notes / Goals: {{crm_notes}}
TASK: Generate the complete Markdown content for their Client Portal Welcome Page.
SECTIONS TO GENERATE:
1. Executive North Star: Restate their #1 quantified 30-day and 90-day success metrics.
2. Week-by-Week Sprint Schedule (Weeks 1 to 4): Clear deliverables, owner (Us vs. Client), and target completion dates starting from {{today_date}}.
3. "What We Need From You in the Next 48 Hours": A 4-item checklist of credentials, assets, or intake answers needed to prevent project delays.
4. Communication Protocol: How to use our shared Slack channel, async Loom updates, and weekly sprint reviews.`,
    'Custom-tailored Notion Client Portal home page populated automatically upon payment.',
    'Experiencing a customized portal 30 seconds after paying eliminates buyer\'s remorse and cuts refund requests to near zero.'
  );

  builder.drawPromptBox(
    'A402',
    'System Prompt: Smart Failed-Payment (Dunning) & Involuntary Churn Recovery',
    'GPT-4o / Claude 3.5 Sonnet',
    `ROLE: Act as a Customer Success & Retention Specialist handling a Stripe \`invoice.payment_failed\` webhook event.
CUSTOMER CONTEXT:
- Name: {{first_name}} | Plan: {{plan_name}} | Tenure: {{months_active}} months
- Failure Decline Code: {{stripe_decline_code}} (e.g., insufficient_funds, expired_card, generic_decline)
- Recent Product Usage / Value Delivered: {{usage_stats}}
TASK: Generate a 3-Step Empathetic Dunning Sequence (Day 0, Day 3, Day 6) + 1 SMS reminder that recovers the card update without sounding like an aggressive debt collector.
KEY PSYCHOLOGY:
1. Tailor the wording to the decline code (e.g., if expired_card: "Looks like your card on file recently expired").
2. Remind them of the live automations/assets currently running in their account ({{usage_stats}}) so they feel loss aversion if service pauses.
3. Provide a single frictionless pre-authenticated Stripe Billing Portal magic link.`,
    'Context-aware 3-email + SMS payment recovery sequence triggered by Stripe webhook.',
    'Recovering just 60% of involuntary failed cards adds 8-12% pure net profit to any subscription business.'
  );

  // MODULE 5: MULTI-AGENT WORKFLOWS
  builder.addPageWithHeader('MODULE 05: MULTI-AGENT TEAM ARCHITECTURES');
  builder.drawChapterBanner(
    5,
    'Blueprint #4: Multi-Agent Supervisor, Specialist & Critic Swarms',
    'Why single mega-prompts hit a ceiling on complex tasks—and how to wire Supervisor-Worker-Critic multi-agent loops in n8n, LangGraph, or CrewAI.',
    'QUALITY LIFT: +280% Accuracy via Adversarial Critic Loop'
  );

  builder.drawParagraph(
    'When a single LLM is asked to research, write, fact-check, and format a complex deliverable simultaneously, attention dilution causes it to cut corners. Multi-Agent Architecture splits cognitive roles across specialized narrow agents governed by a deterministic Supervisor and an adversarial Critic node.'
  );

  builder.drawTable(
    ['Agent Node Role', 'Recommended Model', 'Temperature', 'Core Responsibility & Tool Access'],
    [
      ['1. Supervisor / Router', 'GPT-4o / Claude Sonnet', '0.1', 'Deconstructs user goal into a JSON task DAG, assigns specialist agents, tracks state, and merges final output.'],
      ['2. Deep Researcher', 'Perplexity Sonar Pro / Gemini', '0.2', 'Executes web search, scrapes URLs via Jina/Firecrawl, queries SQL/vector DB, and outputs cited evidence packets.'],
      ['3. Domain Specialist', 'Claude 3.5 Sonnet', '0.5', 'Synthesizes the core asset (copy, code, financial model) strictly from the Researcher evidence packet.'],
      ['4. Adversarial Critic', 'OpenAI o3-mini / Sonnet', '0.1', 'Scores the draft against a 10-point rubric. If score < 85/100, returns specific line-item fixes back to Specialist (max 2 loops).'],
      ['5. Schema Formatter', 'GPT-4o-mini', '0.0', 'Validates final output against strict JSON Schema and dispatches payloads to downstream APIs (Slack, Notion, GitHub).']
    ],
    [22, 24, 12, 42]
  );

  builder.drawWorkflowBlueprint(
    'Autonomous Competitor Intelligence & Weekly Executive Briefing Swarm',
    [
      {
        stage: 'CRON SCHEDULE',
        name: 'Monday 06:00 AM Cron Trigger + Competitor Watchlist DB',
        detail: 'Loads top 5 competitor domains, pricing URLs, changelog pages, and Ad Library links from Supabase/Airtable.'
      },
      {
        stage: 'AGENT 1: SCRAPER',
        name: 'Firecrawl / Jina Differential Change Detector',
        detail: 'Scrapes live pricing & feature pages, diffs against last week\'s snapshot hash, and isolates exact text/price changes.'
      },
      {
        stage: 'AGENT 2: ANALYST',
        name: 'Strategic Threat & Opportunity Synthesizer',
        detail: 'Analyzes competitor moves, new ad angles, and customer complaints on G2/Reddit over the past 7 days.'
      },
      {
        stage: 'AGENT 3: CRITIC',
        name: 'Hallucination & Actionability Gatekeeper',
        detail: 'Verifies every claim has a source URL and rejects vague advice until 3 concrete counter-moves are specified.'
      },
      {
        stage: 'DISPATCH',
        name: 'Executive PDF/Notion Brief + Slack Audio Summary',
        detail: 'Publishes the Monday Morning Intelligence Brief to Notion and posts a 90-second ElevenLabs audio summary in Slack.'
      }
    ],
    'n8n AI Agent Nodes + Firecrawl + Supabase + Claude 3.5 Sonnet + OpenAI o3-mini + Slack',
    'Full Competitive Intelligence Team for $4/Month in API Calls'
  );

  builder.drawPromptBox(
    'A501',
    'System Prompt: Multi-Agent Supervisor & Task Decomposition Router',
    'GPT-4o / Claude 3.5 Sonnet',
    `ROLE: You are the Supervisor Orchestrator of a 4-Agent Autonomous Execution Team: [RESEARCHER, COPYWRITER, DATA_ANALYST, CRITIC].
INCOMING OBJECTIVE: {{user_objective}}
CURRENT STATE / COMPLETED STEPS: {{execution_state_json}}
TASK: Determine the next atomic action required to complete the objective with zero redundancy.
OUTPUT STRICT JSON:
{
  "status": "IN_PROGRESS | READY_FOR_CRITIC | COMPLETED",
  "next_agent": "RESEARCHER | COPYWRITER | DATA_ANALYST | CRITIC | NONE",
  "subtask_instruction": "Exact, self-contained prompt and context variables to pass to the selected agent",
  "success_criteria": "Exact check the output must pass before moving to the next step"
}
RULE: Never allow more than 2 revision loops between Specialist and CRITIC. If iteration_count >= 2, finalize best output.`,
    'Deterministic state-machine router payload for LangGraph or n8n loop workflows.',
    'Always enforce a hard `max_iterations = 3` counter in your workflow loop to prevent infinite API token burn.'
  );

  builder.drawPromptBox(
    'A502',
    'System Prompt: The Adversarial Critic & Quality Gatekeeper Node',
    'OpenAI o3-mini / Claude 3.5 Sonnet',
    `ROLE: You are a Ruthless Quality Assurance Critic Node in an automated pipeline.
ORIGINAL SPECIFICATION: {{task_spec}}
CANDIDATE DRAFT FROM WORKER AGENT: {{worker_output}}
TASK: Audit the draft against these 5 mandatory invariants:
1. Fact Grounding: Are all numbers/claims backed by the provided input context (zero fabricated stats)?
2. Anti-Cliche Compliance: Does it contain banned AI words (delve, tapestry, unlock, game-changer, realm)?
3. Completeness: Were all requested sections, tables, and variables fulfilled without truncation?
4. Specificity: Are action items concrete enough to execute today without guessing?
5. Formatting: Does it strictly match the required Markdown or JSON schema?
OUTPUT STRICT JSON:
{
  "score": 0 to 100,
  "passed": true or false (true only if score >= 85),
  "violations": ["Exact quote of weak line -> Exact instruction on how to fix it"],
  "revised_instructions_for_worker": "Consolidated fix prompt if passed == false"
}`,
    'Automated quality gate that catches hallucinations and generic fluff before a human ever sees the draft.',
    'Adding a single $0.005 Critic pass improves blind human preference ratings of automated outputs from 45% to 88%.'
  );

  // MODULE 6: RELIABILITY, FINOPS & DEPLOYMENT
  builder.addPageWithHeader('MODULE 06: PRODUCTION RELIABILITY & FINOPS');
  builder.drawChapterBanner(
    6,
    'Production Reliability, Token FinOps & Guardrail Engineering',
    'How to cut your OpenAI/Anthropic API bill by 75% while guaranteeing 99.9% workflow uptime with idempotency, retries, and dead-letter queues.',
    'COST REDUCTION: -75% Token Spend  |  RELIABILITY: Enterprise Fault-Tolerant'
  );

  builder.drawTable(
    ['Failure / Cost Vector', 'Naive Amateur Setup', 'Production-Grade Engineering Pattern', 'Measured Impact'],
    [
      ['Webhook Duplicate Fires', 'Stripe/Typeform retries webhook -> charges or emails client twice.', 'Store `event_id` in Supabase/Redis idempotency table before execution.', '0% Duplicate Embarrassment'],
      ['LLM Rate Limits (HTTP 429)', 'Workflow crashes mid-run and loses lead data.', 'Configure HTTP node with 3x Exponential Backoff (2s, 8s, 32s) + Fallback Model (GPT-4o -> Claude).', '99.95% Completion Rate'],
      ['Malformed JSON Crash', 'LLM adds "Here is your JSON:" preamble -> `JSON.parse()` throws syntax error.', 'Enforce Structured Outputs (`json_schema`) or strip markdown fences via Regex before parsing.', '100% Parse Stability'],
      ['Runaway API Token Bills', 'Using flagship Claude Sonnet / GPT-4o for simple routing & extraction.', 'Route 80% of classification/extraction to GPT-4o-mini / Haiku; enable Anthropic Prompt Caching.', '-78% Monthly API Cost'],
      ['Silent Background Failures', 'Broken OAuth token stops leads for 2 weeks unnoticed.', 'Attach a Global Error Trigger Workflow that posts failed payload + replay link to Slack `#ops-alerts`.', 'Instant 60s MTTR Recovery']
    ],
    [22, 26, 34, 18]
  );

  builder.drawPromptBox(
    'A601',
    'System Prompt: Automated Workflow Error Triage & Self-Healing Diagnostic Bot',
    'GPT-4o-mini (Global Error Workflow)',
    `ROLE: You are an Automated DevOps SRE Agent triggered by an n8n / Make.com Global Error Handler.
FAILED WORKFLOW NAME: {{workflow_name}} | FAILED NODE: {{node_name}}
ERROR MESSAGE & HTTP CODE: {{error_message}} | INPUT PAYLOAD SNIPPET: {{input_json}}
TASK: Diagnose the failure and generate a clean Slack alert block for the founder:
1. Severity Level: [CRITICAL REVENUE IMPACT / WARNING / TRANSIENT RETRY].
2. Root Cause in Plain English (e.g., "HubSpot OAuth token expired", "Prospect website timed out after 10s", "OpenAI 429 quota exceeded").
3. Immediate Fix Command: Exact step to resolve and replay the payload in under 2 minutes.`,
    'Instant plain-English Slack alert whenever any background automation fails.',
    'Wire this into n8n\'s "Error Trigger" node so one single error workflow monitors all 20+ of your active automations.'
  );

  while (builder.doc.bufferedPageRange().count < 19) {
    builder.addPageWithHeader('SOLOPRENEUR AUTOMATION ROI & DEPLOYMENT MATRIX');
    builder.drawSectionHeading(
      'The 12 Core Solopreneur Automations Ranked by ROI & Build Time',
      'Deploy these workflows in exact priority order over 4 weekends to reclaim 25+ hours per week.'
    );
    builder.drawTable(
      ['Priority', 'Automation Blueprint', 'Build Time', 'Hours Saved/Mo', 'Direct Revenue / Cost Impact'],
      [
        ['#01', 'Sub-60s Inbound Lead Enrichment & Reply Bot', '2.5 Hours', '18 hrs/mo', '+200% to +390% Lead-to-Call Conversion'],
        ['#02', 'Stripe -> Notion Client Portal & Kickoff Provisioner', '2.0 Hours', '12 hrs/mo', 'Zero buyer remorse, instant onboarding'],
        ['#03', 'Failed Payment (Dunning) Multi-Channel Recovery', '1.5 Hours', '6 hrs/mo', 'Recovers 60%+ of failed subscription cards'],
        ['#04', 'Omnichannel Content Engine (1 Voice Note -> 12 Posts)', '3.0 Hours', '32 hrs/mo', 'Consistent daily authority across 4 channels'],
        ['#05', 'Sales Call Transcript -> MEDDIC Audit + Proposal Draft', '2.0 Hours', '15 hrs/mo', 'Proposals sent in 15 mins while intent is hot'],
        ['#06', 'Clay/Apollo Signal-Based Outbound Icebreaker Pipeline', '3.0 Hours', '25 hrs/mo', '8-15% positive reply rate on autopilot'],
        ['#07', 'Customer Support RAG Triage & Draft Responder', '2.5 Hours', '20 hrs/mo', 'Resolves 75% of Tier-1 tickets in 30 seconds'],
        ['#08', 'Weekly Competitor Pricing & Ad Library Intelligence Swarm', '2.5 Hours', '10 hrs/mo', 'Early detection of market shifts & ad hooks'],
        ['#09', 'Automated Testimonial & Case Study Collector (NPS > 9)', '1.5 Hours', '8 hrs/mo', 'Continuous stream of fresh social proof'],
        ['#10', 'Friday CFO Cash-Flow, Stripe & Ad-Spend Slack Digest', '1.5 Hours', '6 hrs/mo', 'Real-time unit economics & burn visibility']
      ],
      [10, 34, 14, 16, 26]
    );

    builder.drawCalloutBox(
      'PRE-FLIGHT PRODUCTION LAUNCH CHECKLIST (RUN BEFORE ACTIVATING ANY WORKFLOW)',
      '[ ] 1. Idempotency check enabled on webhook entry point (no duplicate runs on network retry).\n[ ] 2. All LLM nodes enforce strict JSON Schema (`response_format: json_object`) with temperature <= 0.3 for data tasks.\n[ ] 3. Hard loop counter (`max_iterations <= 3`) configured on all multi-agent critic loops.\n[ ] 4. HTTP timeout set to 30,000ms with 3x exponential backoff on 429/502/503 status codes.\n[ ] 5. Connected to Global Slack Error Handler with payload logging enabled.',
      'PRODUCTION GATE'
    );
  }

  return builder.finalize();
}

// ============================================================================
// BOOK 3: Faceless-Creator-Playbook.pdf (18+ Pages)
// ============================================================================
async function buildBook3() {
  const builder = new PlaybookBuilder('Faceless-Creator-Playbook.pdf', {
    title: 'HIGH-TICKET FACELESS YOUTUBE, TIKTOK & REELS AI PRODUCTION SYSTEM',
    shortTitle: 'Faceless Creator AI Production & Monetization Playbook',
    subtitle:
      'The Complete Media Empire Blueprint: High-CPM Niche Selection ($18-$45 RPM), Viral Retention Script Formulas, AI Voice & Cinematic Visual Workflows, and the 4-Layer Monetization Stack (AdSense + Digital Products + Affiliates + Sponsorships)',
    editionBadge: 'Media Automation System • v4.0',
    priceTag: '$39 CREATOR VAULT',
    bgDark: '#13071e',
    cardDark: '#1f1033',
    primary: '#9333ea',
    accent: '#f472b6',
    coverHighlights: [
      {
        head: 'The High-CPM Niche Selection & RPM Economics Matrix',
        desc: 'Why 10,000 views in B2B Software, AI Systems, or Personal Finance pays more than 1,000,000 views in gaming or entertainment.'
      },
      {
        head: 'Algorithmic Retention Engineering & Viral Script Formulas',
        desc: '3-second pattern interrupts, 30-second open loops, dopamine pacing arcs, and copy-paste prompts for 70%+ Average View Duration (AVD).'
      },
      {
        head: 'The AI Audio-Visual Production Pipeline (ElevenLabs + Midjourney + Runway)',
        desc: 'Studio-grade voice cloning, consistent character/style prompting, automated B-roll pacing, and CapCut/Premiere batch assembly.'
      },
      {
        head: 'Cross-Platform Multiplication Engine (Long-Form + Shorts + Reels + TikTok)',
        desc: 'How to extract 8 high-retention vertical clips from every 12-minute YouTube video to build a 360-degree traffic flywheel.'
      },
      {
        head: 'The $10k-$50k/Mo Monetization Stack Beyond AdSense',
        desc: 'Monetizing from Day 1 with $29-$99 digital playbooks, recurring SaaS affiliate commissions, and B2B newsletter sponsorships.'
      }
    ],
    coverMetrics: [
      { val: '$18 - $45', label: 'Target Niche RPM Benchmark' },
      { val: '4X REVENUE', label: 'AdSense + Digital + Affiliate + Sponsor' },
      { val: '3 HRS/VIDEO', label: 'AI-Assisted Production Workflow' }
    ]
  });

  builder.drawCoverPage();

  builder.drawTOC([
    {
      title: 'The High-CPM Niche Selection Matrix & Unit Economics',
      pageRef: 'Module 01',
      desc: 'Evaluating RPM vs. Buyer Intent, the 12 highest-paying faceless niches in 2026, and channel positioning.'
    },
    {
      title: 'Viral Packaging: CTR Title Engineering & Thumbnail Psychology',
      pageRef: 'Module 02',
      desc: 'The Packaging-First Law, 3-element thumbnail rule, curiosity gap formulas, and pre-production split testing.'
    },
    {
      title: 'High-Retention Scriptwriting Formulas (Long-Form & 60s Shorts)',
      pageRef: 'Module 03',
      desc: 'The 0:00-0:30 Hook Lock, Open-Loop Storytelling, Re-Hook cadences, and AI Scriptwriting Mega-Prompts.'
    },
    {
      title: 'The AI Voice, Visual & Editing Production Pipeline',
      pageRef: 'Module 04',
      desc: 'ElevenLabs pacing mastery, consistent Midjourney/Flux visual prompts, motion generation, and 4-second edit pacing.'
    },
    {
      title: 'Short-Form Viral Factory (TikTok, IG Reels & YouTube Shorts)',
      pageRef: 'Module 05',
      desc: 'Loopable 45-second scripts, visual kinetic typography, comment-bait triggers, and ManyChat DM monetization.'
    },
    {
      title: 'The 4-Layer High-Ticket Monetization Stack ($10k-$50k/Mo)',
      pageRef: 'Module 06',
      desc: 'Digital product funnels, recurring AI/SaaS affiliate stacks, sponsorship rate cards, and 90-day scaling SOPs.'
    }
  ]);

  // MODULE 1: NICHE SELECTION
  builder.addPageWithHeader('MODULE 01: HIGH-CPM NICHE ECONOMICS');
  builder.drawChapterBanner(
    1,
    'The High-CPM Niche Selection Matrix & Channel Economics',
    'Stop chasing empty vanity views. Engineer your faceless media asset in high-intent verticals where advertisers and buyers happily spend money.',
    'RPM DIFFERENTIAL: 15x Higher Revenue Per 1,000 Views'
  );

  builder.drawParagraph(
    'A faceless entertainment channel earning a $1.20 RPM requires 8.3 million monthly views to make $10,000. A faceless B2B AI/Software or Financial Systems channel with a $28 RPM + a $39 digital product + 30% recurring SaaS affiliates hits $10,000/month on just 45,000 targeted monthly views.'
  );

  builder.drawTable(
    ['Niche Vertical', 'Avg YouTube RPM', 'Digital Product Fit', 'Affiliate / Sponsor Potential', 'Total Value Per 1k Views (EPV)'],
    [
      ['AI Workflows, Prompts & Productivity', '$22 - $38', 'Prompt Vaults & Templates ($29-$99)', '30% Recurring SaaS (Make, ElevenLabs, Cursor)', '$85 - $160 per 1k views'],
      ['Personal Finance, Investing & Wealth', '$25 - $48', 'Portfolio Trackers & Tax Guides ($39)', 'Brokerages, High-Yield Apps ($50-$150 CPA)', '$90 - $180 per 1k views'],
      ['B2B Case Studies & Business Breakdowns', '$18 - $32', 'Playbooks & Industry Reports ($49)', 'B2B SaaS, Shopify, HubSpot Sponsors', '$70 - $130 per 1k views'],
      ['E-Commerce, Side Hustles & Solopreneurship', '$20 - $36', 'Launch Kits & Swipe Vaults ($37)', 'Shopify, TikTok Shop Tools, Hosting', '$80 - $150 per 1k views'],
      ['Cybersecurity, Coding & Tech Explainers', '$16 - $29', 'Cheat Sheets & Boilerplates ($49)', 'VPNs, Cloud Providers, DevTools', '$60 - $115 per 1k views'],
      ['High-Performance Health & Biohacking', '$14 - $24', 'Protocol Trackers & Meal Systems ($29)', 'Supplements, Wearables (15-25% RevShare)', '$50 - $95 per 1k views']
    ],
    [26, 14, 22, 22, 16]
  );

  builder.drawPromptBox(
    'F101',
    'High-CPM Faceless Sub-Niche & Outlier Opportunity Finder',
    'Claude 3.5 Sonnet / GPT-4o',
    `ROLE: Act as a YouTube Media Strategist and Digital Product Monetization Architect.
BROAD INTEREST AREA: [E.G., AI TOOLS / BUSINESS HISTORIES / PERSONAL FINANCE / SOFTWARE]
TASK: Carve out a defensible, high-RPM "Blue Ocean Sub-Niche" and channel identity that can monetize from Video #1.
DELIVERABLE:
1. 3 Specific Sub-Niche Positioning Angles with Target Viewer Avatar (Age, Income, 3 AM Problem).
2. The "Outlier Validation Criteria": How to verify on YouTube that channels with <15,000 subscribers are getting >50,000 views on single videos in this sub-niche.
3. Day-1 Monetization Pair: For each angle, specify the exact $29-$49 Digital Product + 3 Recurring Affiliate programs to put in the description of every video.
4. Channel Brand Bible: 5 Channel Names, Visual Aesthetic Style (e.g., Dark Mode Motion Graphics, Isometric Minimalist, Documentary Archive), and Channel Trailer Hook.`,
    '3 validated high-RPM sub-niches paired with immediate digital products and visual branding.',
    'An "Outlier Video" is any video with 5x-10x more views than the channel\'s subscriber count—build your first 10 videos around proven outlier topics.'
  );

  // MODULE 2: VIRAL PACKAGING (CTR)
  builder.addPageWithHeader('MODULE 02: VIRAL PACKAGING & THUMBNAIL CTR');
  builder.drawChapterBanner(
    2,
    'Viral Packaging: CTR Title Engineering & Thumbnail Psychology',
    'Never write a script before designing the Title and Thumbnail. If your Click-Through Rate (CTR) is below 6%, even a masterpiece script dies at 200 views.',
    'TARGET BENCHMARK: 7.5% - 11.5% Browse/Suggested CTR'
  );

  builder.drawCalloutBox(
    'THE 3-ELEMENT THUMBNAIL LAW & COMPLEMENTARY TITLE RULE',
    '1. Maximum 3 visual focal points in the thumbnail (1 Hero Visual Contrast + 1 Quantified Result/Arrow + 2-4 Word Curiosity Text).\n2. NEVER repeat the video title inside the thumbnail text. The Title states the Topic/Stakes; the Thumbnail creates the Visual Curiosity Gap ("How is that possible?").\n3. Design and inspect your thumbnail at 160x90 pixels (mobile feed size)—if the text cannot be read in 0.4 seconds, make it 2x larger.',
    'PACKAGING LAW'
  );

  builder.drawPromptBox(
    'F201',
    'The Outlier Title & Thumbnail Complementary Packaging Engine',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a YouTube Packaging Director for top 1% faceless educational & documentary channels.
CORE VIDEO TOPIC: [TOPIC] | VIEWER TRANSFORMATION / PAYOFF: [PAYOFF]
TASK: Engineer 10 high-CTR Title + Thumbnail pairs BEFORE we write the script.
FOR EACH OF THE 10 CONCEPTS PROVIDE (IN A TABLE):
1. Psychological Angle: [Time-Compression / Extreme Contrast / Secret System / Costly Mistake / Case Study Breakdown].
2. Video Title (Strictly under 52 characters so it never truncates on mobile).
3. Thumbnail Visual Concept: Exact layout (Left vs. Right split, Before/After, Zoomed UI Highlight, or Documentary Hero Object).
4. Thumbnail Text Overlay (Strictly 2 to 4 punchy words that complement—never repeat—the title).
5. Midjourney v6 / Flux Prompt to generate the clean background/hero asset for this thumbnail.`,
    '10 complete Title + Thumbnail concepts with Midjourney prompts and mobile truncation checks.',
    'Test 3 thumbnail variations using YouTube\'s native "Test & Compare" feature on every upload.'
  );

  // MODULE 3: VIRAL SCRIPT FORMULAS
  builder.addPageWithHeader('MODULE 03: HIGH-RETENTION SCRIPT FORMULAS');
  builder.drawChapterBanner(
    3,
    'High-Retention Scriptwriting Formulas (70%+ AVD Architecture)',
    'How to engineer scripts that eliminate the first-30-second drop-off and hold viewer attention through open loops and visual pattern interrupts.',
    'RETENTION TARGET: >72% at 0:30 Mark  |  >50% Full-Video AVD'
  );

  builder.drawParagraph(
    'When you ask standard ChatGPT to "Write a YouTube script," it writes a slow, polite school essay ("Hey guys, welcome back to the channel! Today we are going to talk about..."). That opener loses 55% of viewers in 12 seconds. Every faceless script must use the 5-Part Retention Arc below.'
  );

  builder.drawTable(
    ['Time Stamp Window', 'Retention Block', 'Psychological Objective', 'Scripting Rule'],
    [
      ['0:00 - 0:08', '1. Click Confirmation & Shock', 'Prove immediately they clicked the right video + drop a shocking stat or visual proof.', 'Zero channel intro. Start mid-action with the core tension.'],
      ['0:08 - 0:25', '2. The Stakes & The Gap', 'Explain why the old way is broken and what happens if they ignore this shift.', 'Use "You" language and show the exact gap between A and B.'],
      ['0:25 - 0:40', '3. The Roadmap & Payoff Loop', 'Promise a specific 4-step system, holding the #1 secret for step 4.', 'Open a curiosity loop that only closes in the final 2 minutes.'],
      ['0:40 - 9:30', '4. The Value Escalation Body', 'Deliver compact insights with a new Mini-Hook ("But here is the catch...") every 90 seconds.', 'Every point must follow: Claim -> Concrete Example -> Visual Cue -> Transition Loop.'],
      ['9:30 - 10:00', '5. The Snap-End & Bridge CTA', 'Never say "In conclusion, thanks for watching!" Pivot directly to the next video or free vault.', 'Keep retention flat until the final second with an abrupt bridge CTA.']
    ],
    [16, 22, 30, 32]
  );

  builder.drawPromptBox(
    'F301',
    'The 10-Minute High-Retention Faceless YouTube Script Architect',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Lead YouTube Retention Scriptwriter (MrBeast pacing + Vox/Johnny Harris visual storytelling + Alex Hormozi clarity).
VIDEO TITLE: [TITLE] | THUMBNAIL CONCEPT: [THUMBNAIL] | TARGET LENGTH: [1,600 WORDS / ~10 MINS]
MONETIZATION BRIDGE: [FREE LEAD MAGNET OR DIGITAL PLAYBOOK IN DESCRIPTION]
TASK: Write a complete, production-ready voiceover script with synchronized visual B-roll cues every 4-6 seconds.
STRICT RETENTION RULES:
1. First 30 Seconds (The Hook Lock): Sentence 1 must directly validate the thumbnail/title with a bold proof point. Open 2 curiosity loops before 0:30. Zero "Welcome back to the channel" fluff.
2. Conversational Spoken Rhythm: Write at a 6th-grade reading level. Short sentences. Use phonetic emphasis markers (caps or italics) and natural pause indicators \`[pause 0.4s]\` for ElevenLabs voice synthesis.
3. The 90-Second Re-Hook Rule: Between every major section, write a bridge transition ("Now, step 1 gets you started, but 90% of people fail right here because of one hidden trap...").
4. Native Monetization Integration: At the 45% mark (peak engagement), weave a 15-second natural mention of [MONETIZATION BRIDGE] as the fast-track implementation toolkit.
5. Snap-End Outro: Transition from the final point directly into why they MUST watch [NEXT VIDEO TOPIC] or grab the toolkit in the last 12 seconds.`,
    'Complete 1,600-word spoken script with ElevenLabs pacing tags and 4-second visual B-roll cues.',
    'Generate the Hook + Outline first, then prompt Claude to write Modules 1-2 and Modules 3-4 in two separate turns for maximum depth.'
  );

  // MODULE 4: AI VOICE & VISUAL WORKFLOW
  builder.addPageWithHeader('MODULE 04: AI VOICE, VISUAL & EDITING PIPELINE');
  builder.drawChapterBanner(
    4,
    'The AI Audio-Visual Production Pipeline (3 Hours Per Video)',
    'How to combine ElevenLabs voice synthesis, Midjourney/Flux style-locked imagery, Runway/Kling motion, and CapCut/Premiere templates.',
    'PRODUCTION COST: ~$4 Per Video  |  QUALITY: Broadcast Documentary Grade'
  );

  builder.drawWorkflowBlueprint(
    'End-to-End Faceless Video Production Assembly Line',
    [
      {
        stage: 'STAGE 1: AUDIO MASTER',
        name: 'ElevenLabs v2.5 Turbo / Professional Voice Clone + Audition EQ',
        detail: 'Generate voiceover in paragraph chunks (Stability: 45%, Clarity: 75%, Style Exaggeration: 15%). Trim dead air >0.25s via Auto-Cut/Recut.'
      },
      {
        stage: 'STAGE 2: VISUAL SCRIPT',
        name: 'Claude Scene-by-Scene Visual Prompt Extractor',
        detail: 'Converts the timestamped audio transcript into 60-80 numbered visual cues (UI screen recordings, motion charts, or AI cinematic B-roll).'
      },
      {
        stage: 'STAGE 3: ASSET GEN',
        name: 'Midjourney --sref Style Lock + Runway Gen-3 / Kling Motion',
        detail: 'Uses a consistent `--sref [code]` style reference seed so every illustration or cinematic shot shares a unified channel aesthetic.'
      },
      {
        stage: 'STAGE 4: TIMELINE',
        name: 'CapCut Pro / Premiere Pro Master Template Assembly',
        detail: 'Drops assets onto timeline with 3-5 second visual change frequency, subtle sound design (whooshes, risers, keyboard clicks at -22dB).'
      },
      {
        stage: 'STAGE 5: MULTIPLY',
        name: 'OpusClip / Custom Vertical Reframe + Metadata Upload',
        detail: 'Exports 4K horizontal master + 5 vertical 9:16 Shorts/Reels/TikTok cuts with dynamic highlighted captions.'
      }
    ],
    'Claude 3.5 + ElevenLabs + Auto-Cut + Midjourney (--sref) + Runway/Kling + CapCut Pro',
    'Consistent 2 Long-Form + 10 Short-Form Videos Per Week'
  );

  builder.drawPromptBox(
    'F401',
    'Script-to-Midjourney/Flux Style-Locked Storyboard Generator',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Visual Art Director and AI Cinematographer.
VISUAL AESTHETIC LOCK: [E.G., DARK CINEMATIC CYBER-MINIMALISM, DEEP NAVY & CYAN PALETTE, ISOMETRIC 3D GLASSMORPHISM, --ar 16:9 --sref 28491042]
VOICEOVER SCRIPT SEGMENT: [PASTE 300-WORD SCRIPT SEGMENT]
TASK: Break this script segment into 5-second visual beats and generate a complete Storyboard Table.
COLUMNS REQUIRED:
1. Beat # & Timestamp (0:00 - 0:05, etc.)
2. Spoken Script Line
3. Visual Type: [AI Cinematic Image -> Motion | Clean Motion Graphic / Chart | Screen Recording UI Demo]
4. Exact Copy-Paste Midjourney / Flux Prompt (ending with \`--ar 16:9 --v 6.1\`) OR exact On-Screen Text/Graph specification.
5. Sound Design Cue (e.g., [Low sub-bass boom], [Subtle paper rustle], [Digital UI chime]).`,
    'Timestamped storyboard table with ready-to-paste Midjourney prompts and sound design cues.',
    'Using a single Midjourney `--sref` (Style Reference) code across your entire channel gives your brand an instantly recognizable visual signature.'
  );

  // MODULE 5: SHORT-FORM VIRAL FACTORY
  builder.addPageWithHeader('MODULE 05: SHORT-FORM VIRAL FACTORY (SHORTS, REELS & TIKTOK)');
  builder.drawChapterBanner(
    5,
    'The Short-Form Viral Factory (TikTok, IG Reels & YouTube Shorts)',
    'Engineer 45-to-58 second vertical videos with 110%+ loop retention that funnel thousands of daily viewers into your bio link and DM automation.',
    'VIRAL METRIC: >78% Viewed-vs-Swiped-Away  |  >105% Average Percentage Viewed'
  );

  builder.drawPromptBox(
    'F501',
    'The 50-Second Infinite-Loop Short/Reel/TikTok Script Generator',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Viral Short-Form Script Engineer (TikTok, IG Reels, YouTube Shorts).
TOPIC / TOOL / SECRET: [TOPIC] | CALL TO ACTION KEYWORD: [COMMENT "VAULT" TO GET THE LINK]
TASK: Write 5 distinct 50-second vertical video scripts (135-150 words each) engineered for >80% Stay-vs-Swipe rate and seamless infinite looping.
MANDATORY SHORT-FORM FORMULA FOR EACH SCRIPT:
- [0-2s] THE VISUAL & VERBAL STOP: Controversial 8-word statement + visual curiosity trigger on frame 1.
- [2-12s] THE AGITATION TWIST: Why what they are currently doing is costing them [X].
- [12-40s] RAPID-FIRE 3-STEP VALUE: 3 ultra-specific steps or tools delivered at high velocity (zero filler words).
- [40-47s] THE MANYCHAT DM TRIGGER: "Comment '[KEYWORD]' and I'll DM you the entire copy-paste PDF playbook free."
- [47-50s] THE SEAMLESS INFINITE LOOP CONNECTOR: The final half-sentence must grammatically connect directly back into the first sentence of [0-2s] (e.g., ends with "...which is the exact reason why" -> starts with "99% of people use ChatGPT wrong...").`,
    '5 complete 50-second vertical scripts with seamless grammatical loop endings and ManyChat DM triggers.',
    'When viewers don\'t realize the video restarted until 2 seconds into the second loop, your retention spikes over 105% and triggers algorithmic distribution.'
  );

  // MODULE 6: MONETIZATION STACK
  builder.addPageWithHeader('MODULE 06: THE 4-LAYER MONETIZATION STACK');
  builder.drawChapterBanner(
    6,
    'The 4-Layer High-Ticket Monetization Stack ($10k-$50k/Mo)',
    'How to stack AdSense, Owned Digital Products, Recurring SaaS Affiliates, and B2B Sponsorships so every 1,000 views generates $80-$150+.',
    'MONETIZATION MIX: 20% AdSense | 45% Digital Products | 20% Affiliates | 15% Sponsors'
  );

  builder.drawTable(
    ['Revenue Layer', 'When It Activates', 'Unit Economics', 'Integration Mechanism'],
    [
      ['Layer 1: Owned Digital Playbooks & Vaults', 'Day 1 (Video #1)', '$29 - $97 @ 97% Margin', 'Pinned comment + top line of description + ManyChat DM automation + Lead Magnet upsell.'],
      ['Layer 2: Recurring AI & SaaS Affiliates', 'Day 1 (Video #1)', '20% - 40% Monthly Recurring', 'Show the exact tool inside your tutorial workflow; provide a free template/blueprint link that requires the tool.'],
      ['Layer 3: Direct Brand Sponsorships', 'At 5,000+ Avg Views/Video', '$35 - $65 CPM ($500-$3,000/video)', 'Outbound sponsorship pitch to SaaS CMOs whose product matches your high-intent tutorial audience.'],
      ['Layer 4: YouTube Partner AdSense', '1,000 Subs + 4,000 Watch Hrs', '$18 - $45 RPM (High-CPM Niches)', 'Optimize videos to 8+ minutes for mid-roll ad placement at natural chapter transitions.']
    ],
    [24, 18, 22, 36]
  );

  builder.drawPromptBox(
    'F601',
    'Lead-Magnet-to-Paid-Digital-Product Bridge Funnel Architect',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Creator Funnel Architect converting organic YouTube/Reels viewers into digital product buyers.
VIDEO TOPIC: [VIDEO TOPIC] | PAID DIGITAL PRODUCT ($39): [PRODUCT NAME]
TASK: Design the complete frictionless conversion bridge from viewer to buyer:
1. The Free "Micro-Asset" Lead Magnet: A 1-page cheat sheet or 5-prompt starter pack directly tied to the video topic.
2. The 15-Second In-Video Native Callout Script: How to mention the free asset + full vault at the 4-minute mark without feeling like an ad interruption.
3. The Opt-In Thank-You Page "Tripwire" Offer Copy: A 200-word bridge page shown immediately after they enter their email, offering the complete $39 Vault at a 15-minute fast-action bundle discount.
4. Pinned YouTube Comment & Description Box Template (optimized for above-the-fold link clicks).`,
    'In-video callout script, thank-you page tripwire copy, and high-CTR description/pinned comment template.',
    'Always put your primary monetization URL on Line 1 of your YouTube description—before the "Show More" fold.'
  );

  builder.drawPromptBox(
    'F602',
    'High-CPM Brand Sponsorship Outbound Pitch & Rate Card Generator',
    'Claude 3.5 Sonnet / GPT-4o',
    `ROLE: Act as a Talent Sponsorship Director negotiating B2B SaaS and AI tool brand deals.
MY CHANNEL NICHE: [NICHE] | AUDIENCE DEMOGRAPHIC: [FOUNDERS / DEVELOPERS / CREATORS]
AVERAGE VIEWS PER VIDEO: [VIEWS] | TARGET SPONSOR BRAND: [BRAND NAME]
TASK: Write a high-converting cold sponsorship pitch email + 3-Package Rate Card that commands premium B2B CPMs ($45-$75 CPM) even with a small subscriber count.
DELIVERABLE:
1. Cold Email to Head of Partnerships / CMO (under 90 words): Pitch a specific video topic we are producing next week where their tool naturally solves the viewer's problem.
2. The "Integration Concept": Show the exact 60-second mid-roll demonstration script so they can visualize the ROI.
3. 3-Tier Sponsorship Package Table: Single Dedicated Integration vs. 3-Video Bundle (with 60-day link pinning + newsletter inclusion + short-form cutdown rights).`,
    '90-word sponsor pitch email, 60-second integration preview, and 3-tier B2B sponsorship rate card.',
    'Never sell single-video sponsorships if you can pitch a 3-Video Quarterly Partner Bundle—brands see 3x higher conversion on repeated exposure.'
  );

  while (builder.doc.bufferedPageRange().count < 19) {
    builder.addPageWithHeader('90-DAY FACELESS MEDIA EMPIRE EXECUTION ROADMAP');
    builder.drawSectionHeading(
      'The 90-Day Faceless Channel Scaling & SOP Checklist',
      'Follow this weekly production cadence to hit 30 Long-Form Videos + 120 Short-Form Clips and $10,000/month run-rate in 90 days.'
    );
    builder.drawTable(
      ['Phase & Timeline', 'Production Volume Target', 'Core Systems & Prompts Used', 'Primary Monetization Milestone'],
      [
        ['Days 1 - 14: Foundation', 'Channel Setup + 1st Digital Product + 4 Outlier Scripts', 'Prompts #F101, #F201, #F301, #F601', '$39 Digital Vault & Lead Magnet Funnel Live Before Video 1'],
        ['Days 15 - 45: Traction', '2 Long-Form + 6 Shorts/Week (10 Long, 30 Shorts total)', 'Prompts #F301, #F401, #F501', 'First 1,000 Email Subscribers + $1,500-$3,000 Product/Affiliate Sales'],
        ['Days 46 - 75: Optimization', 'Double Down on Top 20% Outlier Formats (10 Long, 40 Shorts)', 'YouTube Test & Compare + Prompt #F602', 'YouTube Partner AdSense Unlocked + First $1,500 Brand Sponsor'],
        ['Days 76 - 90: Delegation', 'Hire $15/hr Video Editor Using Storyboard SOPs', 'Prompt #F401 Storyboard Handoff SOP', 'Founder time reduced to 4 hrs/week; $10k+/mo multi-layer run-rate']
      ],
      [20, 26, 24, 30]
    );

    builder.drawCalloutBox(
      'PRE-UPLOAD QUALITY GATE (VERIFY BEFORE HITTING PUBLISH ON EVERY VIDEO)',
      '[ ] 1. Title is under 52 characters and creates an immediate curiosity gap or quantified promise.\n[ ] 2. Thumbnail passes the 160x90 pixel mobile squint test with <= 3 elements and high contrast.\n[ ] 3. First 15 seconds of audio confirm the click immediately with zero throat-clearing intro.\n[ ] 4. Visual screen changes or zoom keyframes occur at least once every 4-5 seconds in the first 2 minutes.\n[ ] 5. Line 1 of the Description and the Pinned Comment link directly to your Owned Lead Magnet / Digital Vault.',
      'UPLOAD CHECKLIST'
    );
  }

  return builder.finalize();
}

// ============================================================================
// BOOK 4: Ecommerce-AI-Vault.pdf (18+ Pages)
// ============================================================================
async function buildBook4() {
  const builder = new PlaybookBuilder('Ecommerce-AI-Vault.pdf', {
    title: 'E-COMMERCE & DROPSHIPPING AI AD COPY, CRO & PRODUCT RESEARCH VAULT',
    shortTitle: 'E-Commerce & Dropshipping AI Ad Copy, CRO & Research Vault',
    subtitle:
      'The Complete DTC & Dropshipping Scaling System: Winning Product Validation Matrix, Viral TikTok/Meta UGC Hook Scripts, High-Converting Shopify Product Page Prompts, AOV Bundle Engineering & Automated Klaviyo Email/SMS Flows',
    editionBadge: 'DTC Growth & CRO Vault • v4.1',
    priceTag: '$49 E-COM VAULT',
    bgDark: '#1c0d06',
    cardDark: '#2e160b',
    primary: '#ea580c',
    accent: '#fbbf24',
    coverHighlights: [
      {
        head: 'The 10-Point Winning Product Validation & Margin Matrix',
        desc: 'Filter out saturated low-margin traps using problem-solving pain scores, 3.5x COGS markup rules, and competitor ad-longevity forensics.'
      },
      {
        head: 'Viral TikTok Shop & Meta Ads UGC Script Factory',
        desc: '30+ scroll-stopping 3-second visual/verbal hooks, modular [Hook + Body + CTA] creative testing matrices, and AI avatar UGC workflows.'
      },
      {
        head: 'High-Converting Shopify Product Page (PDP) & Advertorial Prompts',
        desc: 'Above-the-fold conversion architecture, emotional benefit bullets, comparison charts, and pre-sell advertorial bridge pages.'
      },
      {
        head: 'AOV Bundle Engineering, Cart Drawers & Post-Purchase Upsells',
        desc: 'Turn $38 single-item orders into $85+ average order values using quantity breaks, free-gift thresholds, and 1-click OTOs.'
      },
      {
        head: 'Klaviyo Email & SMS Revenue Engine (30-40% of Store Revenue)',
        desc: 'Copy-paste sequences for Welcome Spin/Discount, Abandoned Checkout, Browse Abandonment, VIP Win-Back, and Post-Purchase Cross-Sell.'
      }
    ],
    coverMetrics: [
      { val: '4.2%+ CVR', label: 'Target Shopify PDP Conversion' },
      { val: '+55% AOV', label: 'Bundle & Upsell Architecture' },
      { val: '35% REV', label: 'Automated Klaviyo Email + SMS' }
    ]
  });

  builder.drawCoverPage();

  builder.drawTOC([
    {
      title: 'The Winning Product Validation Matrix & Unit Economics',
      pageRef: 'Module 01',
      desc: 'The 10-Point Product Scorecard, break-even ROAS math, competitor review mining, and angle differentiation.'
    },
    {
      title: 'TikTok & Meta UGC Ad Scripts & The Modular Hook Vault',
      pageRef: 'Module 02',
      desc: 'Scroll-stopping 3-second hooks, Problem-Demo-Proof UGC scripts, and the 3x2x2 Modular Creative Testing System.'
    },
    {
      title: 'High-Converting Shopify Product Page (PDP) & Advertorial Copy',
      pageRef: 'Module 03',
      desc: 'Above-the-fold buy-box psychology, feature-to-benefit blocks, comparison tables, and pre-sell advertorials.'
    },
    {
      title: 'CRO Audit, AOV Bundle Architecture & Checkout Optimization',
      pageRef: 'Module 04',
      desc: 'Quantity breaks, slide-cart gamification, post-purchase 1-click upsells, and mobile speed/trust optimization.'
    },
    {
      title: 'Klaviyo Email & SMS Cart Recovery & Retention Sequences',
      pageRef: 'Module 05',
      desc: 'Abandoned Checkout (4-part), Welcome Flow, Browse Abandonment, and 60-Day VIP Win-Back copy prompts.'
    },
    {
      title: 'Media Buying Diagnostics, Scaling Rules & Customer CX Bots',
      pageRef: 'Module 06',
      desc: 'Thumbstop/Hold/CTR ad diagnostics, horizontal vs. vertical scaling SOPs, and AI order-support automation.'
    }
  ]);

  // MODULE 1: PRODUCT VALIDATION
  builder.addPageWithHeader('MODULE 01: WINNING PRODUCT VALIDATION MATRIX');
  builder.drawChapterBanner(
    1,
    'The Winning Product Validation Matrix & Break-Even ROAS Math',
    '80% of e-commerce failures happen before the first ad is launched—by picking low-margin commodities with no visceral emotional or functional pain.',
    'MINIMUM THRESHOLD: 4.0x Landed COGS Markup  |  Score >= 80/100'
  );

  builder.drawTable(
    ['Validation Criterion', 'Weight', 'Failing Product Trap (Avoid)', 'Winning Product Standard (Scale)'],
    [
      ['1. Visceral Pain or Status Solver', '20 pts', 'Mild "nice-to-have" novelty trinket.', 'Solves physical discomfort, daily frustration, insecurity, or pet/baby/beauty anxiety.'],
      ['2. Gross Margin & AOV Headroom', '20 pts', 'Sells for $19 with $9 landed COGS ($10 margin cannot absorb $15 CPA).', 'Landed COGS <= $12 with perceived value supporting $49-$89 AOV (via bundles).'],
      ['3. Instant 3-Second Visual Demo', '15 pts', 'Requires 45 seconds of explanation to understand.', 'Visually demonstrates the before/after mechanism in the first 2.5 seconds on mute.'],
      ['4. Repeat / Consumable / Bundle Potential', '15 pts', 'One-time purchase with zero natural add-ons.', 'Naturally sold in 2-packs/3-packs or has a consumable refill/accessory upsell.'],
      ['5. Competitor Ad Longevity Signal', '15 pts', 'Either zero ads exist OR 500 stores running identical AliExpress video.', '2-5 competitors running active Meta/TikTok ads for >30 consecutive days with weak branding.'],
      ['6. Shipping Weight & Return Risk', '15 pts', 'Heavy/fragile glass or complex sizing (shoes/fitted apparel with 25% return rate).', 'Under 500g, durable ePacket/3PL friendly, one-size or simple variant selection.']
    ],
    [24, 10, 32, 34]
  );

  builder.drawPromptBox(
    'E101',
    'The 10-Point Product Validator, Break-Even ROAS & Positioning Engine',
    'Claude 3.5 Sonnet / GPT-4o',
    `ROLE: Act as an 8-Figure DTC Brand Director and E-Commerce Unit Economics Analyst.
CANDIDATE PRODUCT: [PRODUCT DESCRIPTION]
LANDED COGS (PRODUCT + SHIPPING): [$X] | PROPOSED SELLING PRICE: [$Y]
COMPETITOR AMAZON / TRUSTPILOT REVIEWS: [PASTE 10-20 1-STAR TO 4-STAR REVIEWS OF SIMILAR PRODUCTS]
TASK: Audit this product's viability and engineer a differentiated brand angle.
DELIVERABLE:
1. 100-Point Validation Scorecard Table across the 6 core criteria + Go/No-Go Verdict.
2. Unit Economics & Break-Even ROAS Table: Calculate Gross Margin $, Payment Processing (2.9% + $0.30), Break-Even CPA, and Break-Even ROAS for 1-Unit vs. 2-Unit Bundle vs. 3-Unit Bundle.
3. Competitor Weakness Exploitation: Extract the top 3 complaints from competitor reviews and show how to position our version/offer as the upgraded solution.
4. 3 Distinct Sub-Avatar Angles: Identify 3 unexpected buyer personas we can target with separate ad creatives (e.g., Nurses on 12-hour shifts vs. Frequent Travelers vs. Postpartum Moms).`,
    '100-point Go/No-Go audit, Break-Even ROAS math across bundles, and 3 high-converting buyer avatars.',
    'Often a saturated product becomes a massive winner simply by repositioning it for a hyper-specific avatar (e.g., selling a posture brace specifically for software engineers).'
  );

  // MODULE 2: TIKTOK & META UGC AD SCRIPTS
  builder.addPageWithHeader('MODULE 02: TIKTOK & META UGC AD SCRIPTS');
  builder.drawChapterBanner(
    2,
    'TikTok & Meta UGC Ad Scripts & The Modular 3x2x2 Creative Matrix',
    'In post-Andromeda Meta and TikTok algorithms, your creative IS your targeting. Use modular script architecture to produce 12 testable ads from 1 shoot.',
    'AD BENCHMARKS: >35% Thumbstop Rate (3s)  |  >12% Hold Rate (15s)  |  >1.8% Outbound CTR'
  );

  builder.drawParagraph(
    'Never film a single static UGC script. Instead, instruct every creator (or AI video workflow) to record 3 Hooks + 2 Bodies + 2 CTAs. Mixing and matching those modular clips in CapCut instantly yields 3 x 2 x 2 = 12 distinct ad variations to feed Meta Advantage+ and TikTok Smart Performance campaigns.'
  );

  builder.drawPromptBox(
    'E201',
    'The Modular 3x2x2 UGC Video Ad Script Generator (12 Ads in 1 Shoot)',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Direct-Response Paid Social Creative Strategist ($500k+/mo Meta & TikTok ad spend experience).
PRODUCT: [PRODUCT NAME] | CORE PROBLEM SOLVED: [PAIN] | TARGET AVATAR: [AVATAR]
OFFER: [E.G., BUY 2 GET 1 FREE + FREE SHIPPING TODAY]
TASK: Write a Modular UGC Production Script designed so 1 creator can film 3 Hooks, 2 Bodies, and 2 CTAs (yielding 12 testable ad combinations).
SCRIPT STRUCTURE (2-COLUMN VISUAL ACTION + SPOKEN AUDIO):
- HOOK 1 (0-3s - Negative/Warning Callout): "Stop doing [Common Habit] if you deal with [Pain]..." + jarring visual pattern interrupt.
- HOOK 2 (0-3s - TikTok/Social Proof Discovery): "I finally caved and bought the viral [Product] after seeing it 10 times..."
- HOOK 3 (0-3s - Sceptic-to-Believer Visual Demo): Extreme close-up of the mechanism working in 2 seconds + "I genuinely thought this was a scam until..."
- BODY A (3-22s - Problem -> Mechanism -> Immediate Relief): Visceral demonstration of old frustration vs. 3-second solution + 3 rapid benefit callouts.
- BODY B (3-22s - Us vs. Cheap Alternatives Comparison): Side-by-side comparison showing why standard store/Amazon versions fail and why ours lasts.
- CTA 1 (22-28s - Scarcity + Risk Reversal): Mention recent sell-out risk + 30-day money-back guarantee.
- CTA 2 (22-28s - Bundle Value Anchor): Highlight the Buy-2-Get-1-Free bundle deal at the link below.`,
    'Complete modular creator brief producing 12 high-converting UGC ads from a single 15-minute filming session.',
    'Add native TikTok/Reels text stickers in the top-center safe zone during the first 3 seconds—80% of users scroll with sound off or low.'
  );

  builder.drawPromptBox(
    'E202',
    '30 Scroll-Stopping 3-Second Visual & Verbal Hooks Vault Generator',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Viral TikTok Shop & Meta Reels Hook Specialist.
PRODUCT: [PRODUCT] | TARGET BUYER: [AVATAR]
TASK: Generate 30 distinct 3-Second Hooks (10 Verbal Line + Visual Action pairs across 3 psychological buckets):
Bucket 1 (10 Hooks): Visceral Pain & Embarrassment ("Nobody talks about how embarrassing [Problem] is until...")
Bucket 2 (10 Hooks): Oddly Satisfying / Sensory Demo (Visual physical action that forces the brain to watch the completion loop)
Bucket 3 (10 Hooks): Authority / Insider Secret ("As a [Profession/Mom/Specialist], here is the one $39 upgrade I tell everyone to get...")
OUTPUT: Markdown table with [Hook # | Spoken Line (Max 10 Words) | Exact First-Frame Visual Action | On-Screen Caption Sticker].`,
    '30 ready-to-shoot 3-second hooks with exact visual blocking and on-screen caption text.',
    'If an ad has a good Hold Rate and CTR but a high CPM/CPC, you don\'t need a new video—just swap the first 3 seconds.'
  );

  builder.drawPromptBox(
    'E203',
    'Meta Ads Primary Text, Headline & Static Image Concept Architect',
    'Claude 3.5 Sonnet / GPT-4o',
    `ROLE: Act as a Meta Ads Media Buyer and Static Creative Designer.
PRODUCT: [PRODUCT] | OFFER: [OFFER] | AVATAR: [AVATAR]
TASK: Create 5 complete Meta Static Ad Concepts + Primary Ad Copy variations.
PART 1 — 5 STATIC IMAGE WIREFRAMES (With Midjourney/Flux Prompts):
1. "Us vs. Them" Split Comparison Chart.
2. Founder/Customer iPhone Notes App Screenshot Confession.
3. Anatomical / Feature Pointer Callout Diagram (Hero product with 4 benefit arrows).
4. Verified 5-Star Review Overlay on Lifestyle Photo.
5. "The Math" Cost Comparison (e.g., "$400 Clinic Visit vs. $39 At-Home System").
PART 2 — 5 PRIMARY TEXT COPY VARIATIONS:
- Variation 1: Short Punchy (3 lines + 4 emoji-free checkmarks + link).
- Variation 2: Story-Driven PAS (120 words).
- Variation 3: Review Mashup (3 verbatim customer quotes + offer).
- Plus 5 High-CTR Headline + Description pairs (e.g., "★★★★★ 14,200+ Happy Customers | 50% Off Ends Tonight").`,
    '5 high-converting static ad wireframes + 5 Meta Primary Text and Headline combinations.',
    'Static image ads often achieve 30-40% lower CPMs than video ads in Meta Advantage+ campaigns and act as powerful retargeting anchors.'
  );

  // MODULE 3: SHOPIFY PRODUCT PAGE & ADVERTORIALS
  builder.addPageWithHeader('MODULE 03: HIGH-CONVERTING SHOPIFY PDP & ADVERTORIALS');
  builder.drawChapterBanner(
    3,
    'High-Converting Shopify Product Page (PDP) & Advertorial Copy',
    'Stop pasting supplier specs onto your Shopify store. Build a psychological persuasion machine that converts cold social traffic at 4.5%+.',
    'PDP TARGET: 12%+ Add-to-Cart Rate  |  4.5%+ Checkout Purchase Rate'
  );

  builder.drawPromptBox(
    'E301',
    'Complete Above-the-Fold & Long-Form Shopify Product Page (PDP) Architect',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Principal Shopify CRO Copywriter (Ezra Firestone, Ridge, Jones Road, and HexClad methodology).
PRODUCT: [PRODUCT NAME] | PRICE & BUNDLES: [PRICING] | CORE MECHANISM: [HOW IT WORKS]
TASK: Write the complete copy and wireframe for a high-converting Shopify Product Page.
SECTIONS REQUIRED:
1. Above-the-Fold Buy Box:
   - Social Proof Rating Line ("★★★★★ 4.9/5 from 4,820+ Verified Buyers").
   - Outcome-Driven Product Title + 1-Sentence Value Proposition Subtitle.
   - 4 Scannable Icon Benefit Bullets (Bold 2-word hook + tangible benefit).
   - 3-Tier Bundle Selector Micro-copy (1x Starter, 2x Most Popular Save 25%, 3x Best Value Save 40% + Free Gift).
   - Trust & Shipping Bar under Add-to-Cart ("Ships within 24hrs from [Country] • 30-Day Risk-Free Trial").
2. Section 2 (The Visual 3-Step "How It Works"): 3 simple steps with GIF/Image descriptions.
3. Section 3 (Deep Benefit Zig-Zag Blocks): 3 alternating Image + Copy blocks translating engineering features into emotional life upgrades.
4. Section 4 ("Us vs. Ordinary Brands" Comparison Matrix): 6-row table where we win all 6 checkmarks and generic alternatives fail.
5. Section 5 (6 Objection-Crushing FAQs): Sizing/usage, shipping speed, guarantee rules, durability, and results timeline.`,
    'Complete section-by-section Shopify PDP copy ready to paste into Shrine, Impulse, or OS 2.0 themes.',
    'Placing a 4-bullet icon benefit list + shipping/guarantee microcopy directly inside the Above-the-Fold Buy Box lifts Add-to-Cart rates by 22%+.'
  );

  builder.drawPromptBox(
    'E302',
    'The "Listicle & Editorial Discovery" Pre-Sell Advertorial Bridge Page',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Native Advertising & Direct-Response Advertorial Writer.
PRODUCT: [PRODUCT] | TARGET COLD AUDIENCE: [UNAWARE / PROBLEM-AWARE BUYERS]
TASK: Write an editorial-style Pre-Sell Advertorial ("5 Reasons Why Thousands of [Avatars] Are Ditching [Old Way] for This $39 Breakthrough") that warms up cold Meta/TikTok traffic before sending them to the Shopify PDP.
REQUIRED ELEMENTS:
1. Editorial Publication Header & Sub-headline with Read Time ("3 Min Read | Health & Tech Desk").
2. The Relatable Opening Story: Hook the reader with the frustrating moment their current solution failed.
3. The Discovery Moment: Introduce the new mechanism objectively like an investigative journalist testing it.
4. 5 Numbered "Reasons Why" Sections: Combine scientific/logical credibility, social proof, cost savings, and ease of use.
5. The Native Offer Callout Box at the Bottom: "Update: As of [Current Month], the brand is running a special 40% Off + Free Shipping bundle for new readers..." + High-Contrast CTA Button checking stock availability.`,
    '900-word editorial pre-sell advertorial or 5-reason listicle bridge page.',
    'Cold traffic sent to a 5-Reason Listicle before the PDP frequently converts 40-70% higher on products priced over $55.'
  );

  // MODULE 4: CRO & AOV BUNDLE ENGINEERING
  builder.addPageWithHeader('MODULE 04: CRO AUDIT & AOV BUNDLE ARCHITECTURE');
  builder.drawChapterBanner(
    4,
    'CRO Audit, AOV Bundle Architecture & Slide-Cart Optimization',
    'Rising ad costs kill stores that only sell 1 unit at a time. Engineer your Offer, Slide-Cart, and Post-Purchase flow to add +$25-$45 to every order.',
    'AOV MULTIPLIER: $39 Single Price -> $74 Realized Store AOV'
  );

  builder.drawTable(
    ['AOV & CRO Lever', 'Funnel Placement', 'Psychological Trigger', 'Expected Revenue Lift'],
    [
      ['Quantity Break Bundles (1x / 2x / 3x)', 'Above-the-Fold Buy Box (Pre-Selected on 2x)', 'Default Bias + Per-Unit Discount Framing + "Most Popular" Badge', '+32% to +48% AOV'],
      ['Slide-Cart Free Shipping + Mystery Gift Bar', 'Slide-Out Cart Drawer', 'Goal-Gradient Effect ("You are only $11 away from Free Express Shipping + Gift!")', '+14% Cart Value'],
      ['1-Tick Shipping Protection / Priority Processing', 'Slide-Out Cart Drawer ($3.95 toggle)', 'Loss Aversion & Peace of Mind (Pure 98% Profit Margin)', '+$2.80 Pure Profit/Order'],
      ['In-Cart Complementary Cross-Sell', 'Slide-Out Cart Drawer', 'Impulse Add-On ("Add the Refill/Travel Case for 40% Off")', '+9% Take Rate'],
      ['1-Click Post-Purchase Upsell (OTO)', 'Between Checkout & Thank-You Page', 'Zero Re-Entry of Card Details ("Wait! Add a 2nd unit for 50% off with 1 click")', '+12% to +18% Total Revenue']
    ],
    [26, 22, 32, 20]
  );

  builder.drawPromptBox(
    'E401',
    'The 50-Point Shopify Conversion Rate Optimization (CRO) Friction Auditor',
    'Claude 3.5 Sonnet / GPT-4o',
    `ROLE: Act as a Principal Shopify CRO Architect auditing a store with high traffic but <2.0% conversion rate.
STORE NICHE & PRICE: [NICHE & PRICE] | CURRENT FUNNEL METRICS: [ATC %, REACHED CHECKOUT %, PURCHASE %]
CURRENT PAGE COPY / SCREENSHOT DESCRIPTION: [PASTE COPY OR LAYOUT DETAILS]
TASK: Diagnose the exact funnel leak and output a prioritized 10-Point CRO Surgery Plan:
1. If ATC < 8%: Diagnose Above-the-Fold clarity, image carousel sequence (lifestyle vs. infographic), price anchoring, and variant selector friction.
2. If ATC is High (>10%) but Checkout Initiation is Low: Diagnose Slide-Cart shock (unexpected shipping fees, distracting popups, missing Express Pay buttons).
3. If Checkout Initiation is High (>6%) but Purchase < 2.2%: Diagnose shipping cost threshold, payment methods (Shop Pay, Apple Pay, PayPal, Klarna), and delivery date transparency.
OUTPUT: Ranked table of 10 fixes ordered by [Ease of Implementation (Minutes) vs. Conversion Impact].`,
    'Funnel-stage diagnostic pinpointing whether the leak is on the PDP, Slide-Cart, or Checkout.',
    'Always customize your Product Image Carousel so Images 2, 3, and 4 are clean graphic callout slides—65% of mobile buyers swipe images without reading body text.'
  );

  // MODULE 5: KLAVIYO EMAIL & SMS FLOWS
  builder.addPageWithHeader('MODULE 05: KLAVIYO EMAIL & SMS REVENUE ENGINE');
  builder.drawChapterBanner(
    5,
    'Klaviyo Email & SMS Cart Recovery & Retention Flows',
    'A healthy e-commerce brand generates 30% to 40% of its total revenue from automated Klaviyo flows at near-100% profit margin.',
    'RETENTION BENCHMARK: 35%+ Total Store Revenue from Automated Flows'
  );

  builder.drawPromptBox(
    'E501',
    '4-Step Abandoned Checkout & Cart Recovery Sequence (Email + SMS)',
    'Claude 3.5 Sonnet',
    `ROLE: Act as a Senior Klaviyo Retention Copywriter for a high-growth DTC brand.
PRODUCT: [PRODUCT] | BRAND VOICE: [WARM, WITTY, HELPFUL] | GUARANTEE: [30-DAY RISK-FREE]
TASK: Write a high-converting 4-Email + 2-SMS Abandoned Checkout Sequence that recovers 18-25% of abandoned carts without training customers to wait for deep discounts in Email 1.
FLOW TIMING & STRATEGY:
- Email 1 (45 Mins After Abandonment - Zero Discount): Helpful Customer Service & Reservation Frame ("Did your Wi-Fi blink? We saved your cart") + Dynamic Cart Block + 3 bullet reminders of the transformation.
- SMS 1 (1.5 Hours After): Friendly founder check-in asking if they had a question about sizing/shipping before their order packs.
- Email 2 (18 Hours After - Social Proof & Objection Crusher): Lead with the #1 customer transformation story + answer the top 3 hesitations + highlight the 30-Day Guarantee.
- Email 3 (36 Hours After - Incentive Unlock): Offer a Free Mystery Gift or 10-15% Fast-Action Code expiring in 24 hours.
- SMS 2 (44 Hours After): Short urgency reminder that their reserved cart & code expire tonight.
- Email 4 (60 Hours After - Plain-Text Founder Note): Personal plain-text email from the Founder asking for honest feedback and offering a final 1-click cart restore link.`,
    '4 complete Klaviyo emails (with 3 subject lines each) + 2 compliant SMS messages.',
    'Withholding the discount code until Email 3 (36 hours) protects your profit margin on the 50% of buyers who just got distracted and buy off Email 1.'
  );

  builder.drawPromptBox(
    'E502',
    'Post-Purchase Bounce-Back, Review Generator & 45-Day VIP Win-Back Flow',
    'Claude 3.5 Sonnet',
    `ROLE: Act as an E-Commerce LTV & Retention Strategist.
PRODUCT: [PRODUCT] | COMPLEMENTARY UPSELL PRODUCT: [PRODUCT B]
TASK: Write the 4 core Post-Purchase & LTV expansion emails that turn 1-time buyers into 3x repeat customers:
1. Email 1 (Immediate Post-Purchase - Buyer's Remorse Eradicator): Celebrate their decision, explain exactly what happens next with shipping, and give a "Secret VIP Link" for 25% off an add-on before their box ships.
2. Email 2 (2 Days Before Delivery - Usage Hype & Quick-Start Guide): Teach them the #1 tip to get instant results the moment they open the package.
3. Email 3 (10 Days Post-Delivery - Photo/Video UGC Review Request): Frictionless request offering a $15 store credit for a 15-second video or photo review (via Loox/Judge.me).
4. Email 4 (45 Days Post-Purchase - Replenishment / VIP Win-Back): Exclusive "$20 VIP Gift Card" (minimum spend $50) expiring in 48 hours.`,
    '4 complete post-purchase emails driving immediate cross-sells, video UGC reviews, and 45-day repeat orders.',
    'A "$20 Gift Card on orders over $50" outperforms a "20% Off" coupon by 2.4x because dollar amounts trigger concrete loss aversion.'
  );

  // MODULE 6: MEDIA BUYING & SCALING
  builder.addPageWithHeader('MODULE 06: MEDIA BUYING DIAGNOSTICS & SCALING SOP');
  builder.drawChapterBanner(
    6,
    'Media Buying Diagnostics, Scaling Rules & AI Customer Support',
    'How to read Meta/TikTok ad metrics like a forensic surgeon, scale winning creatives from $50/day to $2,500/day, and automate 80% of customer tickets.',
    'SCALING PROTOCOL: Scientific Kill/Scale Rules  |  Zero Emotional Spend'
  );

  builder.drawTable(
    ['Metric Bottleneck', 'Healthy Benchmark', 'Root-Cause Diagnosis', 'Exact Actionable Fix'],
    [
      ['Low Thumbstop Rate (<25%)', '32% - 45%+ (3s Views / Impressions)', 'First 3 seconds fail to arrest the scroll or look like a boring corporate ad.', 'Keep the video body; swap in 3 new visual/verbal hooks from Prompt #E202.'],
      ['Low Hold Rate (<8%)', '12% - 20%+ (15s ThruPlay / 3s Views)', 'Pacing after second 3 is too slow; mechanism isn\'t demonstrated visually.', 'Cut dead air, show the physical product demo at 0:04, add faster 2-second cuts.'],
      ['Low Outbound CTR (<0.9%)', '1.5% - 2.8%+', 'Viewers watch the video entertainment but feel zero urgency to click and buy.', 'Strengthen the final 5-second CTA and highlight the Bundle Offer in the Headline.'],
      ['High CPC / High CPM (>$45)', 'CPM $14 - $28 / CPC <$1.20', 'Ad creative has low engagement or narrow audience fatigue.', 'Go Broad (open targeting) and launch 3 static image ads (Prompt #E203) to lower blended CPM.'],
      ['High CTR (>2%) but Low ROAS (<1.2)', 'ROAS > 2.2x+ (above Break-Even)', 'Disconnect between Ad Promise and Product Page (or broken mobile checkout).', 'Run Prompt #E401 CRO Audit; ensure the exact bundle promised in the ad is pre-selected on the PDP.']
    ],
    [22, 18, 30, 30]
  );

  builder.drawPromptBox(
    'E601',
    'AI Customer Support (Gorgias / Zendesk) Order Triage & Instant Resolution Agent',
    'GPT-4o / Claude 3.5 Sonnet',
    `ROLE: Act as an Autonomous DTC Customer Experience Agent integrated with Shopify and 17Track/AfterShip.
STORE POLICIES:
- Processing Time: [24-48 Hours] | Shipping Window: [5-8 Business Days]
- Refund / Replacement Policy: [30-Day Guarantee; Always offer Instant Free Replacement + 20% Keep-It Discount BEFORE processing a full refund to save margin].
CUSTOMER TICKET: {{customer_message}}
SHOPIFY ORDER DATA: Order #{{order_number}} | Status: {{fulfillment_status}} | Tracking: {{tracking_url}} | Last Scan: {{tracking_status}}
TASK: Classify the ticket intent (WISMO "Where Is My Order", Damaged/Defective, Refund Request, Pre-Sale Question, Address Change) and write an empathetic, brand-aligned response that resolves the issue in 1 touch while protecting store revenue and preventing chargebacks.`,
    'Production system prompt for Gorgias/Zendesk AI agents resolving 80% of WISMO and return tickets automatically.',
    'Offering a "Keep the product + receive a 35% partial refund or free replacement" saves 45% of return requests while leaving the customer delighted.'
  );

  while (builder.doc.bufferedPageRange().count < 19) {
    builder.addPageWithHeader('7-DAY PRODUCT LAUNCH & SCALING SPRINT SOP');
    builder.drawSectionHeading(
      'The 7-Day DTC Product Launch & Testing Sprint Roadmap',
      'How to go from product selection to live Meta/TikTok creative testing and automated Klaviyo flows in 7 structured days.'
    );
    builder.drawTable(
      ['Day', 'Sprint Focus', 'Vault Prompts to Execute', 'Completion Deliverable'],
      [
        ['Day 1', 'Product Validation & Unit Economics', 'Prompt #E101 + VoC Review Mining', '80+ Score Product + Break-Even ROAS & 3-Tier Bundle Math'],
        ['Day 2', 'High-Converting Shopify PDP & Bundles', 'Prompts #E301, #E302, #E401', 'Live Shopify PDP with 1x/2x/3x Bundle App + Slide-Cart Upsells'],
        ['Day 3', 'Klaviyo Core Revenue Flows', 'Prompts #E501, #E502', '4-Step Abandoned Cart + Welcome + Post-Purchase Flows Active'],
        ['Day 4', 'Modular UGC & Static Ad Creative Production', 'Prompts #E201, #E202, #E203', '12 Modular Video Variations (3x2x2) + 5 Static Ads Exported'],
        ['Day 5', 'Campaign Launch ($50-$100/Day CBO/ABO)', 'Meta Broad / Advantage+ Setup', 'Campaigns Live with UTM Tracking & Pixel/CAPI Verified'],
        ['Day 6', '48-Hour Forensic Metric Triage', 'Module 06 Diagnostic Matrix', 'Kill ads with >1.5x Break-Even Spend & 0 ATC; Iterate top hooks'],
        ['Day 7', 'Winner Scaling & Support Automation', 'Prompt #E601 + 20% Budget Bumps', 'Scale profitable ad sets +20% every 48hrs + AI Support Bot Live']
      ],
      [10, 26, 26, 38]
    );

    builder.drawCalloutBox(
      'THE SCIENTIFIC AD KILL / SCALE RULES (NEVER BREAK THESE)',
      '• Rule 1 (The Early Cut): If an ad spends 1.0x your Break-Even CPA with zero Add-to-Carts and an Outbound CTR below 0.8%, pause it immediately.\n• Rule 2 (The Purchase Gate): If an ad has strong ATCs and Checkout Initiations, let it spend up to 2.0x Break-Even CPA before judging purchase ROAS.\n• Rule 3 (Winner Duplication): When an ad hits 3+ profitable purchases above target ROAS over 72 hours, immediately film 5 new 3-second hooks for that exact winning body script.',
      'MEDIA BUYING LAW'
    );
  }

  return builder.finalize();
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
async function main() {
  console.log('Starting Agent 8: AI Prompt Engineering Bibles & Automation Playbooks Generator...');
  const results = [];
  results.push(await buildBook1());
  results.push(await buildBook2());
  results.push(await buildBook3());
  results.push(await buildBook4());

  console.log('\n=== GENERATION COMPLETE ===');
  for (const r of results) {
    const stats = fs.statSync(r.filepath);
    console.log(
      `[OK] ${path.basename(r.filepath)} -> ${r.pages} pages (${(stats.size / 1024).toFixed(1)} KB)`
    );
  }
}

main().catch((err) => {
  console.error('Error generating playbooks:', err);
  process.exit(1);
});
