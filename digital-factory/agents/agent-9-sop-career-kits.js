const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', '..', 'downloads', 'playbooks');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Shared Executive Layout Helpers
function drawCover(doc, theme) {
  const { primary, accent, dark, title, subtitle, badge, edition, stats } = theme;
  doc.rect(0, 0, 612, 792).fill(dark);
  doc.rect(0, 0, 612, 14).fill(accent);
  doc.rect(0, 778, 612, 14).fill(primary);

  // Decorative grid / geometric accent
  doc.save();
  doc.opacity(0.08);
  for (let i = 0; i < 612; i += 36) {
    doc.moveTo(i, 0).lineTo(i, 792).stroke('#ffffff');
  }
  for (let j = 0; j < 792; j += 36) {
    doc.moveTo(0, j).lineTo(612, j).stroke('#ffffff');
  }
  doc.restore();

  // Top Badge
  doc.roundedRect(54, 70, 260, 28, 6).fill(primary);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10)
    .text(badge.toUpperCase(), 66, 79, { characterSpacing: 1.5 });

  // Main Title
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(32)
    .text(title, 54, 130, { width: 504, lineGap: 6 });

  // Accent bar
  const afterTitleY = doc.y + 18;
  doc.rect(54, afterTitleY, 90, 5).fill(accent);

  // Subtitle
  doc.fillColor('#cbd5e1').font('Helvetica').fontSize(14)
    .text(subtitle, 54, afterTitleY + 24, { width: 490, lineGap: 5 });

  // Key Value Box
  const boxY = 390;
  doc.roundedRect(54, boxY, 504, 185, 8).fillAndStroke('#1e293b', accent);
  doc.fillColor(accent).font('Helvetica-Bold').fontSize(11)
    .text('EXECUTIVE SYSTEM ARCHITECTURE & INCLUDED ASSETS', 74, boxY + 20, { characterSpacing: 1 });

  stats.forEach((item, idx) => {
    const yPos = boxY + 48 + idx * 30;
    doc.circle(82, yPos + 6, 4).fill(accent);
    doc.fillColor('#f8fafc').font('Helvetica-Bold').fontSize(11)
      .text(item.label + ': ', 96, yPos, { continued: true })
      .font('Helvetica').fillColor('#cbd5e1').text(item.val);
  });

  // Footer Metadata
  doc.roundedRect(54, 650, 504, 70, 6).fill('#0f172a');
  doc.fillColor('#94a3b8').font('Helvetica-Bold').fontSize(9)
    .text('EDITION & LICENSING SPECIFICATION', 74, 665, { characterSpacing: 1 });
  doc.fillColor('#e2e8f0').font('Helvetica').fontSize(10)
    .text(edition, 74, 683, { width: 464 });
}

function drawPageChrome(doc, theme, pageNum, totalPages, sectionTitle) {
  // Header bar
  doc.rect(0, 0, 612, 42).fill(theme.dark);
  doc.rect(0, 42, 612, 3).fill(theme.accent);
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
    .text(theme.shortTitle.toUpperCase(), 48, 16, { characterSpacing: 1 });
  doc.fillColor('#94a3b8').font('Helvetica').fontSize(9)
    .text(sectionTitle, 250, 16, { width: 314, align: 'right' });

  // Footer bar
  doc.moveTo(48, 742).lineTo(564, 742).strokeColor('#e2e8f0').lineWidth(1).stroke();
  doc.fillColor('#64748b').font('Helvetica').fontSize(8)
    .text(theme.footerText, 48, 752);
  doc.fillColor(theme.dark).font('Helvetica-Bold').fontSize(9)
    .text(`Page ${pageNum} of ${totalPages}`, 450, 752, { width: 114, align: 'right' });
}

function drawSectionHeader(doc, theme, code, title, subtitle) {
  doc.roundedRect(48, 62, 516, 64, 6).fill('#f8fafc');
  doc.rect(48, 62, 6, 64).fill(theme.primary);
  doc.fillColor(theme.primary).font('Helvetica-Bold').fontSize(9)
    .text(code.toUpperCase(), 66, 72, { characterSpacing: 1.2 });
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(17)
    .text(title, 66, 86, { width: 486 });
  if (subtitle) {
    doc.fillColor('#475569').font('Helvetica').fontSize(9.5)
      .text(subtitle, 66, 108, { width: 486 });
  }
  return 138;
}

function drawScriptBox(doc, y, title, scriptLines, accentColor = '#0284c7') {
  const height = 34 + scriptLines.length * 19;
  doc.roundedRect(48, y, 516, height, 6).fillAndStroke('#f1f5f9', '#cbd5e1');
  doc.rect(48, y, 5, height).fill(accentColor);
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(10.5)
    .text(title, 64, y + 10);
  let curY = y + 28;
  scriptLines.forEach((line) => {
    doc.fillColor('#1e293b').font('Helvetica-Oblique').fontSize(9.5)
      .text(line, 64, curY, { width: 486 });
    curY += 18;
  });
  return y + height + 10;
}

function drawChecklist(doc, y, title, items, primaryColor = '#0f766e') {
  doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(11)
    .text(title, 48, y);
  let curY = y + 18;
  items.forEach((item) => {
    doc.roundedRect(48, curY, 516, 24, 4).fill('#ffffff').stroke('#e2e8f0');
    doc.roundedRect(56, curY + 5, 13, 13, 2).lineWidth(1.2).stroke(primaryColor);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(9.5)
      .text(item.head + ': ', 76, curY + 7, { continued: true })
      .font('Helvetica').fillColor('#334155').text(item.desc);
    curY += 28;
  });
  return curY + 6;
}

function drawTable(doc, y, headers, rows, colWidths, primaryColor = '#1e293b') {
  const startX = 48;
  const rowHeight = 25;
  doc.rect(startX, y, 516, 24).fill(primaryColor);
  let x = startX;
  headers.forEach((h, i) => {
    doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9)
      .text(h, x + 6, y + 7, { width: colWidths[i] - 12 });
    x += colWidths[i];
  });
  let curY = y + 24;
  rows.forEach((row, rIdx) => {
    const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
    doc.rect(startX, curY, 516, rowHeight).fill(bg).stroke('#e2e8f0');
    let cellX = startX;
    row.forEach((cell, cIdx) => {
      doc.fillColor(cIdx === 0 ? '#0f172a' : '#334155')
        .font(cIdx === 0 ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(8.8)
        .text(cell, cellX + 6, curY + 7, { width: colWidths[cIdx] - 12 });
      cellX += colWidths[cIdx];
    });
    curY += rowHeight;
  });
  return curY + 10;
}

function drawKeyCallout(doc, y, label, body, accentColor = '#d97706') {
  doc.roundedRect(48, y, 516, 56, 5).fill('#fffbeb').stroke(accentColor);
  doc.rect(48, y, 6, 56).fill(accentColor);
  doc.fillColor('#92400e').font('Helvetica-Bold').fontSize(9.5)
    .text(label.toUpperCase(), 64, y + 8, { characterSpacing: 0.8 });
  doc.fillColor('#78350f').font('Helvetica').fontSize(9)
    .text(body, 64, y + 23, { width: 488, lineGap: 2 });
  return y + 66;
}

function renderStandardPage(doc, theme, pageIndex, totalPages, pageSpec) {
  doc.addPage({ size: 'LETTER', margin: 0 });
  drawPageChrome(doc, theme, pageIndex, totalPages, pageSpec.section);
  let y = drawSectionHeader(doc, theme, pageSpec.code, pageSpec.title, pageSpec.subtitle);

  if (pageSpec.intro) {
    doc.fillColor('#334155').font('Helvetica').fontSize(9.5)
      .text(pageSpec.intro, 48, y, { width: 516, lineGap: 3 });
    y = doc.y + 10;
  }

  if (pageSpec.table) {
    y = drawTable(doc, y, pageSpec.table.headers, pageSpec.table.rows, pageSpec.table.widths, theme.primary);
  }

  if (pageSpec.script) {
    y = drawScriptBox(doc, y, pageSpec.script.title, pageSpec.script.lines, theme.accent);
  }

  if (pageSpec.checklist) {
    y = drawChecklist(doc, y, pageSpec.checklist.title, pageSpec.checklist.items, theme.primary);
  }

  if (pageSpec.callout) {
    y = drawKeyCallout(doc, y, pageSpec.callout.label, pageSpec.callout.body, theme.accent);
  }
}

function generateBook(filename, theme, pages) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(OUTPUT_DIR, filename);
    const doc = new PDFDocument({ size: 'LETTER', margin: 0, autoFirstPage: true });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const totalPages = pages.length + 1;
    drawCover(doc, theme);

    pages.forEach((p, idx) => {
      renderStandardPage(doc, theme, idx + 2, totalPages, p);
    });

    doc.end();
    stream.on('finish', () => resolve({ filePath, totalPages }));
    stream.on('error', reject);
  });
}

// ============================================================================
// 1. AGENCY CLIENT ONBOARDING KIT (21 Pages)
// ============================================================================
const agencyTheme = {
  dark: '#0f172a',
  primary: '#2563eb',
  accent: '#06b6d4',
  shortTitle: 'Agency Client Onboarding & Contract SOP Kit',
  title: 'COMPLETE FREELANCE & AGENCY CLIENT ONBOARDING, PROPOSAL & CONTRACT SOP KIT',
  subtitle: 'Turnkey Operations Manual: High-Ticket Discovery Scripts, Ironclad Scope-of-Work Templates, Milestone Payment Clauses, Anti-Scope-Creep Enforcement & Client Offboarding Systems',
  badge: 'Agency Operations Vault • v4.2',
  edition: 'Commercial Agency License • Includes 21 Production-Ready SOP Modules, Legal Clause Frameworks, Kickoff Checklists & Referral Engines.',
  footerText: 'Agency Client Onboarding SOP Kit • Standardized Client Operations & Scope Protection System',
  stats: [
    { label: 'Discovery & Sales Architecture', val: 'SPIN/MEDDIC Qualification Matrix & 45-Minute Diagnostic Script' },
    { label: 'Proposal & Pricing Engineering', val: '3-Tier Value Anchoring & ROI Business Case Calculator' },
    { label: 'Legal & Payment Security', val: 'Milestone Billing Clauses, Kill-Fees, Late-Payment & IP Transfer Rules' },
    { label: 'Zero-Creep Delivery & Kickoff', val: '72-Hour Onboarding Workflow, Change-Order Triggers & Async Cadence' },
    { label: 'Offboarding & LTV Expansion', val: 'Handover Protocol, Case Study Extraction & Retainer Upsell Scripts' }
  ]
};

const agencyPages = [
  {
    section: 'Module 01 • Executive Index & Pipeline Architecture',
    code: 'SOP-01 • Operations Blueprint',
    title: 'Master Agency Client Lifecycle & SOP Architecture',
    subtitle: 'End-to-end operational flow from inbound lead capture to recurring retainer expansion',
    intro: 'High-margin agencies do not fail from lack of creative skill; they fail from operational friction, unbilled scope creep, and ambiguous client expectations. This manual installs a repeatable 6-stage lifecycle across every client account.',
    table: {
      headers: ['Stage', 'Operational Objective', 'Primary Asset / Artifact', 'SLA Target'],
      widths: [96, 170, 160, 90],
      rows: [
        ['01. Triage', 'Filter out low-budget/high-friction leads', 'Inbound Qualification Form', '< 4 Hours'],
        ['02. Discovery', 'Quantify cost of inaction & define KPIs', '45-Min Diagnostic Call Script', '24-48 Hours'],
        ['03. Proposal', 'Anchor 3-tier ROI options & close deal', '3-Option SOW & ROI Deck', '< 48 Hours'],
        ['04. Contract', 'Lock payment milestones & IP protection', 'Master Services Agreement', 'Same Day'],
        ['05. Onboarding', 'Provision portal, assets & kickoff call', '72-Hour Welcome Sequence', '< 72 Hours'],
        ['06. Offboarding', 'Capture testimonial & pitch retainer', 'Handover Packet & Upsell Pitch', 'Final Week']
      ]
    },
    checklist: {
      title: 'Core Agency Profit Protection Rules (Non-Negotiable Standards)',
      items: [
        { head: 'Rule #1 — No Work Before Cleared Deposit', desc: 'Project timelines start on the date the initial 50% milestone invoice clears in the bank.' },
        { head: 'Rule #2 — Single Point of Contact (SPOC)', desc: 'Client must designate one decision-maker to consolidate feedback and sign off deliverables.' },
        { head: 'Rule #3 — Written Change Orders Only', desc: 'Any request outside the signed SOW triggers an automated Change Order quotation.' },
        { head: 'Rule #4 — Asynchronous Default', desc: 'Ad-hoc calls are replaced by Loom updates and structured weekly status digests.' }
      ]
    },
    callout: {
      label: 'Implementation Standard',
      body: 'Clone these checklists into Notion, ClickUp, or Linear as a master template. Never onboard a client manually.'
    }
  },
  {
    section: 'Module 02 • Pre-Call Lead Triage',
    code: 'SOP-02 • Lead Qualification',
    title: 'Pre-Discovery Lead Qualification & Red-Flag Matrix',
    subtitle: 'Score inbound prospects before granting calendar access to protect executive selling time',
    intro: 'Every unqualified discovery call costs an agency 90 minutes of deep-work capacity. Deploy this mandatory intake questionnaire on your booking page (Cal.com / Calendly / SavvyCal) and score leads before confirming the meeting.',
    table: {
      headers: ['Qualification Dimension', 'Green Flag (+25 Pts)', 'Yellow Flag (+10 Pts)', 'Red Flag (Auto-Decline)'],
      widths: [120, 132, 132, 132],
      rows: [
        ['Budget Floor', 'Confirmed > $5,000 budget', '$2,500–$5,000 flexible', '"Cheapest quote wins"'],
        ['Decision Authority', 'Founder / VP with sign-off', 'Manager reporting to C-suite', 'Committee / No authority'],
        ['Timeline Urgency', 'Clear 14–30 day launch goal', 'Exploring Q2/Q3 options', '"Wanted it done yesterday"'],
        ['Past Agency Experience', 'Values strategic partners', 'First time hiring agency', 'Fired 3 agencies in 6 mos'],
        ['Problem Clarity', 'Specific revenue/ops bottleneck', 'General growth desire', 'Vague / "I’ll know when I see it"']
      ]
    },
    script: {
      title: 'Polite Decline & Referral Email Script (For Sub-Minimum Budget Leads)',
      lines: [
        '"Subject: Quick update regarding your [Project Name] inquiry"',
        '"Hi [First Name], thank you for sharing the details of [Company]’s upcoming initiative."',
        '"Based on the scope and target investment range shared on your intake form, our core engagement minimum ($[X,XXX]) wouldn’t be the most capital-efficient fit for your current stage."',
        '"Instead of wasting your time on a call, I’ve attached our self-serve [Playbook/Resource] and copied two vetted independent specialists who excel in the $[X,XXX] range. Wishing you a massive launch!"'
      ]
    },
    callout: {
      label: 'Triage Automation Tip',
      body: 'Configure conditional routing in Typeform/Tally: prospects selecting budgets below your floor are redirected to a digital product or waitlist page instead of your live calendar.'
    }
  },
  {
    section: 'Module 03 • Discovery Call Script (Part 1)',
    code: 'SOP-03 • Diagnostic Sales',
    title: 'The 45-Minute High-Ticket Discovery Call Script (Opening & Diagnosis)',
    subtitle: 'Frame authority in the first 3 minutes and uncover high-value business pain without pitching prematurely',
    intro: 'Treat the discovery call like a surgeon conducting a diagnostic MRI. Do not prescribe solutions in the first 25 minutes. Follow this exact time-boxed script to establish authority and extract quantifiable ROI metrics.',
    script: {
      title: 'Phase 1 & 2 Verbatim Script (Minutes 00:00 to 25:00)',
      lines: [
        '01. FRAME CONTROL (Min 0–3): "Thanks for joining, [Name]. To make these 45 minutes maximally valuable, I’d love to understand where [Company] is today, where you want to be in 90 days, and the exact bottlenecks standing in the way. If there’s an obvious fit, I’ll walk through how our system works. Sound fair?"',
        '02. CURRENT STATE (Min 3–10): "Walk me through how [process/acquisition/product] is currently handled. What prompted you to prioritize fixing this right now rather than six months ago?"',
        '03. QUANTIFYING PAIN (Min 10–18): "When this bottleneck happens, what does it cost you per month in lost revenue, delayed launches, or team payroll hours?"',
        '04. FAILED ATTEMPTS (Min 18–25): "What have you already tried internally or with previous vendors to solve this, and why didn’t it stick?"'
      ]
    },
    checklist: {
      title: 'Mandatory Metrics to Extract Before Pitching',
      items: [
        { head: 'Baseline Metric', desc: 'Current conversion rate, monthly revenue, lead volume, or cycle time.' },
        { head: 'Target 90-Day Metric', desc: 'Exact numeric outcome that defines a wildly successful engagement.' },
        { head: 'Cost of Inaction (COI)', desc: 'Monthly financial bleed if the client waits another 6 months to solve the problem.' },
        { head: 'Stakeholder Map', desc: 'Who else needs to review the proposal (CFO, Co-founder, Legal) before signing?' }
      ]
    }
  },
  {
    section: 'Module 04 • Discovery Call Script (Part 2)',
    code: 'SOP-04 • Pitch & Objection Handling',
    title: 'Discovery Call Script: Solution Bridge, Price Anchoring & Objections',
    subtitle: 'Transition smoothly from diagnosis to your 3-pillar framework and neutralize stall tactics live',
    intro: 'Once the prospect verbalizes their monthly Cost of Inaction, present your methodology in 3 pillars (never features or hours). Anchor your fee against their annual upside and secure a firm proposal review commitment.',
    script: {
      title: 'Phase 3 & 4 Verbatim Script (Minutes 25:00 to 45:00)',
      lines: [
        '05. THE 3-PILLAR BRIDGE (Min 25–33): "Based on what you shared—specifically [Pain A] costing ~$[X]/mo—we solve this in three phases: Phase 1 is [Audit/Architecture], Phase 2 is [Core Build/Execution], and Phase 3 is [Optimization & Handover]."',
        '06. PRICE ANCHOR (Min 33–38): "Clients who want to capture that $[Annual Upside] outcome typically invest between $[Tier 1] and $[Tier 3] depending on speed and hands-on support. How does that align with what you allocated?"',
        '07. LOCKING NEXT STEP (Min 38–45): "I will build a tailored 3-option Scope of Work by tomorrow at 2 PM. Let’s put a 15-minute slot on the calendar for Thursday to review the exact numbers together."'
      ]
    },
    table: {
      headers: ['Common Prospect Objection', 'Diagnostic Reframe Question (Say This Verbatim)'],
      widths: [170, 346],
      rows: [
        ['"Can you just send a price over email?"', '"Happy to—so I don’t send a $30k enterprise build when you need a $8k sprint, which tier of speed are we optimizing for?"'],
        ['"That’s higher than other quotes."', '"Totally fair. Are those quotes guaranteeing [Specific KPI Outcome] or just billing hours for raw deliverables?"'],
        ['"We need to think about it."', '"Of course. Usually that means either the ROI timeline feels unclear or the scope feels risky—which one should we unpack?"'],
        ['"Can we start next quarter?"', '"We can, though earlier you mentioned this bottleneck costs ~$[X]/mo—is waiting 90 days worth losing $[3X]?"']
      ]
    }
  },
  {
    section: 'Module 05 • 3-Tier Proposal Architecture',
    code: 'SOP-05 • Value-Based Pricing',
    title: 'High-Converting 3-Tier Proposal & Pricing Matrix',
    subtitle: 'Eliminate "yes or no" binary decisions by presenting Good / Better / Best ROI options',
    intro: 'Single-price proposals force clients to compare you against external competitors. A 3-tier proposal shifts the buyer’s brain from "Should we hire them?" to "Which tier of speed and certainty do we want?"',
    table: {
      headers: ['Proposal Component', 'Tier 1: Foundation (1.0x)', 'Tier 2: Growth Accelerator (1.6x)', 'Tier 3: Enterprise Turnkey (2.5x)'],
      widths: [120, 132, 132, 132],
      rows: [
        ['Strategic Positioning', 'Do-It-With-You Core Specs', 'Full Execution (Recommended)', 'Done-For-You + Speed + Advisory'],
        ['Core Deliverables', 'Essential baseline scope only', 'Full scope + conversion optimization', 'Full scope + custom integrations'],
        ['Delivery Speed', 'Standard 6-week timeline', 'Priority 4-week timeline', 'Dedicated 2-week sprint'],
        ['Revision Rounds', '1 consolidated round', '2 consolidated rounds', '3 rounds + 30-day post-launch'],
        ['Communication', 'Async bi-weekly email digest', 'Weekly Loom + Slack channel', 'Dedicated Slack + Weekly Live Call'],
        ['Target Fee Ratio', '$5,000 Anchor Floor', '$8,000 Sweet Spot (65% pick)', '$12,500 Decoy / Whale Anchor']
      ]
    },
    callout: {
      label: 'The 5-Page Proposal Rule',
      body: 'Page 1: Executive Summary & Cost of Inaction. Page 2: 90-Day Target Outcomes. Page 3: 3-Phase Roadmap & Timeline. Page 4: 3-Tier Investment Matrix. Page 5: Immediate Next Steps & Signature Block.'
    }
  },
  {
    section: 'Module 06 • Scope of Work (SOW) Template',
    code: 'SOP-06 • Ironclad SOW',
    title: 'Ironclad Scope of Work (SOW) Specification Template',
    subtitle: 'Define explicit deliverables, acceptance criteria, and explicit exclusions to eliminate ambiguity',
    intro: 'Every dispute in agency history stems from vague nouns in the Scope of Work ("Website Redesign", "Marketing Strategy"). Replace vague nouns with countable, verifiable outputs and explicit exclusions.',
    table: {
      headers: ['Workstream / Phase', 'Exact Deliverable Specification', 'Explicitly Out of Scope (Exclusions)', 'Acceptance Criteria'],
      widths: [105, 165, 146, 100],
      rows: [
        ['Phase 1: Architecture', '1x Figma Wireframe System (up to 8 unique views, desktop + mobile)', 'Custom 3D illustrations, copywriting exceeding 4,000 words', 'Written sign-off in Figma within 3 business days'],
        ['Phase 2: Production', 'Production build in Next.js/Webflow + CMS setup for 2 collections', 'Third-party ERP migration, legacy database scrubbing', 'Passes Lighthouse >90 & QA checklist'],
        ['Phase 3: QA & Launch', 'Cross-browser testing (Chrome, Safari, iOS) + DNS cutover', 'Ongoing paid ad management or post-launch content entry', 'Live URL resolves with SSL active']
      ]
    },
    checklist: {
      title: 'Mandatory SOW Protection Clauses to Paste Into Every Schedule A',
      items: [
        { head: 'Consolidated Feedback Rule', desc: 'A "revision round" means a single batched document of edits submitted by the Client SPOC within 72 hours.' },
        { head: 'Deemed Approval Clause', desc: 'Deliverables not reviewed by Client within 5 business days of delivery are automatically deemed approved.' },
        { head: 'Client Dependency Buffer', desc: 'Every day Client delays providing required assets extends the final delivery deadline by 1.5 business days.' },
        { head: 'Asset Format Requirement', desc: 'All client-supplied copy, logos, and credentials must be uploaded to the Onboarding Portal prior to Kickoff.' }
      ]
    }
  },
  {
    section: 'Module 07 • Milestone Payment & Financial Clauses',
    code: 'SOP-07 • Cashflow Protection',
    title: 'Milestone Payment Schedules & Financial Protection Clauses',
    subtitle: 'Tie billing to calendar dates or phase starts—never to subjective "client satisfaction"',
    intro: 'Never structure payments as "50% upfront, 50% upon completion." If a client delays final review for four months, your cashflow is held hostage. Use calendar-backed or phase-gate billing with automated pause rights.',
    script: {
      title: 'Copy-Paste Legal Clauses: Payment Milestones, Late Fees & Pause Rights',
      lines: [
        'CLAUSE 4.1 (HYBRID MILESTONE SCHEDULE): "Client shall pay 50% upon Agreement execution, 25% upon delivery of Phase 1 Architecture (or Day 15 from Effective Date, whichever occurs first), and 25% upon Phase 2 Staging Delivery (or Day 30 from Effective Date, whichever occurs first)."',
        'CLAUSE 4.2 (LATE PAYMENT & WORK SUSPENSION): "Invoices unpaid 5 business days past the due date accrue a 1.5% monthly administrative fee. At Day 7 past due, Agency automatically pauses all workstreams and revokes staging access. A $500 Restart Fee applies to resume work."',
        'CLAUSE 4.3 (DORMANT PROJECT / RESTART FEE): "If Client becomes unresponsive for 14 consecutive business days, the project is placed in Archive Status. Reactivating an archived project requires a $750 Rescheduling Fee and re-queuing into Agency’s next available sprint."'
      ]
    },
    callout: {
      label: 'Intellectual Property (IP) Leverage Clause',
      body: 'Include Clause 7.2: "All working files, source code, and deliverables remain the exclusive property of Agency until 100% of all principal invoices and Change Orders are paid in full."'
    }
  },
  {
    section: 'Module 08 • Anti-Scope-Creep & Kill-Fee Protocols',
    code: 'SOP-08 • Scope Defense',
    title: 'Anti-Scope-Creep Enforcement & Kill-Fee Contract Clauses',
    subtitle: 'Turn "quick favors" into high-margin Change Orders without damaging client rapport',
    intro: 'Scope creep rarely arrives as a demand; it arrives as a friendly Slack message: "Hey, while you’re in there, could we also quickly add..." Train your team to respond with enthusiastic warmth paired with an immediate Change Order price.',
    script: {
      title: 'The "Yes, And Here Is How We Queue It" Slack/Email Response Script',
      lines: [
        '"Hey [Name]! Love that idea—adding [Requested Feature] will definitely help boost [Goal]."',
        '"To keep our current launch deadline on track for [Date], we have two easy options:"',
        '"Option A: We swap out [Existing Unstarted Item of Equal Size] from Phase 2 and replace it with this at zero extra cost."',
        '"Option B: I can spin up a quick 1-page Change Order for $[X,XXX] (adds 4 business days) and slot it right after launch. Which works best for you?"'
      ]
    },
    table: {
      headers: ['Clause Name', 'Contractual Trigger', 'Financial & Operational Effect'],
      widths: [130, 176, 210],
      rows: [
        ['Kill-Fee / Early Termination', 'Client cancels after kickoff without cause', 'Deposit is non-refundable + 50% of remaining contract value due immediately'],
        ['Out-of-Scope Rate Card', 'Ad-hoc tasks approved via email/Slack', 'Billed at $195/hr in 2-hour minimum blocks on next invoice'],
        ['Rush / Weekend Turnaround', 'Client requests delivery inside <48h window', '+50% Urgency Multiplier applied to line-item cost'],
        ['Third-Party License Pass-Through', 'Fonts, APIs, plugins, stock media', 'Billed directly to Client credit card on file']
      ]
    }
  },
  {
    section: 'Module 09 • The 72-Hour Onboarding Workflow',
    code: 'SOP-09 • Rapid Activation',
    title: 'The 72-Hour Golden Window Onboarding Sequence',
    subtitle: 'Eliminate buyer’s remorse in the first 72 hours after payment with military-grade orchestration',
    intro: 'The moment a client wires a $5,000–$25,000 deposit, buyer’s remorse peaks. If they hear silence for two days, trust erodes. Execute this automated 72-hour sequence to make them feel they hired the most organized team on earth.',
    table: {
      headers: ['Timestamp', 'Owner', 'Action / Automation Trigger', 'Client-Facing Output'],
      widths: [95, 95, 176, 150],
      rows: [
        ['Hour 00:05', 'Automation', 'Stripe/Wire webhook fires Zapier/Make flow', 'Instant Receipt + Welcome Email #1'],
        ['Hour 00:15', 'Automation', 'Clone Notion Client Portal & Google Drive folder', 'Shared Portal Link + Asset Upload Vault'],
        ['Hour 02:00', 'Account Lead', 'Record 90-second personalized Loom video', 'Personal Welcome Video in Slack/Email'],
        ['Hour 24:00', 'Client SPOC', 'Complete Intake Questionnaire & credential handover', '1Password / LastPass Vault shared'],
        ['Hour 48:00', 'Project Mgr', 'Audit uploaded assets & confirm Kickoff Agenda', 'Pre-Kickoff Brief & Calendar Confirmation'],
        ['Hour 72:00', 'Full Team', 'Conduct 45-Minute Executive Kickoff Call', 'Approved Roadmap & Sprint 1 Live']
      ]
    },
    callout: {
      label: 'Zero-Touch Provisioning Stack',
      body: 'Connect PandaDoc/DocuSign -> Stripe -> Make.com -> Notion API + Slack API. Signing the contract should automatically create the client folder, Slack channel, and kickoff invite in 12 seconds.'
    }
  },
  {
    section: 'Module 10 • Welcome Email & Intake Templates',
    code: 'SOP-10 • Client Communications',
    title: 'Welcome Email Sequence & Pre-Kickoff Intake Questionnaire',
    subtitle: 'Copy-paste welcome dispatch and structured asset collection form',
    script: {
      title: 'Welcome Email #1 — Sent Immediately Upon Contract & Deposit Confirmation',
      lines: [
        '"Subject: Welcome aboard, [Company] — Your Client Portal & Next Steps [Action Required]"',
        '"Hi [First Name], thrilled to officially welcome [Company] to our roster! Your initial deposit is confirmed and our team is already provisioning your workspace."',
        '"To ensure our Kickoff Call on [Date/Time] is 100% strategic, please complete these 3 quick items by [Day before Kickoff]:"',
        '"1. Bookmark your Dedicated Client Portal: [Notion Link] (all timelines, deliverables & recordings live here)."',
        '"2. Upload your brand kit & technical credentials securely via our 1Password/Intake Vault: [Link]."',
        '"3. Confirm your Single Point of Contact (SPOC) who will approve milestone sign-offs."'
      ]
    },
    checklist: {
      title: 'Mandatory Pre-Kickoff Asset & Credential Collection Checklist',
      items: [
        { head: 'Brand & Design Assets', desc: 'Vector logos (.SVG/.EPS), typography files, hex color palette, and high-res photography.' },
        { head: 'Technical & Hosting Access', desc: 'DNS/Cloudflare admin, CMS/GitHub repo access, Google Analytics 4, and CRM API keys.' },
        { head: 'Historical Data & Benchmarks', desc: 'Past 12 months conversion metrics, top-performing campaigns, and customer avatars.' },
        { head: 'Compliance & Legal Guidelines', desc: 'Industry disclaimers, privacy policy requirements, and banned competitor claims.' }
      ]
    }
  },
  {
    section: 'Module 11 • Internal Provisioning & Portal Architecture',
    code: 'SOP-11 • Workspace Setup',
    title: 'Internal Workspace Provisioning & Notion Client Portal Blueprint',
    subtitle: 'Standardize folder nomenclature, permission tiers, and client-facing dashboards',
    intro: 'Never let clients hunt through email threads for links. Every client receives an identical, branded Notion (or ClickUp) Portal containing five core modules.',
    table: {
      headers: ['Portal Module', 'Contents & Widgets Included', 'Permission Level', 'Update Cadence'],
      widths: [115, 195, 106, 100],
      rows: [
        ['01. Command Center', 'Live milestone progress bar, SPOC directory, SLA rules', 'Client View Only', 'Real-time'],
        ['02. Deliverables Tracker', 'Kanban/Table of SOW items, Loom links, approval buttons', 'Client Comment/Approve', 'Daily'],
        ['03. Asset & Vault Hub', 'Brand guidelines, uploaded files, staging environment links', 'Client Edit/Upload', 'During Onboarding'],
        ['04. Weekly Pulse Logs', 'Every Friday status digest, KPI snapshots, next week goals', 'Client View Only', 'Fridays 3 PM'],
        ['05. Commercial & Legal', 'Signed MSA, SOW, paid invoices, approved Change Orders', 'Executive SPOC Only', 'Per Milestone']
      ]
    },
    checklist: {
      title: 'Internal Agency Folder Naming & Security SOP',
      items: [
        { head: 'Standard Folder Nomenclature', desc: 'Use [YYMM]-[ClientCode]-[ProjectCode] (e.g., 2610-ACME-WEB01) across Drive, Figma, and Git.' },
        { head: 'Zero Plaintext Passwords', desc: 'Never accept passwords via Slack or email; enforce 1Password shared vaults or Bitwarden Send.' },
        { head: 'Internal vs. External Separation', desc: 'Keep raw working files in internal folders; only link polished staging links in the Client Portal.' }
      ]
    }
  },
  {
    section: 'Module 12 • The 45-Minute Kickoff Call Run-of-Show',
    code: 'SOP-12 • Kickoff Execution',
    title: 'The 45-Minute Client Kickoff Call Agenda & Script',
    subtitle: 'Lock in communication boundaries, milestone sign-off rules, and Sprint 1 deliverables',
    intro: 'The Kickoff Call is not a brainstorming session—it is a governance alignment meeting. Use this exact run-of-show to train the client on how to be a dream client.',
    script: {
      title: 'Kickoff Call Boundary-Setting Script (Read Verbatim at Minute 15)',
      lines: [
        '"Before we dive into Phase 1 execution, let’s align on our working cadence so we hit your [Launch Date] deadline without a hitch:"',
        '"1. Communication Hours: We operate asynchronously inside your Portal and Slack between 9 AM and 5 PM EST, Mon–Fri. Emergency weekend requests carry a rush fee, so we plan ahead."',
        '"2. Consolidated Feedback: When we deliver a milestone via Loom, [SPOC Name] will gather internal team notes into one unified comment doc within 72 hours."',
        '"3. Protecting Your Timeline: If a new idea pops up mid-sprint, we’ll log it in the Phase 2 Backlog or quote a quick Change Order so we never derail your launch date."'
      ]
    },
    table: {
      headers: ['Minute Mark', 'Kickoff Agenda Segment', 'Lead Speaker', 'Output / Artifact Confirmed'],
      widths: [90, 176, 100, 150],
      rows: [
        ['00:00 – 05:00', 'Executive Welcome & North-Star KPI Recap', 'Account Lead', 'Confirmed 90-Day Success Metric'],
        ['05:00 – 15:00', 'Client Portal Tour & Asset Verification', 'Project Manager', 'All missing credentials flagged'],
        ['15:00 – 25:00', 'Communication Rules & Revision SLA Alignment', 'Account Lead', 'SPOC verbally agrees to 72h SLA'],
        ['25:00 – 40:00', 'Phase 1 Deep-Dive & Immediate Sprint Tasks', 'Technical Lead', 'First deliverable date locked'],
        ['40:00 – 45:00', 'Q&A and Weekly Cadence Confirmation', 'Project Manager', 'Kickoff Recap sent within 2 hours']
      ]
    }
  },
  {
    section: 'Module 13 • Async Communication & Weekly Status SOP',
    code: 'SOP-13 • Client Cadence',
    title: 'Asynchronous Communication Charter & Friday Status Digest',
    subtitle: 'Prevent "just checking in" emails by proactively sending structured Friday updates',
    intro: 'Clients only send anxious "Hey, what’s the status?" messages when they feel in the dark. Beat them to the punch every Friday before 3:00 PM with the 5-Bullet Friday Pulse Report.',
    script: {
      title: 'The "Friday 3 PM Pulse Report" Template (Slack / Email / Portal)',
      lines: [
        '"Subject: [Company] Weekly Pulse — Sprint [X] Status: [ON TRACK 🟢]"',
        '"Hi [First Name], here is your 60-second executive summary for the week ending [Date]:"',
        '"✅ COMPLETED THIS WEEK: (1) [Deliverable A — Link + 2-min Loom], (2) [Deliverable B — Approved]."',
        '"🔨 IN PROGRESS FOR NEXT WEEK: (1) [Task C — Target Delivery Wednesday], (2) [Task D]."',
        '"🚨 ACTION REQUIRED FROM YOU: Please approve [Deliverable A] in the Portal by Tuesday 5 PM so Sprint 2 stays on schedule."',
        '"Have a restful weekend! — [Your Name]"'
      ]
    },
    checklist: {
      title: 'The 3-Minute Loom Presentation Standard (Replace Meetings With Video)',
      items: [
        { head: '0:00–0:30 Context & Goal', desc: 'Remind the client which business KPI this specific deliverable solves.' },
        { head: '0:30–2:15 Strategic Walkthrough', desc: 'Show the work and explain WHY decisions were made (anchor to conversion/data).' },
        { head: '2:15–3:00 Explicit Feedback Prompt', desc: 'Tell them what to critique ("Please check factual accuracy in Section 2") and what is already locked.' }
      ]
    }
  },
  {
    section: 'Module 14 • Deliverable QA & Sign-Off Protocol',
    code: 'SOP-14 • Quality Assurance',
    title: 'Pre-Delivery QA Gate & Milestone Sign-Off Protocol',
    subtitle: 'Zero-defect internal inspection checklist before any link reaches the client',
    intro: 'Never allow a junior specialist to send unreviewed work directly to a client. Every deliverable must pass the Internal 10-Point QA Gate and ship with a formal Milestone Sign-Off form.',
    checklist: {
      title: 'Internal Pre-Flight QA Checklist (Required Before Sending to Client)',
      items: [
        { head: 'SOW Compliance Check', desc: 'Every specification listed in Schedule A for this milestone is 100% present.' },
        { head: 'Brand & Copy Audit', desc: 'Zero typos, broken links, placeholder "Lorem Ipsum", or wrong hex colors.' },
        { head: 'Mobile & Cross-Device Check', desc: 'Tested on 1440px desktop, 768px tablet, and 390px mobile viewports.' },
        { head: 'Loom Walkthrough Recorded', desc: 'Accompanied by a 3-minute strategic Loom explaining rationale and approval steps.' }
      ]
    },
    script: {
      title: 'Formal Milestone Sign-Off & Invoice Trigger Template',
      lines: [
        '"Subject: [Milestone #X Ready for Sign-Off] — [Deliverable Name]"',
        '"Hi [First Name], excited to share the completed [Milestone Name]! Watch my 3-minute walkthrough here: [Loom Link] and inspect the live build here: [Link]."',
        '"Per our SOW, please reply ‘APPROVED’ or submit your consolidated revision notes inside the Portal by [Date + 3 Business Days]. Upon sign-off, Milestone Invoice #[X] will be issued and we will immediately unlock Phase [X+1]."'
      ]
    }
  },
  {
    section: 'Module 15 • Change Order Form & Pricing Calculator',
    code: 'SOP-15 • Revenue Expansion',
    title: 'Standardized Change Order (CO) Template & Pricing Formula',
    subtitle: 'Monetize scope additions cleanly with a 1-page mini-contract',
    intro: 'A well-run agency generates 18%–25% additional contract revenue purely from structured Change Orders. Keep this 1-page template ready in PandaDoc/DocuSign.',
    table: {
      headers: ['Change Order Field', 'Standardized Specification / Entry'],
      widths: [160, 356],
      rows: [
        ['Change Order Reference', 'CO-[YYYY]-[00X] attached to Master Services Agreement dated [Date]'],
        ['Requested Addition', 'Detailed description of new feature, page, workflow, or integration'],
        ['Excluded / Unchanged', 'All other terms and exclusions of original SOW remain in full effect'],
        ['Timeline Impact', 'Adds [X] business days to Phase [Y] and shifts Final Launch Date to [New Date]'],
        ['Change Order Fee', '$[X,XXX] flat fee (100% due upon Change Order signature before work begins)'],
        ['Expiration Window', 'Valid for 5 business days; requires digital signature of Client SPOC']
      ]
    },
    callout: {
      label: 'Change Order Pricing Formula',
      body: 'CO Price = (Estimated Specialist Hours × Internal Cost × 3.2 Margin Multiplier) + 15% Project Management Overhead. Minimum Change Order floor: $750.'
    }
  },
  {
    section: 'Module 16 • Escalation & Difficult Client De-Escalation',
    code: 'SOP-16 • Crisis Management',
    title: 'Client Escalation Matrix & Boundary Recovery Scripts',
    subtitle: 'Word-for-word scripts to handle missed client deadlines, scope pushback, and late payments',
    script: {
      title: '3 High-Stakes De-Escalation Scripts',
      lines: [
        'SCENARIO A — CLIENT GHOSTS FOR 7+ DAYS: "Hi [Name], we haven’t heard back on [Milestone] since [Date]. To protect your team’s launch quality, we are pausing active sprint capacity today at 5 PM. Whenever you’re ready to resume, let us know and we’ll re-slot your timeline!"',
        'SCENARIO B — CLIENT SENDS PIECEMEAL SLACK EDITS: "Hi [Name], caught your 4 Slack notes! To make sure zero details slip through the cracks, I’ve pasted them into your Consolidated Revision Doc [Link]. Let me know once your team finishes adding final notes and we will execute the full batch at once."',
        'SCENARIO C — INVOICE OVERDUE BY 5 DAYS: "Hi [Name], friendly heads-up that Invoice #[X] is 5 days past due. Per our automated billing system, staging environments and active sprints pause at Day 7. Here is the direct payment link [Link] so we don’t lose a single day of momentum."'
      ]
    },
    table: {
      headers: ['Friction Level', 'Trigger Event', 'Owner', 'Mandatory Action Within 24h'],
      widths: [100, 166, 95, 155],
      rows: [
        ['Level 1: Yellow', 'Client misses feedback SLA by 48h', 'Project Mgr', 'Send Timeline Shift Notice email'],
        ['Level 2: Orange', 'Client disputes out-of-scope CO', 'Account Lead', '15-min diagnostic call + SOW review'],
        ['Level 3: Red', 'Invoice >7 days overdue or abusive tone', 'Agency Founder', 'Immediate work freeze + formal notice']
      ]
    }
  },
  {
    section: 'Module 17 • Project Offboarding & Technical Handover',
    code: 'SOP-17 • Clean Offboarding',
    title: 'Executive Offboarding Checklist & Final Handover Packet',
    subtitle: 'Leave a 5-star final impression while cleanly terminating free post-launch support',
    intro: 'How you end a project determines whether the client refers three peers or drains your team with six months of unpaid "quick questions." Deliver a formal Executive Handover Packet.',
    checklist: {
      title: '12-Point Project Offboarding & Asset Transfer Checklist',
      items: [
        { head: 'Final Invoice Cleared', desc: 'Verify 100% of principal milestones and Change Orders are paid in full before transferring ownership.' },
        { head: 'Master Handover Manual', desc: 'Compile final URLs, Figma source files, GitHub repos, and CMS admin links in one PDF.' },
        { head: 'Custom SOP Loom Library', desc: 'Record 3–5 short Loom videos showing the client’s team how to edit text, images, and settings.' },
        { head: 'Credential & API Rotation', desc: 'Transfer billing ownership of domains/plugins to Client card and revoke temporary agency tokens.' },
        { head: 'Warranty Window Notice', desc: 'State clearly when the 14-day bug-fix window expires and how ongoing support is billed.' }
      ]
    },
    callout: {
      label: 'Post-Launch Warranty Boundary',
      body: 'Include in the Handover Email: "Your 14-day post-launch bug warranty runs through [Date]. After [Date], any edits, updates, or troubleshooting require an active Growth Retainer or $750 Maintenance Block."'
    }
  },
  {
    section: 'Module 18 • Testimonial & Case Study Extraction Engine',
    code: 'SOP-18 • Social Proof Engine',
    title: 'High-Converting Testimonial & ROI Case Study Request Templates',
    subtitle: 'Capture quantifiable video and written proof at the exact moment of peak client euphoria',
    intro: 'Never ask "Would you mind writing us a testimonial?" Clients are busy and write generic praise ("Great to work with!"). Give them a structured 4-question prompt or a pre-drafted paragraph to approve in 30 seconds.',
    script: {
      title: 'The "Approve-or-Edit in 30 Seconds" Testimonial Request Email',
      lines: [
        '"Subject: Quick favor + celebrating [Company]’s launch 🚀"',
        '"Hi [First Name], it’s been a privilege building [Project] with you. Seeing [Metric/Result] already moving is huge."',
        '"We’re updating our portfolio and I’d love to feature [Company]. Since I know your schedule is packed, I drafted a quick quote below based on our results—feel free to tweak a word or just reply ‘Approved to use!’"',
        '"DRAFT QUOTE: ‘Before hiring [Agency], we struggled with [Problem]. Within [X] weeks, their team delivered [Solution], which helped us achieve [Specific Metric/Result]. Easily the most organized partner we’ve worked with.’"',
        '"(Bonus: If you have 60 seconds to read that on a quick phone video via [Senja/VideoAsk Link], I’ll send a $[100] gift card for your team’s lunch!)"'
      ]
    },
    table: {
      headers: ['Case Study Section', 'Data Point to Extract', 'Where to Deploy'],
      widths: [130, 210, 176],
      rows: [
        ['1. The Baseline', 'Revenue/conversion rate before hiring us', 'Proposal Deck Slide 4'],
        ['2. The Bottleneck', 'Why internal efforts failed previously', 'Discovery Call Objection Handler'],
        ['3. The Architecture', '3 specific steps our agency implemented', 'Website Case Study Page'],
        ['4. The Quantified ROI', '+X% lift, $Y added revenue, Z hours saved', 'LinkedIn & Cold Email Hook']
      ]
    }
  },
  {
    section: 'Module 19 • Retainer Conversion & Referral Flywheel',
    code: 'SOP-19 • LTV Expansion',
    title: 'Project-to-Retainer Upsell Script & B2B Referral Engine',
    subtitle: 'Convert 40%+ of one-off projects into predictable Monthly Recurring Revenue (MRR)',
    intro: 'Acquiring a new agency client costs 6x more than retaining an existing one. Pitch your recurring Optimization Retainer during the Offboarding Call while pointing to Phase 2 growth opportunities.',
    script: {
      title: 'The Offboarding-to-Retainer Transition Script',
      lines: [
        '"Now that Phase 1 is live, the biggest mistake we see companies make is treating [Asset/System] as static while competitors iterate monthly."',
        '"During our build, we logged 6 high-leverage Phase 2 opportunities in your Backlog—including [Item A] and [Item B]—that should add another [X%] to conversion."',
        '"Instead of scoping a brand-new project later, most clients move onto our $[2,500]/mo Growth Partner Retainer. It gives you [X] dedicated sprint hours every month, priority 24h SLA, and continuous split-testing. Want to lock in one of our 2 retainer slots for next month?"'
      ]
    },
    checklist: {
      title: 'The 30-Day Post-Launch Referral Trigger System',
      items: [
        { head: 'Day 30 Check-In Audit', desc: 'Send a 2-minute Loom reviewing their first 30 days of live metrics with 2 quick optimization tips.' },
        { head: 'The Specific Referral Ask', desc: 'Ask: "Who is one founder in your network currently dealing with [Exact Problem You Solved]?"' },
        { head: 'Partner Bounty Structure', desc: 'Offer a 10% cash referral commission or $1,000 service credit for every closed intro.' }
      ]
    }
  },
  {
    section: 'Module 20 • Agency Operations KPI Scorecard',
    code: 'SOP-20 • Executive Governance',
    title: 'Weekly Agency Operations & Margin Health Scorecard',
    subtitle: 'Track utilization, effective hourly rate (EHR), and onboarding velocity like a $5M consultancy',
    intro: 'Review these 6 operational metrics every Monday morning. If any metric dips into the Red Zone for two consecutive weeks, trigger the corresponding corrective SOP immediately.',
    table: {
      headers: ['Agency KPI Metric', 'Formula / Calculation', 'Healthy Target', 'Red Zone Trigger -> Corrective SOP'],
      widths: [120, 145, 95, 156],
      rows: [
        ['Effective Hourly Rate', 'Project Fee ÷ Total Team Hours', '> $175 / hr', '< $110/hr -> Audit unbilled scope creep (SOP-08)'],
        ['Proposal Win Rate', 'Signed Contracts ÷ Proposals Sent', '35% – 50%', '< 25% -> Tighten Pre-Call Triage (SOP-02)'],
        ['Onboarding Velocity', 'Contract Signed to Kickoff Complete', '< 72 Hours', '> 5 Days -> Automate Portal Setup (SOP-09)'],
        ['Change Order Yield', 'CO Revenue ÷ Base Contract Value', '15% – 25%', '< 5% -> Train PMs on CO Script (SOP-15)'],
        ['Retainer Conversion', 'Clients Moving to MRR ÷ Completed', '> 35%', '< 20% -> Pitch Retainer at Day 21 (SOP-19)'],
        ['Client NPS / Proof', 'Approved Case Studies ÷ Projects', '> 80%', '< 50% -> Send Pre-Drafted Quote (SOP-18)']
      ]
    },
    callout: {
      label: '90-Day Implementation Roadmap',
      body: 'Week 1: Install Intake Form & Discovery Script. Week 2: Deploy 3-Tier Proposal & SOW Clauses. Week 3: Build Notion Portal & 72-Hour Automation. Week 4: Enforce Friday Pulse & Change Order Rules.'
    }
  }
];

// ============================================================================
// 2. EXECUTIVE CAREER & INTERVIEW KIT (23 Pages)
// ============================================================================
const careerTheme = {
  dark: '#090d16',
  primary: '#0f766e',
  accent: '#eab308',
  shortTitle: 'ATS Resume, LinkedIn & STAR Interview Vault',
  title: 'ATS-OPTIMIZED RESUME BLUEPRINT, LINKEDIN HEADHUNTER MAGNET & 50 STAR INTERVIEW ANSWERS VAULT',
  subtitle: 'Executive Career Acceleration Manual: Quantifiable Bullet Formulas, High-Impact Action Verbs Bank, 50 Behavioral Answers, +15–30% Salary Negotiation Scripts & 90-Day Onboarding Plan',
  badge: 'Executive Career Vault • v5.0',
  edition: 'Complete Career & Compensation Acceleration Kit • Engineered for Senior IC, Staff, Manager, Director & VP Candidates.',
  footerText: 'Executive Career & Interview Mastery Vault • ATS Engineering, STAR Frameworks & Compensation Negotiation',
  stats: [
    { label: 'ATS Parsing Architecture', val: 'Workday, Greenhouse & Lever Keyword Density & Layout Blueprint' },
    { label: 'Quantifiable Impact Formulas', val: '180+ Executive Action Verbs & XYZ Revenue/Efficiency Bullet Builders' },
    { label: 'LinkedIn Inbound Engine', val: 'Recruiter Search Boolean Optimization, Headline Formulas & DM Scripts' },
    { label: '50 STAR Answer Vault', val: 'Battle-Tested Behavioral Stories for Leadership, Conflict, Failure & Scale' },
    { label: 'Compensation Negotiation', val: 'Counter-Offer Scripts (+15% to +30%) & First 90-Day Executive Plan' }
  ]
};

const careerPages = [
  {
    section: 'Module 01 • ATS Parsing Science & Architecture',
    code: 'CAREER-01 • ATS Reverse Engineering',
    title: 'How Enterprise ATS Algorithms Parse, Score & Rank Resumes',
    subtitle: 'Beat Workday, Greenhouse, Lever, and Taleo filters before a human recruiter spends 6 seconds scanning',
    intro: 'Over 78% of executive and senior-level resumes are rejected or buried not because the candidate lacks experience, but because multi-column layouts, graphics, or missing taxonomy keywords break optical and lexical parsing engines.',
    table: {
      headers: ['ATS Platform', 'Parsing Mechanism', 'Fatal Formatting Traps to Avoid', 'Target Match Score'],
      widths: [105, 145, 176, 90],
      rows: [
        ['Workday', 'Strict chronological block parser', 'Tables, text boxes, dates on left margin', '80%+ Exact Terms'],
        ['Greenhouse', 'Semantic keyword + recruiter scorecard', 'Creative section headers ("My Journey")', '75%+ Core Skills'],
        ['Lever', 'Full-text indexing + recency weighting', 'Keyword stuffing in footer without context', 'Top 3 Recent Roles'],
        ['Taleo / iCIMS', 'Legacy regex & exact-phrase matching', 'Acronyms without spelled-out equivalents', '85%+ Exact Match']
      ]
    },
    checklist: {
      title: 'The 6-Second F-Pattern Human Recruiter Scan Rules',
      items: [
        { head: 'Single-Column Hierarchy', desc: 'Use 100% single-column layout with standard headers: Summary, Core Competencies, Experience, Education.' },
        { head: 'Dual-Format Acronyms', desc: 'Write both forms at least once: "Search Engine Optimization (SEO)" or "Profit & Loss (P&L) Management".' },
        { head: 'Top-Third Density', desc: 'Place your Executive Summary and 12-Keyword Competency Matrix in the top 35% of Page 1.' },
        { head: 'File Format Standard', desc: 'Submit clean text-selectable PDF or .DOCX named Firstname_Lastname_TargetRole.pdf.' }
      ]
    }
  },
  {
    section: 'Module 02 • The 1-Page & 2-Page ATS Resume Blueprint',
    code: 'CAREER-02 • Visual Wireframe',
    title: 'Executive ATS Resume Structural Blueprint & Typography Rules',
    subtitle: 'Line-by-line anatomical specification for maximum machine readability and executive authority',
    script: {
      title: 'Exact Resume Header & Executive Value Proposition Wireframe',
      lines: [
        'FIRSTNAME LASTNAME | City, State | Phone | Email | linkedin.com/in/handle | Portfolio/GitHub',
        '----------------------------------------------------------------------------------------------------',
        'TARGET ROLE TITLE: SENIOR PRODUCT MANAGER | FINTECH, PAYMENTS & AI PLATFORM SCALE',
        'Executive Summary: Revenue-focused Product Leader with 8+ years scaling B2B SaaS platforms from $12M to $65M ARR. Proven track record leading 35+ cross-functional engineers, cutting churn by 28%, and launching 4 category-defining products.',
        'Core Competencies: Product Strategy • P&L Ownership ($50M+) • Enterprise SaaS • Agile/Scrum • GTM Execution • SQL & Amplitude • API Monetization • Cross-Functional Leadership • M&A Integration'
      ]
    },
    table: {
      headers: ['Resume Zone', 'Space Allocation', 'Font & Sizing Standard', 'Strategic Purpose'],
      widths: [115, 105, 140, 156],
      rows: [
        ['Contact Bar', '3 Lines Max', '10pt Sans-Serif (Inter/Calibri)', 'Zero-friction recruiter outreach'],
        ['Headline & Hook', '4–5 Lines', '12pt Bold Title + 10pt Body', 'Anchor exact target job title + ROI'],
        ['Core Competencies', '3 Rows × 4 Cols', '9.5pt Bullet Separated Text', 'Capture 90% of ATS keyword queries'],
        ['Recent Experience', '60% of Total Page', '10.5pt Role Header / 10pt Bullets', 'Prove quantified impact in last 5 yrs'],
        ['Early Career / Edu', '15% of Total Page', '9.5pt Compact Single-Line', 'Demonstrate pedigree without bloat']
      ]
    }
  },
  {
    section: 'Module 03 • Quantifiable Bullet Point Engineering',
    code: 'CAREER-03 • Impact Formulas',
    title: 'The XYZ & CAR Quantifiable Bullet Point Formulas',
    subtitle: 'Transform passive job descriptions ("Responsible for...") into high-impact revenue & efficiency proof',
    intro: 'Weak resumes list duties; elite resumes prove business outcomes. Every bullet point under your last two roles must follow the Google XYZ Formula: Accomplished [X] as measured by [Y], by doing [Z].',
    table: {
      headers: ['Weak Duty-Based Bullet (Before)', 'Executive Quantified Bullet (After Using XYZ Formula)'],
      widths: [196, 320],
      rows: [
        ['Responsible for managing enterprise client accounts and improving retention.', 'Expanded $18.4M enterprise portfolio net dollar retention (NDR) from 94% to 118% across 42 accounts by instituting quarterly executive ROI reviews.'],
        ['Helped engineering team speed up deployment pipeline and fix bugs.', 'Accelerated CI/CD deployment velocity by 64% (from 3.5 hrs to 75 mins) and cut production Sev-1 incidents by 41% via automated Kubernetes canary testing.'],
        ['Handled paid marketing campaigns and lowered customer acquisition cost.', 'Scaled paid acquisition pipeline from $1.2M to $5.8M ARR in 9 months while reducing CAC by 31% through multi-touch attribution restructuring.'],
        ['Led onboarding for new sales reps and created training docs.', 'Compressed new AE ramp time from 5.5 months to 8 weeks (+40% quota attainment) by authoring a 12-module MEDDIC sales playbook.']
      ]
    },
    callout: {
      label: 'How to Quantify When You Don’t Have Exact Revenue Numbers',
      body: 'Use Proxy Metrics: (1) Time Saved (hours/week × team size), (2) Cycle Compression (days reduced), (3) Volume/Scale (users, transactions, regions supported), or (4) Error/Ticket Reduction (% decrease).'
    }
  },
  {
    section: 'Module 04 • High-Impact Executive Action Verbs Bank',
    code: 'CAREER-04 • Lexical Power Bank',
    title: '160+ High-Impact Executive Action Verbs Categorized by Function',
    subtitle: 'Eliminate weak verbs ("Helped", "Worked on", "Managed") and never repeat a lead verb twice on one page',
    table: {
      headers: ['Revenue & Growth', 'Leadership & Scale', 'Operations & Efficiency', 'Architecture & Innovation'],
      widths: [129, 129, 129, 129],
      rows: [
        ['Accelerated', 'Spearheaded', 'Streamlined', 'Architected'],
        ['Monetized', 'Orchestrated', 'Automated', 'Pioneered'],
        ['Captured', 'Mobilized', 'Consolidated', 'Engineered'],
        ['Expanded', 'Mentored', 'Standardized', 'Re-platformed'],
        ['Outperformed', 'Championed', 'Overhauled', 'Conceptualized'],
        ['Negotiated', 'Unified', 'Eliminated', 'Modernized'],
        ['Compounded', 'Recruited', 'Compressed', 'Deployed'],
        ['Generated', 'Aligned', 'Restructured', 'Institutionalized'],
        ['Maximized', 'Cultivated', 'Optimized', 'Synthesized'],
        ['Revitalized', 'Empowered', 'De-risked', 'Commercialized']
      ]
    },
    checklist: {
      title: 'Lexical Audit Rules Before Submitting Any Resume',
      items: [
        { head: 'Zero Repetition Rule', desc: 'Within a single role block (4–6 bullets), every bullet must begin with a distinct action verb.' },
        { head: 'Ban Passive Prefixes', desc: 'Delete "Responsible for", "Tasked with", "Assisted in", and "Served as" from the entire document.' },
        { head: 'Match Seniority Tier', desc: 'IC roles emphasize Architected/Engineered/Executed; Director+ roles emphasize Spearheaded/Scaled/P&L.' }
      ]
    }
  },
  {
    section: 'Module 05 • LinkedIn Headhunter Magnet System',
    code: 'CAREER-05 • Inbound Recruiter SEO',
    title: 'LinkedIn Recruiter Algorithm & Inbound Headhunter Optimization',
    subtitle: 'Rank on Page 1 of LinkedIn Recruiter Boolean searches so executive headhunters DM you weekly',
    intro: 'Executive recruiters pay $10,000+/yr for LinkedIn Recruiter seats and search using weighted fields: (1) Current/Past Job Titles, (2) Headline Keywords, (3) Skills Tag Bank, and (4) About Section density.',
    script: {
      title: 'High-Converting LinkedIn Headline & About Section Blueprint',
      lines: [
        'HEADLINE FORMULA: [Target Role] | [Core Specialty 1] & [Core Specialty 2] | [Quantified Proof Point] | [Industry/Tech]',
        'EXAMPLE HEADLINE: Director of Engineering | Distributed Cloud & FinTech Infrastructure | Scaled Systems from 1M to 40M Daily Txns | Go, AWS, Kubernetes',
        'ABOUT SECTION HOOK (First 3 Lines): "I build and scale high-availability engineering organizations that turn complex technical bottlenecks into competitive moat. Over the past 9 years at [Company A] and [Company B], I have led 45+ engineers and delivered $32M+ in platform efficiency."',
        'SKILLS PINNING RULE: Pin your top 3 hard skills that match 90% of target job descriptions and secure 5+ peer endorsements on each.'
      ]
    },
    checklist: {
      title: 'Stealth "Open to Work" & Recruiter Visibility Settings',
      items: [
        { head: 'Recruiters-Only Signal', desc: 'Enable "Open to Work" visible ONLY to LinkedIn Recruiter license holders (no green banner needed).' },
        { head: '5 Target Job Titles', desc: 'Populate all 5 title slots with exact variations (e.g., Head of Product, VP Product, Principal PM).' },
        { head: 'Custom URL & Banner', desc: 'Clean URL (linkedin.com/in/firstname-lastname) + custom 1584x396 authority banner showing core metrics.' }
      ]
    }
  },
  {
    section: 'Module 06 • Cold Outreach & Referral Extraction Scripts',
    code: 'CAREER-06 • Hidden Job Market',
    title: 'Hiring Manager Outreach & Internal Referral Extraction Scripts',
    subtitle: 'Bypass the 500-applicant portal queue with high-response LinkedIn DMs and executive emails',
    intro: 'Referred candidates are 14x more likely to receive an interview than cold portal applicants. Never apply to a top-choice role without simultaneously sending a Hiring Manager Value Note and an Insider Referral DM.',
    script: {
      title: '3 High-Response Outreach Templates (42%+ Reply Rate)',
      lines: [
        '1. HIRING MANAGER DIRECT NOTE: "Hi [Name], noticed you’re scaling the [Team Name] org to tackle [Recent Company Initiative/News]. In my current role at [Company], I led our [Similar Initiative]—cutting [Metric] by [X%] and adding $[Y]M in pipeline. I put together a 1-page breakdown of how I’d approach [Target Role]’s first 60 days. Open to me sending it over?"',
        '2. PEER REFERRAL REQUEST: "Hi [Name], saw your transition from [Past Co] to [Target Co]—impressive work on [Project]. I’m preparing to apply for the [Role Title] opening on [Manager]’s team. Since my background in [Skill X + Y] aligns closely, would you be open to a 7-minute chat or dropping a referral link if it feels like a strong fit?"',
        '3. EXECUTIVE HEADHUNTER PITCH: "Hi [Name], I specialize in [Domain] leadership (scaled [Metric] from X to Y at [Company]). I’m selectively exploring [Role Level] opportunities for Q[X] and attached my executive brief in case it aligns with any retained searches on your desk."'
      ]
    },
    callout: {
      label: 'The "Apply + DM Within 4 Hours" Rule',
      body: 'Set LinkedIn job alerts for "Past 24 Hours". Submit your ATS-optimized resume within the first 35 applicants, then immediately send Template #1 to the likely Hiring Manager via Apollo.io/LinkedIn.'
    }
  },
  {
    section: 'Module 07 • The STAR+L Behavioral Interview Architecture',
    code: 'CAREER-07 • Interview Science',
    title: 'Mastering the STAR+L Framework & The 8 Story Matrix',
    subtitle: 'Why standard STAR answers fail at senior levels—and how adding the "+L" (Leadership Leverage) wins offers',
    intro: 'Mid-level candidates stop at Results (STAR). Senior and Executive candidates win by adding the 5th pillar: "+L" (Long-term Systemic Leverage—how you turned a one-time win into an organization-wide SOP or architecture).',
    table: {
      headers: ['STAR+L Pillar', 'Time Share (2-Min Answer)', 'What to Communicate', 'Fatal Mistake to Avoid'],
      widths: [105, 110, 165, 136],
      rows: [
        ['S — Situation', '10% (12 Seconds)', 'Company stage, stakes & business context', 'Spending 60s on backstory'],
        ['T — Task', '10% (12 Seconds)', 'Specific bottleneck & quantifiable goal', 'Sounding like a passive observer'],
        ['A — Action', '45% (55 Seconds)', '3 decisive steps YOU took ("I", not "We")', 'Hiding behind "We did X"'],
        ['R — Result', '20% (24 Seconds)', 'Before vs. After metrics ($ / % / Time)', 'Vague outcome ("It went well")'],
        ['+L — Leverage', '15% (17 Seconds)', 'How you institutionalized the learning', 'Stopping without strategic takeaway']
      ]
    },
    script: {
      title: 'The "Tell Me About Yourself" 90-Second Executive Pitch Formula',
      lines: [
        '"1. PRESENT ANCHOR (25s): I’m a [Role] with [X] years scaling [Domain]. Currently at [Company], I lead [Scope] where we recently achieved [Top Quantified Win]."',
        '"2. PAST PROOF (35s): Prior to that at [Company B], I spearheaded [Initiative], growing [Metric] by [X%]. Across my career, the common thread has been stepping into high-growth ambiguity and building repeatable execution engines."',
        '"3. FUTURE ALIGNMENT (30s): That’s exactly why [Target Company]’s push into [Strategic Goal] caught my attention—I’m excited to bring that exact playbook here."'
      ]
    }
  },
  {
    section: 'Module 08 • 50 STAR Answers Vault (1–8: Leadership & Vision)',
    code: 'CAREER-08 • STAR Vault Part 1',
    title: 'STAR+L Vault #1–8: Executive Leadership, Vision & Team Scaling',
    subtitle: 'Battle-tested answer blueprints for leadership, organizational alignment, and culture transformation',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['01', 'Led a team through ambiguity', 'Created 30-60-90 clarity charter & weekly KPI war-room', 'Hit 108% Q3 goal; framework adopted across 4 sibling teams'],
        ['02', 'Elevated an underperforming team', 'Audited skill gaps, replaced vanity metrics with output SLAs', 'Productivity +42% in 60 days; zero regrettable attrition'],
        ['03', 'Pushed back on executive mandate', 'Built data model showing $1.4M risk & pitched alternative', 'Execs pivoted to my Phase 1 pilot; saved 4 mos dev time'],
        ['04', 'Scaled hiring without lowering bar', 'Designed structured rubric + work-sample simulation', 'Hired 14 seniors in 90 days; 93% 1-year retention rate'],
        ['05', 'Drove cross-functional alignment', 'Established shared OKR dependency board across Prod/Sales', 'Cut launch delays by 55% and boosted GTM adoption 3x'],
        ['06', 'Managed organizational restructuring', 'Held 1:1 retention mapping & transparent role charters', 'Retained 100% of top-quartile talent during M&A merge'],
        ['07', 'Mentored IC into leadership role', 'Delegated P&L sub-stream with bi-weekly shadow coaching', 'Promoted 2 leads to Manager within 11 months'],
        ['08', 'Set 12-month strategic roadmap', 'Ran RICE scoring against customer churn & ARR impact', 'Delivered $6.2M net-new ARR from top 3 roadmap bets']
      ]
    },
    callout: {
      label: 'Customization Rule',
      body: 'Swap the bracketed numbers with your real project metrics while keeping the exact structural arc (Ambiguity -> Decisive Framework -> Hard Metric -> Org-Wide Adoption).'
    }
  },
  {
    section: 'Module 09 • 50 STAR Answers Vault (9–16: Conflict & Stakeholders)',
    code: 'CAREER-09 • STAR Vault Part 2',
    title: 'STAR+L Vault #9–16: Stakeholder Alignment & Conflict Resolution',
    subtitle: 'Prove high emotional intelligence (EQ) and data-backed persuasion under pressure',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['09', 'Resolved conflict with peer leader', 'Moved debate from opinions to shared customer revenue KPI', 'Co-authored joint sprint; delivered project 2 weeks early'],
        ['10', 'Handled a hostile/escalated client', 'Ran root-cause audit, owned gap on call, shipped 48h fix', 'Saved $420K renewal and converted account into case study'],
        ['11', 'Persuaded skeptical engineering/sales', 'Built working prototype / pilot cohort with 5 beta users', '80% pilot conversion convinced leadership to fund full build'],
        ['12', 'Said "No" to a high-value request', 'Quantified opportunity cost using RICE matrix + offered Phase 2', 'Protected core Q4 launch ($3M ARR) without losing rapport'],
        ['13', 'Aligned global/remote timezones', 'Replaced live status meetings with Loom + RFC decision docs', 'Cut meeting load by 35% and sped up sign-offs by 2 days'],
        ['14', 'Managed scope creep mid-project', 'Triggered formal trade-off matrix (Swap vs. Extend vs. Add)', 'Delivered 100% of core scope on budget with 2 paid add-ons'],
        ['15', 'Broke a deadlock in committee', 'Introduced "Disagree and Commit" 14-day reversible test', 'Test proved winner in 9 days; unlocked 3-month stalemate'],
        ['16', 'Rebuilt trust after team missed SLA', 'Instituted Friday pulse digest & early-warning red-flag rules', 'Hit 12 consecutive on-time sprints following overhaul']
      ]
    },
    script: {
      title: 'Golden Phrase to Use in Every Conflict Question',
      lines: [
        '"Whenever I encounter stakeholder friction, I assume both parties want the company to win but are optimizing for different local metrics. My first step is to get out of slack/email, put our shared North-Star metric on the whiteboard, and turn a personal disagreement into a data trade-off."'
      ]
    }
  },
  {
    section: 'Module 10 • 50 STAR Answers Vault (17–24: Failure, Crisis & Pivot)',
    code: 'CAREER-10 • STAR Vault Part 3',
    title: 'STAR+L Vault #17–24: Failure Recovery, Crisis & High-Stakes Pivots',
    subtitle: 'How to answer "Tell me about your biggest failure" without disqualifying yourself',
    intro: 'Never give a fake weakness ("I work too hard") or a fatal flaw ("I missed a compliance law"). Choose a calculated operational miss from 2–3 years ago, own it 100% in 20 seconds, and spend 80% of the answer on the safeguard system you built afterward.',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['17', 'Biggest professional failure/miss', 'Launched feature with strong tech but weak onboarding UX', 'Pivoted within 14 days; built mandatory 5-user beta gate'],
        ['18', 'Made decision with 40% of data', 'Classified as Type-2 (reversible) decision & launched canary', 'Captured market window 6 weeks ahead of chief competitor'],
        ['19', 'Led through production outage/crisis', 'Commanded incident bridge, isolated rollback in 18 mins', '99.98% uptime restored; authored blameless post-mortem SOP'],
        ['20', 'Project budget/resources cut 40%', 'Ruthlessly cut bottom 60% features to protect 80% value core', 'Delivered MVP on original date; achieved 92% of revenue goal'],
        ['21', 'Missed a hard deadline', 'Flagged risk 10 days early, negotiated phased rollout', 'Core workflow went live on Day 1; phase 2 followed 5 days later'],
        ['22', 'Inherited a broken legacy project', 'Conducted 72h forensic audit, froze scope, cleared top 5 bugs', 'Stabilized churn from 4.2% to 1.1% within one quarter'],
        ['23', 'Pivoted strategy mid-quarter', 'Spotted macro shift in cohort data; reallocated 60% budget', 'Generated $1.9M from new channel while competitors lagged'],
        ['24', 'Received tough critical feedback', 'Thanked VP for candor, built 30-day behavioral scorecard', 'Rated #1 communicator on next 360-degree executive review']
      ]
    }
  },
  {
    section: 'Module 11 • 50 STAR Answers Vault (25–33: Execution & Velocity)',
    code: 'CAREER-11 • STAR Vault Part 4',
    title: 'STAR+L Vault #25–33: Operational Excellence, Speed & Prioritization',
    subtitle: 'Demonstrate bias for action, ruthless prioritization, and process automation',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['25', 'Prioritized 10 competing demands', 'Implemented Impact × Confidence ÷ Effort (ICE) scoring', 'Shipped top 3 revenue drivers; increased quarterly yield 34%'],
        ['26', 'Automated a manual bottleneck', 'Mapped 14-step workflow and replaced with API/script pipeline', 'Saved 220 team hours/month ($165K annual payroll capacity)'],
        ['27', 'Delivered under impossible deadline', 'Ran parallel workstreams & daily 10-min blocker standups', 'Launched regulatory update 3 days ahead of legal cutoff'],
        ['28', 'Improved quality while moving fast', 'Embedded automated pre-flight QA gates into sprint Definition', 'Cut post-release defects by 61% while increasing ship rate'],
        ['29', 'Cut operational costs significantly', 'Audited SaaS/cloud vendor utilization & renegotiated tiers', 'Reduced annual run-rate spend by $340K with zero downtime'],
        ['30', 'Built a process from 0 to 1', 'Documented v1 SOP in Notion, tested on 3 projects, refined', 'Reduced onboarding ramp of new hires from 6 weeks to 12 days'],
        ['31', 'Scaled system 10x without headcount', 'Replaced manual triage with self-serve tiering & templates', 'Handled 4.5x client volume with the exact same 6-person team'],
        ['32', 'Identified a hidden bottleneck', 'Analyzed funnel drop-off logs; found step-3 auth friction', '1-line UX fix lifted checkout conversion by +14.8% ($2.1M/yr)'],
        ['33', 'Managed complex vendor migration', 'Ran dual-write shadow testing for 14 days before cutover', 'Zero-data-loss migration of 1.2M records over a single weekend']
      ]
    },
    callout: {
      label: 'Bias-for-Action Framing',
      body: 'Highlight Type-1 (irreversible, slow) vs. Type-2 (reversible, fast) decision making. Hiring managers love candidates who move at high speed on reversible decisions.'
    }
  },
  {
    section: 'Module 12 • 50 STAR Answers Vault (34–42: Growth, Data & Innovation)',
    code: 'CAREER-12 • STAR Vault Part 5',
    title: 'STAR+L Vault #34–42: Commercial Acumen, Analytics & Innovation',
    subtitle: 'Prove you think like a business owner who connects daily work to P&L outcomes',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['34', 'Used data to uncover an insight', 'Segmented retention cohorts by activation actions in Day 7', 'Found key habit trigger; boosted 90-day retention by +22%'],
        ['35', 'Launched a new product/revenue line', 'Interviewed 25 churned/power users, pre-sold 8 pilot seats', 'Scaled add-on module to $1.4M ARR within first 2 quarters'],
        ['36', 'Turned around declining KPI', 'Diagnosed leaky mid-funnel stage and rebuilt nurture sequence', 'Recovered 19% pipeline velocity within 45 days'],
        ['37', 'Introduced AI/automation workflow', 'Integrated LLM triage & drafting assistant with human QA loop', 'Cut ticket resolution time by 52% while CSAT rose to 4.9/5'],
        ['38', 'Redesigned pricing or packaging', 'Shifted from flat fee to usage-anchored 3-tier Good/Better/Best', 'Lifted Average Contract Value (ACV) by +29% in Q1'],
        ['39', 'Solved a problem creatively', 'Partnered with complementary ecosystem vendor for co-launch', 'Generated 1,400 qualified leads at $0 paid ad spend'],
        ['40', 'Balanced tech debt vs. new features', 'Instituted 20% capacity allocation rule tied to latency SLA', 'Page load improved 48% and checkout conversion rose 6%'],
        ['41', 'Expanded into enterprise segment', 'Built SOC2/SSO readiness package & executive ROI calculator', 'Closed 6 Fortune-500 logos worth $2.8M combined ARR'],
        ['42', 'Challenged the status quo', 'Proved legacy monthly batch report hid weekly churn spikes', 'Built real-time Looker alerting; saved $600K in at-risk ARR']
      ]
    }
  },
  {
    section: 'Module 13 • 50 STAR Answers Vault (43–50: Executive Presence & Culture)',
    code: 'CAREER-13 • STAR Vault Part 6',
    title: 'STAR+L Vault #43–50: Executive Presence, Ethics & Bar-Raising',
    subtitle: 'Close out behavioral loops by proving long-term ownership and cultural multiplication',
    table: {
      headers: ['#', 'Interview Prompt', 'Core Action (A) Blueprint', 'Quantified Result (R) + Leverage (+L)'],
      widths: [28, 145, 175, 168],
      rows: [
        ['43', 'Raised the quality bar across org', 'Created peer architecture review & "Golden Standard" showcase', 'Adopted by 5 departments; NPS jumped from 42 to 68'],
        ['44', 'Handled ethical or compliance grey area', 'Halted dark-pattern test and proposed transparent alternative', 'Protected brand trust and still hit 104% of conversion target'],
        ['45', 'Worked with a difficult personality', 'Adapted communication style to data-first 1-page briefs', 'Turned toughest critic into primary executive sponsor'],
        ['46', 'Learned a complex domain rapidly', 'Conducted 15 expert interviews + built mental model map in Wk 1', 'Shipped first production win by Day 21 in brand-new industry'],
        ['47', 'Advocated for the customer internally', 'Brought 5 live customer pain clips into quarterly planning', 'Secured $500K budget to fix top usability friction'],
        ['48', 'Built inclusive / high-trust culture', 'Instituted written pre-reads so introverts & remote peers lead', 'Team engagement score hit 96th percentile company-wide'],
        ['49', 'Went above and beyond role scope', 'Spotted onboarding gap in Sales and built self-serve demo kit', 'Adopted by 30 AEs; cited in CEO all-hands award'],
        ['50', 'Why should we hire you over others?', 'Combine rare intersection of [Skill A + B] + 90-Day Blueprint', 'De-risks hiring decision with Day-1 execution readiness']
      ]
    },
    callout: {
      label: 'The 8-Story Master Rule',
      body: 'You do not need to memorize 50 separate stories. Prepare 8 deep, metric-rich career stories and practice pivoting their "+L" takeaway to answer any of the 50 prompts above.'
    }
  },
  {
    section: 'Module 14 • Executive Case Study & Panel Presentation Framework',
    code: 'CAREER-14 • Final Round Mastery',
    title: 'Winning the Final-Round Panel & Take-Home Case Presentation',
    subtitle: 'Structure your 5-slide executive deck so the hiring panel sees you as a peer, not an applicant',
    intro: 'In final-round presentations, candidates lose when they jump straight into tactical features. Start with business context, show your prioritization rubric, and explicitly address risks and trade-offs before the panel asks.',
    table: {
      headers: ['Slide #', 'Slide Title & Core Content', 'Executive Signal Sent to Panel'],
      widths: [70, 246, 200],
      rows: [
        ['Slide 1', 'Executive Summary & North-Star Hypothesis (Give the answer first)', 'Minto Pyramid clarity; respects executive time'],
        ['Slide 2', 'Diagnostic Constraints, Customer Pain & Market Economics', 'Commercial depth; doesn’t build in a vacuum'],
        ['Slide 3', 'Prioritization Matrix (Why We Chose Option B Over A & C)', 'Rigorous trade-off thinking & capital allocation'],
        ['Slide 4', 'Phased 30-60-90 Execution Roadmap & Resource Requirements', 'Operational realism & cross-functional awareness'],
        ['Slide 5', 'Success Metrics, Leading Indicators & Pre-Mortem Risk Mitigation', 'Self-aware leader who anticipates failure modes']
      ]
    },
    checklist: {
      title: 'Panel Q&A Power Tactics',
      items: [
        { head: 'Pre-Empt the Bear Case', desc: 'Say: "The biggest risk to this plan is [X]—here is how we mitigate it in Week 2."' },
        { head: 'Headline First, Detail Second', desc: 'Answer every panel question in 1 sentence first, then ask: "Would you like me to unpack the data behind that?"' }
      ]
    }
  },
  {
    section: 'Module 15 • Reverse Interviewing: High-Status Questions to Ask',
    code: 'CAREER-15 • Reverse Interviewing',
    title: '15 High-Status Questions to Ask Interviewers (By Stakeholder Level)',
    subtitle: 'Turn the final 10 minutes of the interview into a consultative peer conversation',
    script: {
      title: 'Copy-Paste Questions That Trigger Psychological Buy-In',
      lines: [
        'FOR THE HIRING MANAGER: "Fast-forward 12 months: we are looking back and saying this hire was the best decision you made all year. What specific metrics did I move in the first 90 days versus the second 6 months?"',
        'FOR THE SKIP-LEVEL VP / C-SUITE: "As you look at the company’s 3 biggest strategic bets this year, what is the #1 operational bottleneck that keeps you up at night?"',
        'FOR CROSS-FUNCTIONAL PEERS: "Where does handoff friction usually happen between your team and this role today, and what would an ideal partnership look like?"',
        'THE CLOSING DIAGNOSTIC QUESTION (Ask in Every Interview): "Based on our conversation today, is there anything in my background or experience that gives you pause about my ability to excel in this role?" (Allows you to neutralize hidden objections live!)'
      ]
    },
    callout: {
      label: 'Why the Closing Diagnostic Question Works',
      body: 'If an interviewer has an unspoken hesitation ("Have they worked at our scale?"), they will typically never tell you—they will just write it in Greenhouse after hanging up. Asking directly lets you provide a counter-example on the spot.'
    }
  },
  {
    section: 'Module 16 • Salary Negotiation Psychology & Early Deflection',
    code: 'CAREER-16 • Compensation Defense',
    title: 'Salary Negotiation Rule #1: Never Name a Number First',
    subtitle: 'How to deflect recruiter comp questions on Call #1 while extracting the top of their approved band',
    intro: 'On the first recruiter screen, you have minimum leverage and maximum information asymmetry. Naming a number too early either prices you out or leaves $25,000–$60,000 on the table. Use the 2-Step Deflection Script.',
    script: {
      title: 'Verbatim Early-Stage Salary Deflection Scripts',
      lines: [
        'RECRUITER: "What are your salary expectations for this role?"',
        'STEP 1 (PIVOT TO BAND): "I’m focused on finding the right leadership scope and total compensation package—including base, bonus, and equity. Since you have the internal leveling architecture for this requisition, what is the approved compensation band for this level?"',
        'STEP 2 (IF PUSHED AGAIN): "Based on current market benchmarks for [Role Level] roles with my track record in [Domain], I’m interviewing with companies whose total compensation packages range between $[High Market] and $[Top of Market], though I’m flexible on the mix of base, bonus, and equity once we see how strong the mutual fit is."'
      ]
    },
    table: {
      headers: ['Negotiation Lever', 'Flexibility Level', 'When to Push This Lever'],
      widths: [140, 126, 250],
      rows: [
        ['1. Base Salary', 'Medium (Band-Locked)', 'Always push first; compounds all future bonuses & raises'],
        ['2. Level / Title Bump', 'Medium–High', 'When your experience sits at top of L5 -> request L6 band'],
        ['3. Sign-On Bonus', 'Very High (One-Time)', 'When base hits band ceiling or leaving unvested bonus/RSUs'],
        ['4. Equity / RSU Grant', 'High (Board Pool)', 'In growth-stage/public tech; ask for +25–40% share refresh'],
        ['5. 6-Month Comp Review', 'High (Written Clause)', 'Lock contractual review tied to 90-day KPI delivery']
      ]
    }
  },
  {
    section: 'Module 17 • The +15% to +30% Counter-Offer Script Vault',
    code: 'CAREER-17 • The Counter-Offer',
    title: 'Word-for-Word Counter-Offer Scripts (+15% to +30% Lift)',
    subtitle: 'How to receive the initial offer on the phone and deliver an enthusiastic, data-backed counter-offer',
    script: {
      title: 'Step 1 (Phone Reaction) & Step 2 (24 Hours Later Counter-Offer Script)',
      lines: [
        'STEP 1 — WHEN THEY PRESENT THE OFFER LIVE: "Thank you so much, [Name]! I’m genuinely excited about the team and the roadmap we discussed with [Hiring Mgr]. As a rule, I always review the full written breakdown of base, equity, and benefits overnight. Please send the details over and let’s reconnect tomorrow at 2 PM."',
        'STEP 2 — THE +20% COLLABORATIVE COUNTER-OFFER EMAIL/CALL: "Hi [Name], thank you again for the offer. After speaking with [Hiring Mgr], I’m 100% convinced we can hit the [90-Day Goal] ahead of schedule. Looking at the compensation package ($[150K] base / $[20K] equity), there is a gap compared to my competing conversations and the scope we discussed. If we can bring the base to $[175K] with a $[15K] sign-on bonus to bridge my upcoming payout, I am ready to sign the offer letter today and cancel my remaining final rounds."'
      ]
    },
    callout: {
      label: 'The "If You Can Do X, I Will Sign Today" Close',
      body: 'Recruiters are measured on "Time-to-Close". Giving them an explicit conditional close ("If we hit $X, I will sign today") turns the recruiter into your internal champion lobbying Compensation & Finance on your behalf.'
    }
  },
  {
    section: 'Module 18 • Multi-Offer Bidding & Equity Negotiation',
    code: 'CAREER-18 • Competing Offers',
    title: 'Synchronizing Competing Offers & Negotiating Equity/Sign-On',
    subtitle: 'Create ethical auction dynamics and evaluate private vs. public equity packages',
    script: {
      title: 'Accelerating Slower Pipelines When You Receive Offer #1',
      lines: [
        '"Subject: Quick timeline update — [Your Name] ([Role Title])"',
        '"Hi [Recruiter at Company B], really enjoyed my conversation with [Interviewer] yesterday. Wanted to share transparently that I just received a formal offer with a decision deadline of [Date]."',
        '"[Company B] remains my top choice because of [Specific Strategic Reason]. Is there any way we can consolidate my final panel into early this week so we have a chance to cross the finish line together?"'
      ]
    },
    table: {
      headers: ['Equity Question to Ask', 'Why It Matters Financially', 'Benchmark / Red Flag'],
      widths: [155, 195, 166],
      rows: [
        ['What is total fully diluted share count?', '10,000 options means nothing without the denominator', 'Red Flag: Refusing to share % ownership'],
        ['What is 409A strike price vs. preferred?', 'Determines your tax spread & exercise cost', 'Ideal: 409A is 25–40% of preferred price'],
        ['What is post-termination exercise window?', 'Standard 90-day window forces cash crunch on exit', 'Negotiate 5–10 year exercise window'],
        ['Is there a 1-year cliff on RSU refresher?', 'Public tech companies increasingly offer 0-cliff quarterly vest', 'Push for quarterly vesting from Quarter 1']
      ]
    }
  },
  {
    section: 'Module 19 • The First 90-Day Executive Onboarding Plan (Days 1–30)',
    code: 'CAREER-19 • 90-Day Plan (Part 1)',
    title: 'The 30-60-90 Day Executive Onboarding Blueprint (Days 1–30)',
    subtitle: 'Attach this 1-page plan to final-round interviews—then use it to dominate your first month on the job',
    intro: 'Bringing a printed or PDF 30-60-90 Day Plan into your final interview separates you from 99% of candidates. Days 1–30 focus on Deep Listening, Architecture Mapping, and Delivering One Visible Quick Win.',
    checklist: {
      title: 'Days 1–30: Absorb, Audit & Deliver Quick Win #1',
      items: [
        { head: 'Week 1 — Stakeholder Tour (15 Interviews)', desc: 'Ask every peer: (1) What is working? (2) Where is the friction? (3) If you were in my seat, what would you fix first?' },
        { head: 'Week 2 — Funnel & Systems Forensic Audit', desc: 'Map the end-to-end customer journey, data dashboards, tech stack, and current sprint velocity.' },
        { head: 'Week 3 — Expectation Alignment with Manager', desc: 'Lock written agreement on exact 30, 60, and 90-day KPIs and weekly 1:1 communication cadence.' },
        { head: 'Week 4 — Ship High-Visibility Quick Win #1', desc: 'Fix one low-effort, high-pain bottleneck identified during the Week 1 listening tour and share credit publicly.' }
      ]
    },
    callout: {
      label: 'First 30-Day Golden Rule',
      body: 'Never criticize legacy decisions in Month 1 ("Who built this mess?"). The person sitting across the table probably built it under extreme constraints two years ago. Seek context before proposing overhaul.'
    }
  },
  {
    section: 'Module 20 • The First 90-Day Plan (Days 31–90) & Promotion Architecture',
    code: 'CAREER-20 • 90-Day Plan (Part 2)',
    title: 'Days 31–90 Execution Roadmap & The 6-Month Promotion Vault',
    subtitle: 'Transition from learning to strategic ownership and build your "Brag Document" from Week 1',
    table: {
      headers: ['Phase', 'Primary Objective', 'Key Deliverables & Milestones', 'Executive Output'],
      widths: [90, 130, 176, 120],
      rows: [
        ['Days 31–60', 'Architect & Optimise', 'Publish State-of-the-Union Audit; launch 2 core process/product upgrades; establish weekly KPI dashboard', 'Approved Q2/Q3 Roadmap & SLA Charter'],
        ['Days 61–90', 'Scale & Multiply', 'Deliver primary North-Star metric lift; document repeatable team SOPs; hire/upskill key gap roles', '90-Day Executive Impact Brief presented to VP']
      ]
    },
    script: {
      title: 'The Weekly "Brag Doc / Impact Ledger" Template (For Performance Reviews)',
      lines: [
        'Maintain a private Notion doc updated every Friday in 4 minutes:',
        '• [Date] QUANTIFIED WIN: Launched [X], lifting [Metric] from [A] to [B] (+$[Z] annualized impact).',
        '• [Date] CROSS-FUNCTIONAL MULTIPLIER: Unblocked [Partner Team] by building [Shared Tool/SOP].',
        '• [Date] PRAISE CAPTURED: Screenshot of Slack/Email kudos from [VP/Client Name].'
      ]
    }
  },
  {
    section: 'Module 21 • Post-Interview Follow-Up & Ghosting Recovery Scripts',
    code: 'CAREER-21 • Pipeline Closing',
    title: 'Value-Add Thank-You Notes & Recruiter Re-Engagement Scripts',
    subtitle: 'Replace generic "Thanks for your time" emails with strategic follow-ups that advance the deal',
    script: {
      title: 'The "Callback Anchor" Thank-You Email (Send Within 3 Hours of Interview)',
      lines: [
        '"Subject: Great speaking today + quick thought on [Specific Bottleneck Discussed]"',
        '"Hi [Interviewer Name], really enjoyed our conversation today—especially unpacking how your team is approaching [Topic X]."',
        '"Reflecting on your question about [Specific Challenge], I remembered how we solved an identical friction point at [Past Company] by implementing [1-Sentence Tactic], which cut [Metric] by [X%]. I attached a quick 3-bullet diagram of how that flow worked in case it’s useful for the team."',
        '"Excited about the momentum here and looking forward to next steps!"'
      ]
    },
    checklist: {
      title: 'Job Search Daily Pipeline Execution Tracker (The 5-5-3 Daily Rule)',
      items: [
        { head: '5 Tailored ATS Applications', desc: 'Run keyword diff on job description, customize top 3 bullets, submit before 10 AM.' },
        { head: '5 Hiring Manager / Insider DMs', desc: 'Send direct value outreach to the hiring leader or team peer for each role applied.' },
        { head: '3 STAR+L Drills Out Loud', desc: 'Record yourself answering 3 prompts from Modules 08–13 in under 120 seconds.' }
      ]
    }
  },
  {
    section: 'Module 22 • Master Pre-Interview & Offer Readiness Checklist',
    code: 'CAREER-22 • Master Execution Checklist',
    title: 'Executive Career Launch Readiness & Final Audit Checklist',
    subtitle: 'Complete this 16-point verification audit before launching your active interview sprint',
    table: {
      headers: ['Audit Category', 'Verification Standard', 'Status Check'],
      widths: [130, 296, 90],
      rows: [
        ['ATS Resume Layout', 'Single-column, standard headers, zero tables/icons, 80%+ keyword match', '[  ] Verified'],
        ['XYZ Bullet Audit', '100% of bullets in last 2 roles start with strong verb + hard metric', '[  ] Verified'],
        ['LinkedIn SEO', 'Headline + About + 5 Open-to-Work titles optimized for Boolean search', '[  ] Verified'],
        ['8 Core STAR+L Stories', 'Mapped across Leadership, Conflict, Failure, Velocity & Growth', '[  ] Verified'],
        ['30-60-90 Day Deck', '1-page executive plan template customized for top-choice companies', '[  ] Verified'],
        ['Comp Deflection & Floor', 'Market bands researched on Levels.fyi/Glassdoor; counter script ready', '[  ] Verified']
      ]
    },
    callout: {
      label: 'Final Executive Mandate',
      body: 'Treat your career transition like a B2B enterprise sales cycle: your resume is the landing page, LinkedIn is the inbound funnel, the interview is the diagnostic discovery call, and the 30-60-90 plan is the closing ROI proposal.'
    }
  }
];

// ============================================================================
// 3. DIGITAL PRODUCT LAUNCH PLAYBOOK (21 Pages)
// ============================================================================
const launchTheme = {
  dark: '#090d16',
  primary: '#7c3aed',
  accent: '#10b981',
  shortTitle: 'Digital Product $10K/Mo Launch Playbook',
  title: 'FROM $0 TO $10,000/MO SELLING DIGITAL TEMPLATES, PLANNERS & MICRO-SAAS',
  subtitle: 'Complete Creator-Entrepreneur Operations Manual: Niche Validation, High-Converting Gumroad/Payhip/GitHub Storefronts, Bundle Pricing Psychology & Pinterest/SEO/Blog Traffic Flywheels',
  badge: 'Digital Product Revenue Engine • v4.8',
  edition: 'Full-Stack Digital Commerce Blueprint • Built for Notion Creators, SOP Architects, Developer Tool Makers & Indie Founders.',
  footerText: 'Digital Product $10K/Mo Launch Playbook • Validation, Conversion Architecture & Organic Traffic Flywheels',
  stats: [
    { label: 'Unit Economics & Validation', val: 'The $10K/Mo Math Matrix & 48-Hour Painkiller Validation Protocol' },
    { label: 'Product Engineering', val: 'High-Perceived-Value Notion Systems, PDF Playbooks & Micro-SaaS Kits' },
    { label: 'Storefront Conversion Triggers', val: 'Gumroad, Payhip, Lemon Squeezy & GitHub Pages Above-the-Fold Anatomy' },
    { label: 'Pricing & Bundle Psychology', val: '3-Tier Decoy Pricing, Order Bumps & +38% AOV Upsell Ladders' },
    { label: 'Traffic & Automation Flywheel', val: 'Programmatic SEO, Pinterest Evergreen Pins & 7-Day Launch Sequences' }
  ]
};

const launchPages = [
  {
    section: 'Module 01 • The $10,000/Mo Unit Economics Matrix',
    code: 'LAUNCH-01 • Revenue Math',
    title: 'Reverse-Engineering $10,000/Month in Digital Product Revenue',
    subtitle: 'Why selling a single $9 template requires impossible traffic—and how tiered product ladders win',
    intro: 'Most creators fail to hit $10,000/month because they sell a single $12 template that requires 834 buyers every 30 days. When you combine an Entry Product ($29), Core Bundle ($79), and Pro Vault ($149), you only need 4–5 sales per day.',
    table: {
      headers: ['Revenue Model', 'Average Order Value (AOV)', 'Monthly Sales Needed', 'Daily Sales', 'Required Monthly Visitors (at 2.5% CR)'],
      widths: [120, 105, 100, 85, 106],
      rows: [
        ['Low-Ticket Solo', '$15', '667 sales/mo', '22.2 / day', '26,680 unique visitors'],
        ['Core Playbook', '$49', '204 sales/mo', '6.8 / day', '8,160 unique visitors'],
        ['Complete Bundle (Sweet Spot)', '$89 (with Order Bump)', '112 sales/mo', '3.7 / day', '4,480 unique visitors'],
        ['Pro Agency / Commercial License', '$199', '50 sales/mo', '1.7 / day', '2,000 unique visitors']
      ]
    },
    checklist: {
      title: 'The 4 Non-Negotiable Laws of High-Margin Digital Products',
      items: [
        { head: 'Law #1 — Sell Speed & Outcomes, Not Pages', desc: 'Customers pay $79 to save 40 hours of work or make $2,000—never for "raw information".' },
        { head: 'Law #2 — Zero Marginal Fulfillment Cost', desc: 'Build once, deliver instantly via automated webhook with 96%+ gross profit margin.' },
        { head: 'Law #3 — B2B / Career Pain Commands 4x Price', desc: 'Templates that make money or save business time sell for $49–$199 vs. $9 consumer trackers.' },
        { head: 'Law #4 — Own the Email & Storefront Asset', desc: 'Every free lead magnet downloader must enter an automated 5-part conversion sequence.' }
      ]
    }
  },
  {
    section: 'Module 02 • Niche Selection: Vitamin vs. Painkiller Matrix',
    code: 'LAUNCH-02 • Niche Architecture',
    title: 'Selecting High-Buying-Intent Digital Product Niches',
    subtitle: 'Score your product idea across Urgency, Purchasing Power, and Quantifiable ROI before building',
    table: {
      headers: ['Niche Category', 'Vitamin (Hard to Sell - $9)', 'Painkiller (Easy to Sell - $59 to $149)', 'Target Buyer ROI'],
      widths: [110, 130, 156, 120],
      rows: [
        ['Agency & Freelance', 'Generic daily to-do list', 'Client Onboarding & Contract SOP Kit', 'Prevents $3,000 scope creep'],
        ['Career & Tech', 'Blank resume Canva template', 'ATS Resume + 50 STAR Answers + Salary Script', 'Adds $15,000+ to job offer'],
        ['Real Estate / Airbnb', 'Cleaning checklist printable', 'Superhost Operations + Dynamic Pricing Manual', 'Boosts RevPAN by +22%'],
        ['Dev & Micro-SaaS', 'Basic CSS components', 'Auth + Stripe + SEO Next.js Boilerplate', 'Saves 60 hours of dev time'],
        ['E-Com & Creators', 'Social media calendar', '300 Viral Hooks + Pinterest SEO Traffic Engine', 'Drives 10k monthly clicks']
      ]
    },
    callout: {
      label: 'The 10x ROI Pricing Test',
      body: 'Before building any digital product, ask: "Can a buyer realistically make or save 10x the price of this product within 30 days of using it?" If the answer is yes, you have a $49–$149 bestseller.'
    }
  },
  {
    section: 'Module 03 • The 48-Hour Demand Validation Protocol',
    code: 'LAUNCH-03 • Zero-Waste Validation',
    title: 'Validate Demand in 48 Hours Before Writing a Single Page',
    subtitle: 'Mine Reddit, Etsy, Gumroad Discover, and search autocomplete for proven buyer wallets',
    checklist: {
      title: 'The 4-Step Demand Forensic Audit',
      items: [
        { head: 'Step 1 — Marketplace Review Mining', desc: 'Find products with 100+ reviews on Gumroad/Etsy; read 3-star reviews to see what buyers wished was included.' },
        { head: 'Step 2 — Search Intent Verification', desc: 'Verify long-tail keywords ("client onboarding sop template", "airbnb welcome book pdf") have commercial intent.' },
        { head: 'Step 3 — The Free Sample Teaser Test', desc: 'Post 1 high-value page/checklist on Reddit, LinkedIn, or X with a link to get the full kit.' },
        { head: 'Step 4 — Pre-Order / Waitlist Threshold', desc: 'If 25+ people download the free sample or 5 people pre-order at 40% off in 48h, build the full vault.' }
      ]
    },
    script: {
      title: 'The High-Converting "Build-in-Public / Free Sample" Validation Post',
      lines: [
        '"Over the last 18 months, I refined our internal [System Name] that helped us [Achieve Specific Metric]."',
        '"Several peers asked for our exact templates, so I packaged the entire 20-page SOP + scripts into a plug-and-play kit."',
        '"Here is Page 3 ([Specific High-Value Checklist]) completely free below. If you want the full 20-module vault (including the contract clauses and calculators), grab it here: [Link]."'
      ]
    }
  },
  {
    section: 'Module 04 • Engineering High-Perceived-Value Digital Assets',
    code: 'LAUNCH-04 • Product Engineering',
    title: 'Packaging Digital Products So Buyers Feel They Got a $1,000 System for $59',
    subtitle: 'Combine executive PDF playbooks, interactive templates, and copy-paste script vaults',
    intro: 'Perceived value is driven by tangible specificity and friction reduction. Never sell a raw text document; package your product as a multi-component "System" or "Kit".',
    table: {
      headers: ['Asset Component', 'Format', 'Perceived Value Multiplier', 'Production Time'],
      widths: [120, 95, 195, 106],
      rows: [
        ['1. Core Execution Playbook', 'Executive PDF (20+ Pages)', 'Establishes authority & step-by-step SOPs', '6–8 Hours'],
        ['2. Copy-Paste Script Vault', 'Embedded Boxes / Notion', 'Eliminates blank-page paralysis immediately', '2–3 Hours'],
        ['3. Calculators & Matrices', 'Tables / Spreadsheets', 'Quantifies ROI (pricing, KPIs, scores)', '2 Hours'],
        ['4. Quick-Start Checklist', '1-Page Action Sheet', 'Gives buyer a win in the first 15 minutes', '1 Hour']
      ]
    },
    callout: {
      label: 'Naming Architecture for 2.4x Higher Conversion',
      body: 'Replace weak nouns ("Ebook", "Guide", "Notes") with high-value tangible nouns: "SOP Kit", "Operations Manual", "Blueprint", "Command Center", "Master Vault", or "Playbook".'
    }
  },
  {
    section: 'Module 05 • Storefront Selection: Gumroad vs. Payhip vs. GitHub Static',
    code: 'LAUNCH-05 • Commerce Infrastructure',
    title: 'Storefront Architecture: Gumroad, Payhip, Lemon Squeezy & GitHub Storefronts',
    subtitle: 'Compare transaction fees, Merchant-of-Record tax handling, and hybrid direct-download setups',
    table: {
      headers: ['Platform', 'Fee Structure', 'VAT / Sales Tax (MoR)', 'Best Strategic Use Case'],
      widths: [110, 115, 125, 166],
      rows: [
        ['GitHub Pages + Direct', '0% Hosting Fee', 'Pair with Stripe/Payhip checkout', 'Ultra-fast SEO hub, developer trust & instant previews'],
        ['Payhip', '5% (Free Plan) or $29/mo (2%)', 'Handles EU/UK VAT automatically', 'High-margin PDFs, bundles, order bumps & cross-sells'],
        ['Gumroad', '10% Flat + Processing', 'Full Merchant of Record', 'Gumroad Discover marketplace traffic & affiliate network'],
        ['Lemon Squeezy', '5% + 50¢ per txn', 'Full Merchant of Record', 'Micro-SaaS license keys, software & recurring tiers']
      ]
    },
    checklist: {
      title: 'The Hybrid "Owned SEO Hub + MoR Checkout" Stack (Recommended)',
      items: [
        { head: 'Host Your Own Fast Web Storefront', desc: 'Deploy a blazing-fast static storefront on GitHub Pages / Cloudflare Pages so you own 100% of SEO equity.' },
        { head: 'Embed 1-Click Overlay Checkout', desc: 'Trigger Payhip/Lemon Squeezy/Gumroad modal checkout or instant lead-capture directly on your domain.' },
        { head: 'Dual-Listing for Marketplace Discovery', desc: 'Keep a mirror listing on Gumroad Discover & Etsy pointing back to your full bundle ecosystem.' }
      ]
    }
  },
  {
    section: 'Module 06 • High-Converting Above-the-Fold Storefront Anatomy',
    code: 'LAUNCH-06 • Conversion Rate Optimization',
    title: 'The 7-Element Above-the-Fold Sales Page Wireframe (4.5%+ CR)',
    subtitle: 'Capture attention and trigger checkout in the first 5 seconds of landing on your product page',
    script: {
      title: 'Above-the-Fold Copywriting Wireframe (Copy-Paste Structure)',
      lines: [
        '[EYEBROW BADGE]: ⚡ UPDATED FOR 2026 • INSTANT PDF & TEMPLATE DOWNLOAD • 20+ PAGES',
        '[HEADLINE]: Get [Specific Quantified Outcome] in [Timeframe] Without [Biggest Pain/Frustration].',
        '[SUBHEADLINE]: The exact [Number]-module [SOP Kit / Playbook] used by [Target Audience] to [Result 1], [Result 2], and [Result 3]—complete with copy-paste scripts and checklists.',
        '[CTA BUTTON]: Download Complete Kit Now ($49) — Instant Access →',
        '[RISK REVERSAL MICRO-COPY]: 🔒 100% Instant Digital Delivery • Lifetime Updates Included • Commercial Use Ready'
      ]
    },
    checklist: {
      title: '3D Cover Mockup & Visual Preview Standards',
      items: [
        { head: 'Show Tangible Density', desc: 'Display the cover alongside fanned-out interior pages showing tables, scripts, and checklists.' },
        { head: 'Badge the Page Count & Assets', desc: 'Add a crisp pill badge on the preview card: "22 Pages • 50 Scripts • 12 Checklists".' },
        { head: 'Interactive Table of Contents', desc: 'List every module title on the sales page so buyers see the exact depth before clicking buy.' }
      ]
    }
  },
  {
    section: 'Module 07 • Long-Form Sales Copywriting (PAS & Value Stack)',
    code: 'LAUNCH-07 • Sales Copywriting',
    title: 'The Problem-Agitate-Solve (PAS) & Value Stack Copy Formula',
    subtitle: 'Write persuasive product descriptions that make a $49–$99 purchase feel like an obvious bargain',
    script: {
      title: 'The "Cost of DIY vs. Instant System" Anchor Block',
      lines: [
        '"WHY BUILD FROM SCRATCH WHEN YOU CAN PLUG IN A PROVEN SYSTEM TODAY?"',
        '• Option A (The Hard Way): Spend 45+ hours researching, formatting templates, testing scripts through trial-and-error, and risking a single costly mistake ($2,500+ in lost time).',
        '• Option B (The Smart Way): Download this battle-tested 20-page Operations Manual in 10 seconds, copy-paste the exact scripts this afternoon, and recoup your investment on your very first use."'
      ]
    },
    table: {
      headers: ['Included Module / Component', 'Standalone Real-World Value', 'Included in Kit'],
      widths: [240, 156, 120],
      rows: [
        ['Core 20-Page Executive Operations Playbook (PDF)', '$197 Value', 'INCLUDED'],
        ['Copy-Paste Email, Call & Negotiation Script Vault', '$147 Value', 'INCLUDED'],
        ['Interactive Pre-Flight Checklists & KPI Scorecards', '$97 Value', 'INCLUDED'],
        ['Commercial License & Lifetime Version Updates', '$97 Value', 'INCLUDED'],
        ['TOTAL REAL-WORLD SYSTEM VALUE: $538', 'YOUR PRICE TODAY:', 'ONLY $49']
      ]
    }
  },
  {
    section: 'Module 08 • Bundle Pricing Psychology & The 3-Tier Decoy Ladder',
    code: 'LAUNCH-08 • Pricing Psychology',
    title: '3-Tier Decoy Pricing & The "All-Access Vault" Bundle Multiplier',
    subtitle: 'Lift Average Order Value (AOV) by 62% using strategic price anchoring',
    intro: 'When you offer a single product for $29, your ceiling is $29. When you offer 3 tiers—Single Playbook ($29), Pro Kit ($49), and the Complete 4-Playbook Master Vault ($99)—over 45% of buyers select the $99 bundle.',
    table: {
      headers: ['Pricing Tier', 'Price Point', 'Psychological Role', 'Expected Buyer Split'],
      widths: [120, 95, 195, 106],
      rows: [
        ['Tier 1: Starter PDF', '$29', 'Low-friction entry anchor', '25% of buyers'],
        ['Tier 2: Complete Kit + Scripts', '$49', 'Core value comparison baseline', '30% of buyers'],
        ['Tier 3: All-Access Master Bundle (4 Kits)', '$99 (Save 50%)', 'High-AOV Hero Offer (Best Value Badge)', '45% of buyers']
      ]
    },
    callout: {
      label: 'Charm Pricing vs. B2B Authority Pricing',
      body: 'Use $29 / $49 / $99 for individual creators and consumers. Use $50 / $150 / $250 clean round numbers for B2B Agency and Executive Team licenses so buyers can expense it on a corporate card.'
    }
  },
  {
    section: 'Module 09 • Order Bumps, Post-Purchase Upsells & Cross-Sells',
    code: 'LAUNCH-09 • AOV Optimization',
    title: 'Checkout Order Bumps & One-Click Post-Purchase Upsells',
    subtitle: 'Add +30% pure profit at checkout with a 1-sentence impulse add-on',
    intro: 'The easiest customer to sell to is someone holding their credit card in hand on your checkout page. An Order Bump converts at 25%–40% when priced at 30%–50% of the main product.',
    script: {
      title: '3 High-Converting Checkout Order Bump Copy Templates',
      lines: [
        '☑️ YES! Add the 50 Copy-Paste Outreach & Follow-Up Swipe File for just $17 (60% OFF — Normally $45). Plug these templates directly into your workflow to get results 2x faster.',
        '☑️ YES! Upgrade to the Agency Team License + Editable Source Checklists for just $24. Share across up to 10 team members or client portals legally.',
        '☑️ YES! Grab the Companion Executive Playbook Bundle (3 Additional Manuals) for just $39 (Save $110 today only).'
      ]
    },
    checklist: {
      title: 'Inside-the-PDF Cross-Sell Engine (Turn Every PDF Into a Sales Rep)',
      items: [
        { head: 'Footer Resource Link', desc: 'Include your storefront URL in the footer of every page so forwarded PDFs drive new organic buyers.' },
        { head: 'Final Page Ecosystem Offer', desc: 'Dedicate the final box of every playbook to a 25%-off coupon for your next complementary playbook.' },
        { head: 'Automated Day-3 Upsell Email', desc: '72 hours after purchase, trigger an email offering the full All-Access Bundle minus what they already paid.' }
      ]
    }
  },
  {
    section: 'Module 10 • Lead Magnet Architecture & Email List Capture',
    code: 'LAUNCH-10 • Funnel Capture',
    title: 'The "Chapter 1 Free Sample" Lead Magnet Funnel (45%+ Opt-In)',
    subtitle: 'Convert cold blog and social visitors into email subscribers and same-session buyers',
    intro: '97% of first-time visitors will not buy on their first touch. Capture their email by offering an immediately actionable 2-page checklist extracted directly from your paid playbook.',
    table: {
      headers: ['Paid Flagship Product', 'High-Converting Free Lead Magnet (Sample)', 'Thank-You Page Tripwire Offer'],
      widths: [160, 186, 170],
      rows: [
        ['Agency Client Onboarding Kit ($49)', '1-Page Discovery Call Diagnostic Cheat Sheet', 'Get Full 21-Page SOP Kit for $34 (15-Min Timer)'],
        ['Executive Career & Interview Vault ($49)', 'Top 50 ATS Action Verbs + XYZ Bullet Formula Sheet', 'Unlock All 50 STAR Answers + Salary Scripts ($34)'],
        ['Digital Product Launch Playbook ($49)', 'The $10K/Mo Unit Economics & Niche Scoring Sheet', 'Upgrade to Complete 21-Page Launch Manual ($34)'],
        ['Airbnb Superhost Playbook ($49)', '5-Star Turnover Cleaning Room-by-Room Checklist', 'Get Full Superhost Manual + Welcome Book ($34)']
      ]
    },
    callout: {
      label: 'The Thank-You Page Self-Liquidating Offer',
      body: 'Never show a dead-end "Check your inbox!" page after an opt-in. Redirect immediately to a special Tripwire page: "While your free checklist is on its way to your inbox, grab the complete 20-page vault for 30% off right now."'
    }
  },
  {
    section: 'Module 11 • The 7-Day Automated Email Welcome & Launch Sequence',
    code: 'LAUNCH-11 • Email Automation',
    title: 'The 7-Email Automated Conversion Sequence (Copy-Paste Blueprint)',
    subtitle: 'Turn free downloaders into buyers on autopilot with educational value + urgency',
    table: {
      headers: ['Day', 'Email Subject Line Formula', 'Core Psychological Angle & CTA'],
      widths: [55, 225, 236],
      rows: [
        ['Day 0', 'Here is your [Free Checklist] + a quick 2-minute win ⚡', 'Deliver asset immediately + show how Module 1 solves their #1 bottleneck'],
        ['Day 1', 'The #1 mistake 80% of [Audience] make with [Topic]', 'Agitate the hidden cost of DIY trial-and-error; introduce your 3-step system'],
        ['Day 2', 'Case Study: How [System] saved [X Hours / $Y] in 14 days', 'Walk through a real before/after scenario using a template from the paid kit'],
        ['Day 3', 'Inside look: The exact script we use for [High-Stakes Moment]', 'Give away 1 complete script box free in the email body; link to full vault'],
        ['Day 5', '"Do I really need a full SOP kit if I’m just starting?"', 'Neutralize top 3 buyer objections (time, complexity, ROI guarantee)'],
        ['Day 6', 'Bonus expiring: Complete [Product Name] + 25% Subscriber Credit', 'Introduce 24-hour subscriber discount code or bonus checklist'],
        ['Day 7', '[Final Call] Closing your 25% subscriber upgrade link tonight', 'Clean scarcity recap + bulleted value stack summary']
      ]
    },
    script: {
      title: 'Day 3 "Give Away the Secret, Sell the Implementation" Email Snippet',
      lines: [
        '"Here is the exact 4-line script from Page 8 of our [Playbook Name]—copy and paste it today:"',
        '"[Insert Verbatim Script]"',
        '"That single script saves our users $[X,XXX]. If you want the other 19 modules, checklists, and calculators already formatted and ready to deploy in 5 minutes, grab the full kit here: [Link]."'
      ]
    }
  },
  {
    section: 'Module 12 • Pinterest Visual SEO Traffic Flywheel',
    code: 'LAUNCH-12 • Evergreen Traffic (Part 1)',
    title: 'The Pinterest Visual Search Engine Flywheel (100K+ Monthly Impressions)',
    subtitle: 'Why Pinterest is a visual search engine—not social media—and how pins drive traffic for 24+ months',
    intro: 'Tweets die in 4 hours; Instagram Reels die in 48 hours; a keyword-optimized Pinterest Pin compounds in search rankings for 2+ years and links directly to your digital product storefront or blog post.',
    checklist: {
      title: 'The High-CTR Vertical Pin Anatomy (1000 × 1500px / 2:3 Ratio)',
      items: [
        { head: 'Top Hook Banner', desc: 'Bold sans-serif headline readable on mobile: "21-Page Agency Client Onboarding SOP Kit".' },
        { head: 'Interior Page Preview Spread', desc: 'Show 3 overlapping actual checklist/table pages so users see it is a real, dense tool.' },
        { head: 'High-Contrast CTA Pill', desc: 'Bottom button graphic: "Instant PDF Download → [YourDomain.com]".' },
        { head: 'Keyword-Rich Pin Title & Description', desc: 'Include primary search phrase in Title, first 50 characters of description, and Board name.' }
      ]
    },
    table: {
      headers: ['Daily / Weekly Cadence', 'Volume', 'Automation Tooling', 'Target Destination URL'],
      widths: [120, 95, 145, 156],
      rows: [
        ['Fresh Pin Designs', '3–5 Pins / Day', 'Canva Bulk Create + Tailwind', 'Direct to Blog Post + Storefront'],
        ['Board SEO Architecture', '8–12 Niche Boards', 'Pinterest Trends Keyword Tool', 'Category Hub Pages'],
        ['Seasonal Refresh', 'Monthly Audit', 'Re-pin top 10% CTR winners', 'Bundle / Flash Sale Landing Page']
      ]
    }
  },
  {
    section: 'Module 13 • Programmatic & Long-Tail Blog SEO Engine',
    code: 'LAUNCH-13 • Evergreen Traffic (Part 2)',
    title: 'High-Intent Search SEO & Blog-to-Playbook Conversion Bridges',
    subtitle: 'Rank for bottom-of-funnel "template", "checklist", and "script" keywords that convert at 5%+',
    intro: 'Never chase high-volume informational keywords ("what is project management"). Target bottom-of-funnel transactional modifiers where the searcher is actively looking for a document to download right now.',
    table: {
      headers: ['Keyword Modifier Formula', 'High-Intent Search Example', 'Embedded Contextual CTA Playbook'],
      widths: [145, 185, 186],
      rows: [
        ['[Role/Task] + SOP Template', '"agency client onboarding sop template"', 'Agency Client Onboarding Kit'],
        ['[Action] + Script Examples', '"salary negotiation counter offer script"', 'Executive Career & Interview Vault'],
        ['[Business] + Operations Checklist', '"airbnb turnover cleaning checklist pdf"', 'Airbnb Superhost Playbook'],
        ['How to Launch + [Asset] + Playbook', '"digital product launch checklist pdf"', 'Digital Product Launch Playbook']
      ]
    },
    script: {
      title: 'The High-Converting "In-Article Content Upgrade Box" HTML/Markdown Pattern',
      lines: [
        '┌──────────────────────────────────────────────────────────────────────────────┐',
        '│ ⚡ WANT THE COMPLETE COPY-PASTE SYSTEM IN ONE PDF?                           │',
        '│ Don’t copy-paste from a browser tab. Download our 21-Page [Playbook Name]    │',
        '│ including all 15 scripts, tables & checklists -> [Download Instant PDF]      │',
        '└──────────────────────────────────────────────────────────────────────────────┘'
      ]
    }
  },
  {
    section: 'Module 14 • Short-Form & Social Authority Content Matrix',
    code: 'LAUNCH-14 • Social Distribution',
    title: 'The "1 Page = 5 Posts" Content Repurposing Matrix',
    subtitle: 'Turn every page of your PDF playbook into high-engagement LinkedIn carousels, X threads & shorts',
    intro: 'You never need to invent content from scratch. Every module inside your PDF playbook is already a structured framework. Screenshot a single table or script box from your PDF and post it with the "Framework Breakdown" hook.',
    table: {
      headers: ['Channel', 'Native Format', 'Hook Formula', 'Conversion CTA'],
      widths: [95, 125, 166, 130],
      rows: [
        ['LinkedIn', '8-Slide PDF Carousel', '"We lost $12K to scope creep before installing this 1-page SOW rule:"', 'Link in Featured section + first comment'],
        ['X / Twitter', 'Screenshot + 5-Tweet Thread', '"90% of resumes fail ATS filters in 6 seconds. Here is the exact wireframe:"', 'Auto-DM or pinned reply link'],
        ['Reddit', 'Deep Value Text Post', '"I compiled our 45-minute discovery script & red-flag matrix (no fluff):"', 'Soft profile link / free sample link'],
        ['YouTube / Loom', '8-Min Walkthrough Video', '"Inside our complete $10K/mo digital product storefront architecture"', 'Pinned description link']
      ]
    },
    callout: {
      label: 'The "Show the Actual Page" Rule',
      body: 'Posts featuring a high-resolution screenshot of an actual interior PDF page (with visible tables and checklists) get 3.1x higher click-through rates than generic text graphics.'
    }
  },
  {
    section: 'Module 15 • The 14-Day Product Launch Run-of-Show',
    code: 'LAUNCH-15 • Launch Orchestration',
    title: 'The 14-Day Blockbuster Digital Product Launch Calendar',
    subtitle: 'Build anticipation, collect early-bird buyers, and spike initial marketplace velocity',
    table: {
      headers: ['Launch Window', 'Daily Action & Content Focus', 'Primary Goal / KPI'],
      widths: [110, 256, 150],
      rows: [
        ['Days -14 to -10', 'Share behind-the-scenes table of contents & ask audience to vote on Cover A vs B', 'Psychological ownership & waitlist signups'],
        ['Days -9 to -5', 'Release 2 free interior sample pages (Checklist + Script Box) in exchange for email', '200+ warm launch subscribers'],
        ['Days -4 to -1', 'Announce exact price ($49) + reveal 48-hour Early-Bird Launch Bonus ($29)', 'Pre-frame value stack'],
        ['Launch Day (D-0)', 'Go live at 9 AM EST; send Email #1, publish LinkedIn carousel, X thread & Reddit post', 'First 25 sales in 24 hours'],
        ['Days +1 to +3', 'Share screenshots of early buyer feedback + unpack Module 4 in a 5-min Loom video', 'Mid-launch momentum'],
        ['Day +4 (Close)', '6-Hour Early-Bird Price Increase Notice (Price moves from $29 -> $49 at midnight)', '40% of total launch revenue spikes here']
      ]
    },
    callout: {
      label: 'Why Real Price Increases Beat Fake Countdown Timers',
      body: 'Buyers distrust fake evergreen countdowns. Instead, launch at an honest V1 Early-Bird price ($29) for the first 72 hours, then permanently raise the price to $49 once V1.1 goes live.'
    }
  },
  {
    section: 'Module 16 • Affiliate Army & Creator Cross-Promotion Engine',
    code: 'LAUNCH-16 • Partner Distribution',
    title: 'Recruiting a 40%-Commission Affiliate & Newsletter Partner Army',
    subtitle: 'Because digital products have 96% margins, paying 40%–50% commission is pure customer acquisition profit',
    script: {
      title: 'Affiliate & Newsletter Partner Recruitment Outreach Script',
      lines: [
        '"Subject: Free copy of our [Playbook Name] + 45% partner rev-share for your readers?"',
        '"Hi [Creator Name], huge fan of your recent breakdown on [Topic]."',
        '"We just released the [Product Name] (21-page executive SOP manual + script vault) which is converting at 4.8% at a $49 price point."',
        '"I attached a complimentary full copy for you to inspect—no strings attached. If you think your audience would love it, I can generate a 1-click 45% affiliate link ($22/sale) plus a custom 15%-off code with your name on it. Open to me sending the link?"'
      ]
    },
    checklist: {
      title: 'The Turnkey Affiliate Media Kit (Make Promotion Effortless)',
      items: [
        { head: '3 Pre-Written Newsletter Blurbs', desc: 'Provide 50-word, 100-word, and 200-word native sponsorships partners can paste in 10 seconds.' },
        { head: 'High-Res Mockup Graphics', desc: 'Include 16:9, 1:1, and 2:3 transparent PNG mockups of your playbooks.' },
        { head: 'Automatic Buyer Registration', desc: 'Invite every happy customer on Day 7 to become a 35% affiliate and earn back their purchase in 3 referrals.' }
      ]
    }
  },
  {
    section: 'Module 17 • Customer Success, Refund Prevention & Review Capture',
    code: 'LAUNCH-17 • Retention & Proof',
    title: 'Zero-Refund Delivery Experience & 5-Star Review Automation',
    subtitle: 'Reduce refund requests below 0.8% and systematically collect verified 5-star ratings',
    checklist: {
      title: 'The "First 5-Minute Win" Delivery Architecture',
      items: [
        { head: 'Instant Direct-Download + Backup Email', desc: 'Deliver the PDF immediately on the confirmation screen AND via email so zero buyers get stuck.' },
        { head: 'Page 2 Quick-Start Roadmap', desc: 'Tell the buyer: "If you only have 15 minutes today, go straight to Page 6 and copy Script #2."' },
        { head: 'Clear Pre-Purchase Scope Table', desc: 'Listing exact page counts and module titles on the sales page eliminates "not what I expected" refunds.' }
      ]
    },
    script: {
      title: 'Day 4 Automated 5-Star Rating & Testimonial Prompt',
      lines: [
        '"Subject: Quick question about your [Playbook Name] download"',
        '"Hi [First Name], hope you’ve already had a chance to put Module 3 to work this week!"',
        '"Quick favor: independent creators live and die by verified ratings. If you found even one script or checklist valuable so far, would you mind clicking here [Link] to tap a quick 5-star rating? As a thank-you, reply to this email and I’ll send you our bonus [Extra Checklist] free."'
      ]
    }
  },
  {
    section: 'Module 18 • Expanding from Templates to Micro-SaaS & Licensing',
    code: 'LAUNCH-18 • Product Escalator',
    title: 'The Value Escalator: From $49 PDF Playbooks to $299 Licenses & Micro-SaaS',
    subtitle: 'Use cashflow and customer feedback from digital playbooks to fund recurring software tools',
    table: {
      headers: ['Ladder Stage', 'Product Format', 'Price Point', 'Strategic Purpose'],
      widths: [110, 140, 100, 166],
      rows: [
        ['Stage 1: Lead Magnet', '2-Page Checklist / Calculator', 'Free (Email Gate)', 'Build 5,000+ segmented email list'],
        ['Stage 2: Core Playbook', '20-Page SOP Manual & Scripts', '$29 – $49', 'Self-liquidate traffic & validate pain'],
        ['Stage 3: Master Vault', '4-Playbook Bundle + Templates', '$99 – $149', 'Maximize AOV & profit margin'],
        ['Stage 4: B2B License', 'White-Label / Team Seat License', '$249 – $499', 'High-ticket enterprise/agency cashflow'],
        ['Stage 5: Micro-SaaS', 'Automated Web App of the SOP', '$29/mo MRR', 'Convert static checklist into recurring software']
      ]
    },
    callout: {
      label: 'How Playbooks De-Risk Micro-SaaS',
      body: 'Never spend 6 months coding a SaaS app in the dark. Sell the manual workflow as a $49 PDF Playbook first. Once 200 people buy the PDF, automate the #1 most repetitive worksheet inside it as a $29/mo Micro-SaaS.'
    }
  },
  {
    section: 'Module 19 • Conversion Analytics & Split-Testing Protocol',
    code: 'LAUNCH-19 • Growth Diagnostics',
    title: 'Digital Storefront Diagnostics & A/B Split-Testing Playbook',
    subtitle: 'Identify the exact leaky bucket in your traffic-to-checkout funnel and fix it in 30 minutes',
    table: {
      headers: ['Funnel Metric', 'Healthy Benchmark', 'If Below Benchmark (Diagnosis)', 'Immediate 30-Minute Fix'],
      widths: [115, 100, 150, 151],
      rows: [
        ['Pin / Post CTR', '1.8% – 3.5%', 'Hook is vague or visual blends in', 'Show real interior PDF pages + specific $ / % number'],
        ['Lead Magnet Opt-In', '35% – 55%', 'Freebie feels like homework', 'Rename to "1-Page Cheat Sheet / Copy-Paste Script"'],
        ['Sales Page CR', '2.5% – 5.0%', 'Outcome unclear or weak proof', 'Add full module table of contents + ROI value stack'],
        ['Checkout Completion', '65% – 80%', 'Surprise fees or friction', 'Enable Apple Pay / Google Pay + 1-click modal'],
        ['Order Bump Take Rate', '25% – 40%', 'Bump is unrelated to main item', 'Make bump the "Speed/Template" version of main buy']
      ]
    }
  },
  {
    section: 'Module 20 • The 90-Day $0 to $10,000/Mo Execution Roadmap',
    code: 'LAUNCH-20 • 90-Day Master Plan',
    title: 'The 90-Day Execution Sprint from $0 to $10,000/Month',
    subtitle: 'Week-by-week operational checklist to build a 4-playbook catalog and compounding traffic engine',
    checklist: {
      title: '12-Week Creator-Entrepreneur Execution Checklist',
      items: [
        { head: 'Weeks 1–2 (Flagship #1)', desc: 'Validate niche, generate 20-page Flagship Playbook #1, deploy storefront & checkout.' },
        { head: 'Weeks 3–4 (Lead Funnel)', desc: 'Extract 2-page free sample, wire 7-day email sequence, publish first 5 SEO articles.' },
        { head: 'Weeks 5–6 (Catalog Expansion)', desc: 'Ship Playbooks #2 and #3; introduce the $99 All-Access Bundle and $17 Order Bump.' },
        { head: 'Weeks 7–8 (Traffic Flywheel)', desc: 'Launch Pinterest daily pinning (4/day) + LinkedIn/X interior-page breakdown posts.' },
        { head: 'Weeks 9–12 (Scale to $10K/Mo)', desc: 'Ship Playbook #4, onboard 20 affiliates at 45% rev-share, and run quarterly bundle promo.' }
      ]
    },
    callout: {
      label: 'The Portfolio Compounding Effect',
      body: 'One great digital product makes side-income; a cohesive portfolio of 4 interlocking playbooks bundled together with an automated SEO + Pinterest flywheel builds a $10,000+/month digital asset.'
    }
  }
];

// ============================================================================
// 4. AIRBNB SUPERHOST PLAYBOOK (19 Pages)
// ============================================================================
const airbnbTheme = {
  dark: '#0f172a',
  primary: '#e11d48',
  accent: '#f59e0b',
  shortTitle: 'Airbnb Superhost Operations Manual + Welcome Book',
  title: 'SHORT-TERM RENTAL & AIRBNB SUPERHOST OPERATIONS MANUAL + GUEST WELCOME BOOK',
  subtitle: 'Turnkey Hospitality & STR Management System: Automated Guest Messaging Sequences, 5-Star Turnover Cleaning Checklists, Dynamic Pricing Calendar Strategy & House Rules Templates',
  badge: 'STR Superhost Operations Kit • v4.5',
  edition: 'Complete Host & Co-Host Operations Manual • Engineered for 4.95+ Star Ratings, 85%+ Occupancy & Remote Automation.',
  footerText: 'Airbnb Superhost Operations Manual & Welcome Book • Automated Messaging, Turnover QA & Revenue Management',
  stats: [
    { label: 'Superhost Algorithm Mastery', val: '4.8+ Rating Protection, <1% Cancellation & 99% Instant Response SLAs' },
    { label: 'Automated Guest Messaging', val: '8 Copy-Paste Scheduled Templates from Booking to 5-Star Review Exchange' },
    { label: '5-Star Turnover Operations', val: '47-Point Room-by-Room Cleaning Checklist & Photo-Verification SOP' },
    { label: 'Dynamic Pricing & Revenue', val: 'Seasonality Multipliers, Orphan-Gap Filling & Direct-Booking Capture' },
    { label: 'Print-Ready Guest Welcome Book', val: 'Wi-Fi, Appliance Guides, Local Gems, House Rules & Emergency Protocols' }
  ]
};

const airbnbPages = [
  {
    section: 'Module 01 • Superhost Algorithm & KPI Architecture',
    code: 'STR-01 • Superhost Standards',
    title: 'Mastering the Airbnb Search Algorithm & Superhost Quarterly KPIs',
    subtitle: 'How Airbnb ranks listings on Page 1 and the exact operational thresholds you must protect',
    intro: 'Airbnb’s search algorithm rewards listings that convert views into bookings and deliver zero-defect stays. Earning and keeping Superhost + "Guest Favorite" badges lifts organic booking conversion by up to 34%.',
    table: {
      headers: ['Metric / Dimension', 'Official Superhost Floor', 'Elite Top-5% Target', 'Operational Safeguard System'],
      widths: [120, 115, 115, 166],
      rows: [
        ['Overall Star Rating', '4.80+ Average', '4.95+ Average', 'Morning-After Check-In Message (SOP-04)'],
        ['Response Rate & Speed', '90%+ within 24h', '100% under 5 mins', 'Automated PMS Scheduled Replies (SOP-03)'],
        ['Cancellation Rate', '< 1.0% Host Cancels', '0.0% Host Cancels', 'Synced Multi-Channel iCal / API Calendar'],
        ['Stay Volume', '10+ Stays or 100 Nights', '78%–88% Occupancy', 'Orphan-Gap Dynamic Discounting (SOP-09)'],
        ['Cleanliness Sub-Score', '4.80+ Stars', '4.98+ Stars', 'Photo-Verified Turnover Checklist (SOP-06)']
      ]
    },
    callout: {
      label: 'The Harsh Math of Airbnb’s 5-Star Scale',
      body: 'To guests, 4 stars means "Good hotel stay." To Airbnb’s algorithm, four consecutive 4-star reviews (4.0 average) triggers listing suspension warnings. Educate guests subtly via a refrigerator magnet explaining the 5-star scale.'
    }
  },
  {
    section: 'Module 02 • Listing SEO & High-Conversion Photo Sequence',
    code: 'STR-02 • Listing Optimization',
    title: 'Airbnb Listing Title Formulas & The 5-Photo Hero Sequence',
    subtitle: 'Win the click on mobile search results and convert browsers into confirmed bookings',
    script: {
      title: 'High-CTR 50-Character Listing Title Formulas (No All-Caps or Generic Adjectives)',
      lines: [
        'FORMULA: [Top Amenity/Vibe] + [Property Type] + [Distance to Landmark] + [Bonus Hook]',
        '• URBAN / BUSINESS: "Penthouse Loft w/ Skyline Balcony • 4 Min to Convention + 1Gbps Wi-Fi"',
        '• VACATION / CABIN: "Cedar A-Frame w/ Private Hot Tub & Firepit • 5 Min to National Park"',
        '• FAMILY / GROUP: "Heated Pool Villa + Game Room • King Suites • Walk to Beach"'
      ]
    },
    checklist: {
      title: 'The First 5 Photos Architecture (Determines 80% of Booking Clicks)',
      items: [
        { head: 'Photo #1 — The Scroll-Stopping Hero Shot', desc: 'Twilight exterior, glowing pool/hot tub, or sunlit living room leading out to the view.' },
        { head: 'Photo #2 — Primary Living & Gathering Space', desc: 'Wide-angle (not fisheye) shot taken at chest height showing seating capacity and warmth.' },
        { head: 'Photo #3 — Primary King Suite', desc: 'Crisp white triple-sheeted bedding, symmetrical nightstands, and warm bedside lamps on.' },
        { head: 'Photo #4 — Signature Differentiator Amenity', desc: 'Espresso bar, dedicated dual-monitor workspace, outdoor dining deck, or soaking tub.' },
        { head: 'Photo #5 — Annotated Floorplan / Layout Graphic', desc: 'Shows room distribution, bed sizes, and workspace location at a single glance.' }
      ]
    }
  },
  {
    section: 'Module 03 • Automated Guest Messaging (Booking to Check-In)',
    code: 'STR-03 • Automated Comms (Part 1)',
    title: 'Automated Guest Messaging Templates: Booking Confirmation to Arrival',
    subtitle: 'Plug these exact templates into Airbnb Scheduled Messages, Hospitable, Guesty, or Hostaway',
    script: {
      title: 'Templates #1, #2 & #3 (Instant Booking, 72h Pre-Arrival & Check-In Instructions)',
      lines: [
        '1. INSTANT BOOKING CONFIRMATION (Sent +2 Mins After Booking): "Hi [Guest First Name]! Thank you for booking your upcoming stay with us from [Check-In Date] to [Check-Out Date]. Everything is confirmed on our calendar! Take a breath—you don’t need to do anything right now. 3 days before your arrival, I’ll send your personal smart-lock code, parking map, and Digital Welcome Book. Quick question so we can prep the house: what brings you to [City]?"',
        '2. 72-HOUR PRE-ARRIVAL & EARLY CHECK-IN UPSELL: "Hi [Guest First Name], we’re counting down to your arrival on [Day]! Standard check-in is at [4:00 PM]. Good news: if you’d like to drop bags or check in early at [1:00 PM], we can arrange priority morning turnover with our cleaning crew for a flat $45 fee—just reply ‘EARLY’ if you’d like me to lock that in!"',
        '3. 24-HOUR CHECK-IN & SMART LOCK DISPATCH: "Hi [Guest First Name], everything is being prepped for your arrival tomorrow! 📍 ADDRESS: [Full Address] | 🔑 SMART LOCK CODE: [Last 4 Digits of Guest Phone]# (Active starting [4:00 PM]) | 📶 WI-FI: Network: [Name] / Pass: [Pass]. Step-by-step photo directions are inside your Welcome Guide: [Link]."'
      ]
    },
    callout: {
      label: 'Smart Lock Security Rule',
      body: 'Program your Schlage Encode / Yale Assure lock to automatically set each guest’s code to the last 4 digits of their cell phone number, valid only from Check-In Time to 30 minutes past Check-Out.'
    }
  },
  {
    section: 'Module 04 • Automated Guest Messaging (Mid-Stay to 5-Star Review)',
    code: 'STR-04 • Automated Comms (Part 2)',
    title: 'Automated Messaging: The Morning-After Rescue, Check-Out & Review Loop',
    subtitle: 'Catch minor issues privately on Day 2 before they ever appear in a public review',
    script: {
      title: 'Templates #4, #5 & #6 (Morning-After Check, Evening-Before Check-Out & Review Trigger)',
      lines: [
        '4. THE "MORNING-AFTER" 5-STAR SHIELD (Sent Day 2 at 9:30 AM): "Good morning [Guest First Name]! Hope you slept great on your first night. Wanted to check in quickly—is the temperature comfortable and did you find everything you needed in the kitchen? If anything at all isn’t 5-star perfect, let me know right now so we can fix it immediately!"',
        '5. EVENING-BEFORE CHECK-OUT (Sent 6:00 PM Night Before Departure): "Hi [Guest First Name], hope you’ve had an amazing stay! Friendly reminder that check-out tomorrow is at [11:00 AM]. Our departure list is super simple (no stripping beds!): (1) Load and start the dishwasher, (2) Place used towels in the shower, and (3) Lock the keypad on your way out. Safe travels tomorrow!"',
        '6. THE 5-STAR REVIEW CATALYST (Sent 3 Hours After Cleaner Confirms Property): "Hi [Guest First Name], our team just finished up at the house and mentioned you left the place in wonderful condition! We just submitted a glowing 5-star review for you so future hosts know you’re an A+ guest. Once you submit yours, Airbnb will publish both—we’d be so grateful for your 5-star feedback!"'
      ]
    },
    callout: {
      label: 'Zero-Chore Check-Out Philosophy',
      body: 'Airbnb penalizes listings with burdensome check-out chores. Never ask guests to strip beds, run laundry, or vacuum. Keep check-out to 3 effortless 60-second items.'
    }
  },
  {
    section: 'Module 05 • The 47-Point 5-Star Turnover Cleaning Checklist (Part 1)',
    code: 'STR-05 • Turnover Operations (Part 1)',
    title: 'Master Turnover Cleaning Checklist: Entryway, Living Area & Kitchen',
    subtitle: 'Laminate and place inside the supply closet—cleaners must check every box on every turnover',
    checklist: {
      title: 'Zones 1–3: Entry, Living Room & Culinary Staging Standards',
      items: [
        { head: 'Front Porch & Smart Lock', desc: 'Sweep welcome mat, wipe door handle & keypad screen, verify lock battery >40%.' },
        { head: 'Living Room Surfaces & Glass', desc: 'Dust all baseboards/blinds, clean mirror/sliding glass streak-free, sanitize TV remote.' },
        { head: 'Upholstery & Under-Furniture Check', desc: 'Lint-roll sofa cushions, vacuum under sofa/rug edges, stage throw blanket neatly.' },
        { head: 'Refrigerator & Freezer Purge', desc: 'Remove all open guest food, wipe shelves & rubber door seals, leave 4 chilled waters.' },
        { head: 'Appliances & Coffee Station', desc: 'Clean microwave ceiling, toaster crumb tray, oven glass; restock 8 coffee pods + filters.' },
        { head: 'Sink, Dishwasher & Disposals', desc: 'Empty dishwasher, polish stainless faucet dry (zero water spots), place 3 fresh pods under sink.' }
      ]
    },
    table: {
      headers: ['Kitchen & Living Consumable', 'Minimum Restock Floor Per Stay', 'Backup Supply Location'],
      widths: [185, 165, 166],
      rows: [
        ['Coffee Pods / Ground Beans + Filters', '8 Pods + Full Canister + Creamers', 'Locked Hallway Supply Closet Shelf 1'],
        ['Paper Towels & Trash Liners', '1 Full Roll on Holder + 1 Spare', 'Locked Supply Closet Shelf 2'],
        ['Dishwasher Pods & New Sponge', '4 Pods + 1 Unopened Scrub Sponge', 'Under-Sink Caddy + Closet Backup']
      ]
    }
  },
  {
    section: 'Module 06 • Turnover Checklist (Part 2: Bedrooms, Baths & Photo QA)',
    code: 'STR-06 • Turnover Operations (Part 2)',
    title: 'Master Turnover Checklist: Hotel-Grade Bedrooms, Bathrooms & Photo QA',
    subtitle: 'Eliminate the #1 cause of 4-star reviews (stray hairs and stained linens) with mandatory photo verification',
    checklist: {
      title: 'Zones 4–6: Bedrooms, Spa Bathrooms & Outdoor Patio',
      items: [
        { head: 'The "Zero-Hair" Bathroom Protocol', desc: 'Clean toilet base/hinges, scrub grout, polish chrome dry, and lint-roll floor + shower floor LAST.' },
        { head: 'Hospital-Corner White Bedding', desc: 'Inspect sheets under bright light for stains, pull taut, fluff 4 pillows per king bed.' },
        { head: 'Under-Bed & Drawer Audit', desc: 'Check every nightstand drawer, closet hanger count (10/closet), and under bed for lost chargers.' },
        { head: 'Towel & Amenity Staging', desc: 'Tri-fold 2 bath towels, 1 hand towel, and 1 black makeup washcloth per guest; top off soap pumps.' },
        { head: 'Patio, Grill & Hot Tub Check', desc: 'Brush grill grates, verify propane >50%, test hot tub pH/chlorine strip and clean filter.' }
      ]
    },
    callout: {
      label: 'The 8-Photo Cleaner Verification Rule (Turno / Breezeway)',
      body: 'Cleaners do not mark a job complete until uploading 8 timestamped photos: (1) Each made bed, (2) Each open toilet/shower, (3) Open empty fridge, (4) Coffee station, (5) Thermostat set to 70°F, and (6) Locked supply closet.'
    }
  },
  {
    section: 'Module 07 • Linen PAR System & Inventory Restocking Tracker',
    code: 'STR-07 • Inventory & Supply Chain',
    title: 'The 3-PAR White Linen System & Automated Restock Triggers',
    subtitle: 'Never delay a 11 AM–4 PM same-day turnover waiting on a washing machine cycle',
    intro: 'High-occupancy listings cannot wash and dry 3 king duvet covers inside a 4-hour turnover window. Operate on a strict 3-PAR All-White Linen Standard with commercial bleachability.',
    table: {
      headers: ['PAR Tier', 'Physical Location', 'Operational Role'],
      widths: [120, 166, 230],
      rows: [
        ['PAR Set #1', 'Active on Beds / Bathrooms', 'Currently in use by incoming guests'],
        ['PAR Set #2', 'Folded in Locked Cleaner Closet', 'Swapped onto beds immediately at 11:05 AM'],
        ['PAR Set #3', 'In Laundry / Backup Bin', 'Washed off-site or during cycle; buffer against stains']
      ]
    },
    checklist: {
      title: 'Low-Stock QR Code Reorder System (Zero Stockouts)',
      items: [
        { head: 'Green / Red Bin Divider', desc: 'Place a bright Red Laminated QR Card 20% from the bottom of every toilet paper, soap, and coffee bin.' },
        { head: '1-Scan Cleaner Alert', desc: 'When the cleaner reaches the Red Card, scanning the QR opens a 1-click form that notifies the host/Amazon auto-order.' },
        { head: 'Stain Treatment Kit', desc: 'Stock OxiClean MaxForce, Fels-Naptha bar, and magic erasers in the cleaner caddy to save $80 sheets.' }
      ]
    }
  },
  {
    section: 'Module 08 • Preventive Maintenance & Seasonal Inspection SOP',
    code: 'STR-08 • Asset Protection',
    title: 'Quarterly Preventive Maintenance & Deep-Clean Audit Schedule',
    subtitle: 'Prevent emergency $600 Sunday-night HVAC or plumbing calls before they happen',
    table: {
      headers: ['Cadence', 'System / Component', 'Preventive Action Required', 'Owner'],
      widths: [95, 145, 186, 90],
      rows: [
        ['Monthly', 'HVAC & Air Filters', 'Replace MERV-8 filter + check condensate drain line', 'Lead Cleaner'],
        ['Monthly', 'Smart Locks & Smoke/CO', 'Test keypad codes + replace batteries at <40%', 'Lead Cleaner'],
        ['Quarterly', 'Plumbing & Drains', 'Snake shower drains + flush tankless water heater', 'Handyman'],
        ['Quarterly', 'Deep Clean & Upholstery', 'Steam clean rugs/sofas, wash baseboards, flip mattresses', 'Deep Clean Crew'],
        ['Bi-Annual', 'Dryer Vent & Exterior', 'Vacuum dryer exhaust duct (fire safety) + gutter check', 'Handyman']
      ]
    },
    callout: {
      label: 'The $250 Pre-Approved Handyman Retainer Rule',
      body: 'Establish a pre-negotiated relationship with two local handymen. Pre-authorize repairs under $250 without waiting for your phone approval so guest issues are solved inside 90 minutes.'
    }
  },
  {
    section: 'Module 09 • Dynamic Pricing Calendar & Revenue Management',
    code: 'STR-09 • Revenue Optimization',
    title: 'Dynamic Pricing Strategy: Base Rate, Seasonality & Orphan Gaps',
    subtitle: 'Why static nightly rates lose 28% in annual revenue—and how to configure PriceLabs / Wheelhouse',
    intro: 'Setting a flat $200/night rate leaves thousands on the table during peak concert/festival weekends and causes empty Tuesdays in winter. Deploy algorithmic dynamic pricing with these exact guardrails.',
    table: {
      headers: ['Booking Window / Scenario', 'Pricing & Minimum-Stay Rule', 'Revenue Objective'],
      widths: [150, 186, 180],
      rows: [
        ['90+ Days Out (Far Future)', '+25% Above Base Rate | 4-Night Min', 'Capture high-budget early planners only'],
        ['30–60 Days Out (Prime Window)', '100% Market Base Rate | 3-Night Min', 'Build core occupancy baseline (55%+)'],
        ['7–14 Days Out (Unbooked)', '-12% Last-Minute Adjustment | 2-Night Min', 'Fill remaining weekend inventory'],
        ['1–3 Days Out (Distressed)', '-22% Floor Cap (Never below Min Price)', 'Monetize expiring nights above cleaning cost'],
        ['Orphan Day Rule (1–2 Night Gap)', 'Auto-drop Min Stay to length of gap (-10%)', 'Eliminate unbookable 2-day holes between stays'],
        ['Peak Events / Holidays', '+60% to +120% Surge | 3–4 Night Min', 'Maximize RevPAN on 100%-demand dates']
      ]
    },
    callout: {
      label: 'Calculating Your Hard Minimum Nightly Floor',
      body: 'Minimum Floor = (Variable Utilities/Wear per Night + Prorated Consumables + Platform Fee) × 1.8. Never allow dynamic pricing software to discount below your Hard Floor.'
    }
  },
  {
    section: 'Module 10 • House Rules & Party-Prevention Security Protocol',
    code: 'STR-10 • Risk & Security',
    title: 'Ironclad House Rules Template & Party-Prevention Stack',
    subtitle: 'Write enforceable rules that Airbnb Support upholds in AirCover claims without sounding hostile',
    script: {
      title: 'Copy-Paste Listing House Rules (Enforceable in Airbnb Resolution Center)',
      lines: [
        '1. REGISTERED GUESTS ONLY: Only the exact number of guests on the reservation are permitted overnight. Unregistered visitors or parties result in immediate reservation termination without refund and a $100/person fee.',
        '2. QUIET HOURS & NOISE MONITORING: Strict quiet hours are 10:00 PM – 8:00 AM. Property is equipped with a privacy-safe Minut decibel sensor (measures sound levels only, never records audio). Sustained noise >75dB triggers automated alerts.',
        '3. NO SMOKING OR VAPING ($350 FEE): Strictly no smoking, vaping, or e-cigarettes inside the home or within 15 feet of open doors. Specialized ozone remediation fee of $350 applies if violated.',
        '4. EXTERIOR SECURITY CAMERAS: For your safety, 1 exterior doorbell camera faces the front driveway entrance and records motion only. Zero cameras exist inside private or backyard areas.'
      ]
    },
    checklist: {
      title: 'The 4-Signal Anti-Party Screening Filter',
      items: [
        { head: 'Ban 1-Night Weekend Bookings', desc: 'Enforce a strict 2-night minimum on Friday and Saturday check-ins year-round.' },
        { head: 'Local Same-Day Booking Alert', desc: 'Require manual approval for same-day bookings made by guests living within the same city.' },
        { head: 'Noise & Occupancy Hardware', desc: 'Install a Minut sensor (decibels + crowd Wi-Fi device count + cigarette smoke detection).' }
      ]
    }
  },
  {
    section: 'Module 11 • Crisis Management, Refunds & AirCover Claims SOP',
    code: 'STR-11 • Incident Response',
    title: 'Handling Guest Complaints, Emergency Repairs & AirCover Claims',
    subtitle: 'De-escalate issues to save the 5-star review and win 100% of legitimate damage reimbursements',
    script: {
      title: 'The H.E.A.R.D. Guest De-Escalation Script (When an Amenity Breaks)',
      lines: [
        '"Hi [Guest Name], thank you so much for flagging the [Issue] right away—I completely understand how frustrating that is on vacation."',
        '"I have already dispatched our technician [Name] who can be there at [Time] (or while you are out at dinner). In the meantime, I just sent a $[40] dinner/coffee credit via the Airbnb Resolution Center on us for the inconvenience. Please let me know which window works best for entry!"'
      ]
    },
    table: {
      headers: ['AirCover Claim Step', 'Mandatory Documentation Required', 'Strict Deadline'],
      widths: [130, 256, 130],
      rows: [
        ['1. Timestamped Photos', 'Wide + close-up photos taken by cleaner BEFORE next guest checks in', 'Before next check-in'],
        ['2. Keep All Chat on App', 'Document issue politely in Airbnb message thread (never SMS only)', 'Within 24 hours'],
        ['3. Itemized Invoice/Link', 'Upload original Amazon/retailer receipt + professional cleaning invoice', 'Within 14 days of checkout'],
        ['4. Escalate to AirCover', 'If guest declines or ignores after 72h, click "Involve Airbnb"', 'Day 4 post-submission']
      ]
    }
  },
  {
    section: 'Module 12 • Guest Welcome Book — Page 1: Cover & Warm Welcome',
    code: 'WELCOME-01 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] Welcome Home & Quick-Connect Essentials',
    subtitle: 'Print Pages 13–18 and place inside a sleek acrylic binder on the entry console or dining table',
    script: {
      title: 'WELCOME TO YOUR HOME AWAY FROM HOME ✨',
      lines: [
        '"Dear Guest, welcome! Whether you are here to explore the city, relax with family, or get focused work done, we have designed every corner of this home for your comfort."',
        '"Inside this quick guide, you’ll find instant Wi-Fi credentials, 60-second appliance tips, our favorite local coffee and dining spots, and departure instructions."',
        '"Need anything during your stay? Message us directly in the Airbnb app for the fastest response (under 10 minutes), or call our urgent support line at [Phone Number]. Enjoy your stay!"'
      ]
    },
    table: {
      headers: ['Quick-Reference Essential', 'Your Property Details (Customize & Print)'],
      widths: [185, 331],
      rows: [
        ['📶 High-Speed Wi-Fi Network', 'Network: [Property_Guest_5G]   |   Password: [WelcomeHome2026!]'],
        ['🔑 Front Door Smart Keypad', 'To Lock: Press [Lock Icon]   |   To Unlock: Enter [4-Digit Code] + [Check]'],
        ['🚗 Parking Instructions', 'Park up to [2] vehicles in the private driveway (Spot # [X]). Street parking rules: [Details]'],
        ['🌡️ Smart Thermostat Guide', 'Located in hallway. Set between 67°F–74°F for optimal comfort (do not set below 65°F)'],
        ['🗑️ Trash & Recycling Day', 'Bins are on the [Left Side Gate]. Collection is [Tuesday Morning]']
      ]
    }
  },
  {
    section: 'Module 13 • Guest Welcome Book — Page 2: Property & Appliance Guide',
    code: 'WELCOME-02 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] How Everything Works (60-Second Appliance Guide)',
    subtitle: 'Eliminate 90% of late-night guest troubleshooting questions with clear 3-step instructions',
    checklist: {
      title: 'Appliance & Entertainment Quick-Start Instructions',
      items: [
        { head: '☕ Espresso & Drip Coffee Bar', desc: 'Lift silver lever, insert Nespresso/K-Cup pod, press flashing brew button. Extra pods & syrups are in top drawer.' },
        { head: '📺 Smart TV & Streaming Apps', desc: 'Use the single black Samsung/Roku remote. Press HOME to access Netflix, YouTube & Disney+ (Guest Mode enabled).' },
        { head: '🧺 Washer & Dryer (If Needed)', desc: 'Located in [Hallway Closet]. Use 1 detergent pod (top shelf) directly in drum—not the drawer—and select "Normal".' },
        { head: '🛁 Hot Tub / Heated Pool (If Applicable)', desc: 'Lift cover using side lever, press "JETS 1". Please replace thermal cover after each use and use plastic glassware only.' },
        { head: '🔌 Breaker Box & GFCI Reset', desc: 'If a bathroom outlet trips with a hairdryer, press the small "RESET" button on the wall outlet above the vanity.' }
      ]
    },
    callout: {
      label: 'Where to Find Extra Supplies',
      body: 'Extra pillows & cozy blankets: Top shelf of Master Closet. • Extra toilet paper & trash bags: Under bathroom vanity. • Iron, steamer & luggage rack: Bedroom 2 closet. • First-aid kit & flashlight: Kitchen upper cabinet.'
    }
  },
  {
    section: 'Module 14 • Guest Welcome Book — Page 3: House Etiquette & Comfort',
    code: 'WELCOME-03 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] House Etiquette & Good-Neighbor Charter',
    subtitle: 'Warm, hospitality-first framing of house rules for the coffee-table welcome binder',
    table: {
      headers: ['Guideline', 'How You Can Help Us Keep This Home 5-Star Ready'],
      widths: [150, 366],
      rows: [
        ['🌙 Quiet Hours (10 PM – 8 AM)', 'We love our neighbors! Please bring outdoor patio conversations inside after 10:00 PM.'],
        ['🚭 100% Smoke-Free Sanctuary', 'No smoking, vaping, or incense indoors. If smoking outdoors, please step 15ft away and dispose of butts safely.'],
        ['🖤 Makeup & Dark Washcloths', 'Please use the black "Makeup" washcloths or disposable wipes provided for cosmetics, self-tanner, or face masks.'],
        ['❄️ AC & Open Doors', 'When enjoying the patio, please keep sliding doors closed while the AC is running so the coils don’t freeze.'],
        ['🐾 Pet Policy / Allergies', 'To protect guests with severe allergies, only pre-registered pets are permitted (keep off white duvet covers).']
      ]
    },
    script: {
      title: 'How the Airbnb 5-Star Rating System Works (Friendly Guest Note)',
      lines: [
        '"DID YOU KNOW? Unlike hotels where 4 stars means ‘Great!’, Airbnb views anything below 4.8 stars as a failing score that can remove a family-run home from the platform."',
        '"Our #1 goal is to earn your 5-star review across every category! If anything during your stay feels like a 4-star experience, please message us immediately so we can make it right during your stay."'
      ]
    }
  },
  {
    section: 'Module 15 • Guest Welcome Book — Page 4: Curated Local Recommendations',
    code: 'WELCOME-04 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] Our Personal Local Favorites (Eat, Drink & Explore)',
    subtitle: 'Skip the tourist traps—here are the places we actually take our own friends and family',
    table: {
      headers: ['Category', 'Venue Name & Distance', 'What to Order / Insider Tip'],
      widths: [115, 165, 236],
      rows: [
        ['☕ Best Morning Coffee', '[Roastery Name] (4 min walk)', 'Try the pistachio oat latte & almond croissant; great Wi-Fi'],
        ['🥞 Weekend Brunch', '[Bistro Name] (6 min drive)', 'Join the Yelp waitlist 20 mins before leaving the house'],
        ['🍝 Date-Night Dinner', '[Restaurant Name] (8 min drive)', 'Ask for the courtyard patio; handmade pasta & craft cocktails'],
        ['🌮 Casual / Late Night', '[Taqueria / Gastro] (5 min walk)', 'Open until midnight Fri/Sat; best birria tacos in town'],
        ['🛒 Grocery & Pharmacy', '[Whole Foods / Market] (4 min)', 'Instacart & UberEats deliver straight to the front porch'],
        ['🌲 Hidden Local Gem', '[Park / Scenic Overlook] (10 min)', 'Go 30 minutes before sunset for the best skyline photo']
      ]
    },
    callout: {
      label: 'Host Revenue Tip: Viator & Local Partner QR Codes',
      body: 'Add a small QR code next to local tours, bike rentals, or private chefs using your Viator Affiliate Link (8% commission) or local restaurant partner 10%-off guest voucher.'
    }
  },
  {
    section: 'Module 16 • Guest Welcome Book — Page 5: Emergency & Safety Directory',
    code: 'WELCOME-05 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] Safety Equipment Map & Emergency Contacts',
    subtitle: 'Required by many municipal STR permits—keep posted inside the welcome binder and pantry door',
    table: {
      headers: ['Emergency Resource / Safety Item', 'Location / Contact Number'],
      widths: [195, 321],
      rows: [
        ['🚨 Police / Fire / Medical Emergency', 'Dial 911 (or 112) — Give Property Address: [Full Street Address & Zip]'],
        ['🏥 Nearest 24-Hour Urgent Care & ER', '[Hospital Name] — [Address] (7 mins away) • [Phone]'],
        ['🧯 Fire Extinguisher & Fire Blanket', 'Mounted under the kitchen sink + hallway laundry closet'],
        ['💧 Main Water Shut-Off Valve', 'Located in [Utility Closet / Garage Front Wall] — Turn handle clockwise'],
        ['⚡ Electrical Breaker Panel', 'Located in [Hallway / Garage] — All circuits clearly labeled'],
        ['📞 24/7 Host Emergency Escalation Line', 'Primary Host: [Phone] • Local Co-Host/Manager: [Phone]']
      ]
    },
    checklist: {
      title: 'Severe Weather & Power Outage Guest Instructions',
      items: [
        { head: 'Rechargeable Emergency Lanterns', desc: 'Two automatic plug-in LED flashlights are located in the kitchen outlet and upstairs hallway.' },
        { head: 'Backup Physical Lockbox', desc: 'In the rare event of a smart-lock failure, a backup mechanical key lockbox is on the side hose bib.' }
      ]
    }
  },
  {
    section: 'Module 17 • Guest Welcome Book — Page 6: Stress-Free Check-Out Card',
    code: 'WELCOME-06 • Print-Ready Guest Page',
    title: '[GUEST WELCOME BOOK] Effortless 3-Step Departure Checklist',
    subtitle: 'Check-out time is [11:00 AM]—no heavy chores, just three quick items before you hit the road',
    checklist: {
      title: 'Your 60-Second Departure Checklist (Thank You!)',
      items: [
        { head: '1. Kitchen & Dishes', desc: 'Load any used dishes into the dishwasher and press START (pods are under the sink).' },
        { head: '2. Used Towels Only', desc: 'Leave beds unstripped! Simply place used wet towels in the bathroom shower or laundry basket.' },
        { head: '3. Electronics, Windows & Lock', desc: 'Check all outlets for phone chargers, close windows, and press the LOCK button on the keypad.' }
      ]
    },
    script: {
      title: 'Stay Connected & Book Direct Next Time (Save 15% on Platform Fees!)',
      lines: [
        '"LOVED YOUR STAY? COME BACK & SAVE 15%!"',
        '"Returning guests and their friends can book directly with us at [YourDirectBookingSite.com] using code VIPGUEST15 to skip Airbnb’s 14% service fee and receive free early check-in on your next visit."',
        '"Safe travels home, and thank you for treating our property with such care!"'
      ]
    }
  },
  {
    section: 'Module 18 • Direct Booking Capture & Co-Hosting Scaling Blueprint',
    code: 'STR-12 • Portfolio Scaling',
    title: 'Capturing Repeat Direct Bookings & Scaling via Co-Hosting (20% Fee)',
    subtitle: 'Reduce platform dependency and scale from 1 property to 10+ without buying real estate',
    table: {
      headers: ['Growth Lever', 'Implementation Stack', 'Net Profit Impact'],
      widths: [125, 195, 196],
      rows: [
        ['Wi-Fi Splash Page (StayFi)', 'Collects email of every guest in the group (not just primary booker)', 'Builds 500+ verified guest email list/yr'],
        ['Direct Booking Engine', 'Hospitable Direct / Lodgify + Stripe + Damage Protection', 'Saves guest 14% fee while host nets +10%'],
        ['Mid-Term Corporate Stays', 'Furnished Finder + Insurance Relocation Housing in slow season', 'Locks 95% winter occupancy at zero turnover'],
        ['Asset-Light Co-Hosting', 'Manage local owners’ listings using this SOP manual for 20% gross', '$1,200–$2,000/mo net per property added']
      ]
    },
    callout: {
      label: '90-Day Superhost Execution Summary',
      body: 'Week 1: Load the 6 Automated Messages & Dynamic Pricing rules. Week 2: Print & laminate the 47-Point Cleaner Checklist + 3-PAR linens. Week 3: Place the 6-Page Guest Welcome Book on the table. Watch your rating lock at 4.95+ stars.'
    }
  }
];

async function run() {
  console.log('Generating Agent 9 Business SOP & Career Playbooks...');
  const r1 = await generateBook('Agency-Client-Onboarding-Kit.pdf', agencyTheme, agencyPages);
  console.log(`1. Created ${path.basename(r1.filePath)} (${r1.totalPages} pages)`);

  const r2 = await generateBook('Executive-Career-Interview-Kit.pdf', careerTheme, careerPages);
  console.log(`2. Created ${path.basename(r2.filePath)} (${r2.totalPages} pages)`);

  const r3 = await generateBook('Digital-Product-Launch-Playbook.pdf', launchTheme, launchPages);
  console.log(`3. Created ${path.basename(r3.filePath)} (${r3.totalPages} pages)`);

  const r4 = await generateBook('Airbnb-Superhost-Playbook.pdf', airbnbTheme, airbnbPages);
  console.log(`4. Created ${path.basename(r4.filePath)} (${r4.totalPages} pages)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
