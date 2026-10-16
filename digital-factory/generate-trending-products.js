const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

const ROOT = path.resolve(__dirname, '..');
const AUTOMATIONS_DIR = path.join(ROOT, 'downloads/automations');
const NOTION_DIR = path.join(ROOT, 'downloads/notion');
const PLAYBOOKS_DIR = path.join(ROOT, 'downloads/playbooks');
const EXCEL_DIR = path.join(ROOT, 'downloads/excel');

[AUTOMATIONS_DIR, NOTION_DIR, PLAYBOOKS_DIR, EXCEL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper for generating PDF
function createPDFBook(filePath, { title, subtitle, category, pages }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 40 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Cover Page
    doc.rect(0, 0, 612, 792).fill('#0f172a');
    doc.fillColor('#6366f1').fontSize(12).font('Helvetica-Bold').text(category.toUpperCase(), 50, 180, { characterSpacing: 2 });
    doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold').text(title, 50, 210, { width: 512, lineGap: 6 });
    doc.fillColor('#94a3b8').fontSize(14).font('Helvetica').text(subtitle, 50, 310, { width: 500, lineGap: 4 });

    // Decorative rule
    doc.rect(50, 370, 120, 4).fill('#6366f1');

    doc.fillColor('#64748b').fontSize(10).font('Helvetica').text('SmartCents Executive Digital Studio • Commercial Asset Suite', 50, 710);
    doc.text('Verified Production Framework • Instant Deployment', 50, 725);

    // Interior Pages
    pages.forEach((p, idx) => {
      doc.addPage();
      // Header Banner
      doc.rect(0, 0, 612, 50).fill('#1e293b');
      doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text(p.heading || title, 40, 18);
      doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text(`Module ${idx + 1} of ${pages.length}`, 500, 20);

      let curY = 75;
      doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text(p.sectionTitle, 40, curY);
      curY += 28;

      if (p.intro) {
        doc.fillColor('#334155').fontSize(10.5).font('Helvetica').text(p.intro, 40, curY, { width: 532, lineGap: 4 });
        curY += 50;
      }

      if (p.bullets) {
        p.bullets.forEach(b => {
          doc.rect(40, curY + 3, 6, 6).fill('#6366f1');
          doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text(b.title + ':', 55, curY);
          const titleWidth = doc.widthOfString(b.title + ': ');
          doc.fillColor('#334155').fontSize(10).font('Helvetica').text(b.desc, 55 + titleWidth, curY, { width: 470 - titleWidth });
          curY += 32;
        });
      }

      if (p.codeBox) {
        curY += 10;
        doc.rect(40, curY, 532, 160).fill('#0f172a');
        doc.fillColor('#38bdf8').fontSize(8.5).font('Courier').text(p.codeBox, 50, curY + 12, { width: 512, lineGap: 3 });
        curY += 175;
      }

      // Footer
      doc.rect(40, 745, 532, 1).fill('#e2e8f0');
      doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica').text(`Page ${idx + 2} • ${title} • SmartCents Digital Studio`, 40, 755);
    });

    doc.end();
    stream.on('finish', () => resolve());
  });
}

async function run() {
  console.log('Generating trending digital products...');

  // 1. Automations Master Guide PDF
  await createPDFBook(path.join(AUTOMATIONS_DIR, 'Automations-Master-Blueprints-Guide.pdf'), {
    title: 'Production n8n & Make.com AI Automations Master Guide',
    subtitle: 'Deploying Inbound Lead Responders, Vision OCR Systems, and Autonomous Social Engines',
    category: 'Automation Architecture',
    pages: [
      {
        sectionTitle: '1. Production Deployment & Webhook Setup',
        intro: 'This master blueprint outlines the configuration of autonomous agents in n8n and Make.com without relying on recurring SaaS subscription tolls.',
        bullets: [
          { title: 'Environment Variables', desc: 'Securely store API keys (OpenAI, Anthropic, Telegram) in n8n credentials vault.' },
          { title: 'Error-Handling & Retries', desc: 'Implement automatic 3x exponential backoff retry loops on all external HTTP nodes.' },
          { title: 'Payload Validation', desc: 'Sanitize incoming webhook JSON bodies before passing prompts to LLM classification chains.' }
        ],
        codeBox: `// Sample Webhook Authentication Middleware (n8n Function Node)\nconst token = $input.item.json.headers['x-api-token'];\nif (token !== $env.AUTHORIZED_CLIENT_SECRET) {\n  throw new Error('401 Unauthorized API Request');\n}\nreturn $input.item;`
      },
      {
        sectionTitle: '2. Multi-Agent Lead Qualification Workflow Architecture',
        intro: 'Detailed execution path for the automated lead scoring and immediate VIP Telegram notifications engine.',
        bullets: [
          { title: 'Scoring Heuristic', desc: 'Qualifies leads based on company headcount (>50 = +3 pts), verified budget (>=$10k = +4 pts).' },
          { title: 'Escalation Threshold', desc: 'Leads scoring 8+ trigger immediate priority push notification to founder mobile.' },
          { title: 'CRM Sync', desc: 'Automatically writes records to Google Sheets / Airtable / HubSpot in under 800ms.' }
        ]
      }
    ]
  });

  // 2. Notion Architecture PDFs (5)
  const notionKits = [
    {
      file: 'Solopreneur-Second-Brain-Notion-OS.pdf',
      title: 'Solopreneur Second Brain Notion OS Architecture',
      subtitle: 'The Complete PARA Method (Projects, Areas, Resources, Archives) Digital System',
      category: 'Notion Framework',
      pages: [
        {
          sectionTitle: '1. The Executive PARA Database Schema',
          intro: 'Architectural blueprint for organizing thousands of notes, resources, and actionable tasks with zero mental clutter.',
          bullets: [
            { title: 'Active Projects DB', desc: 'Filtered view of high-priority milestones due within the current quarter.' },
            { title: 'Knowledge Vault', desc: 'Hyper-linked Zettelkasten database with tags for books, articles, and frameworks.' },
            { title: 'Weekly Review Dashboard', desc: 'Sunday cadence checklist for archiving closed tasks and clearing dopamine backlogs.' }
          ]
        }
      ]
    },
    {
      file: 'Real-Estate-Agent-CRM-Notion-System.pdf',
      title: 'Real Estate Agent CRM & Listing Hub Notion System',
      subtitle: 'Lead Pipeline, Property Diligence, Closing Checklist & Commission Tracker',
      category: 'Real Estate Notion OS',
      pages: [
        {
          sectionTitle: '1. Client Pipeline & Staging Blueprint',
          intro: 'Turn chaotic buyer inquiries and home seller showings into a structured, visual Kanban board.',
          bullets: [
            { title: 'Buyer Match Matrix', desc: 'Filter active MLS listings matching exact client budget and neighborhood preferences.' },
            { title: 'Escrow & Diligence Milestones', desc: 'Automated 30-day countdown tracking title search, home inspection, and appraisal.' }
          ]
        }
      ]
    },
    {
      file: 'Content-Creator-Multi-Platform-Notion-Hub.pdf',
      title: 'Content Creator Multi-Platform Content Engine',
      subtitle: 'YouTube Scripting, TikTok Hooks, Sponsor CRM & Sponsorship Rate Card',
      category: 'Creator Notion OS',
      pages: [
        {
          sectionTitle: '1. Viral Content Production Pipeline',
          intro: 'Manage ideas from raw tweet concept through multi-format repurposing across LinkedIn, Shorts, and Substack.',
          bullets: [
            { title: 'Sponsorship Rate Calculator', desc: 'Built-in formula calculating CPM charges based on 30-day average views.' },
            { title: 'Script Storyboarding', desc: 'Visual 3-second hook tester and B-roll cue list.' }
          ]
        }
      ]
    },
    {
      file: 'SaaS-Product-Roadmap-PRD-Notion-System.pdf',
      title: 'SaaS Product Roadmap & PRD Notion System',
      subtitle: 'Feature Backlog Prioritization, Sprint Planning & User Story Architecture',
      category: 'Product Management Notion OS',
      pages: [
        {
          sectionTitle: '1. RICE Framework Prioritization Matrix',
          intro: 'Score incoming feature requests by Reach, Impact, Confidence, and Effort to eliminate engineering waste.',
          bullets: [
            { title: 'PRD Specifications Template', desc: 'User story, edge-case checklist, and API contract documentation.' },
            { title: 'Release Changelog Hub', desc: 'Public-facing markdown template for monthly customer feature releases.' }
          ]
        }
      ]
    },
    {
      file: 'Client-Portal-Freelance-Dashboard.pdf',
      title: 'Freelance & Agency Client Portal Notion Dashboard',
      subtitle: 'Transparent Milestone Approvals, File Handoffs, Scope Boundaries & Invoices',
      category: 'Agency Notion OS',
      pages: [
        {
          sectionTitle: '1. The Client Onboarding Portal Experience',
          intro: 'Provide high-paying clients with a clean, branded dashboard that prevents scope creep and eliminates endless emails.',
          bullets: [
            { title: 'Milestone Sign-off Block', desc: 'Client click-to-approve status with automated revision counters.' },
            { title: 'Asset Handoff Gallery', desc: 'Figma links, video previews, and final production ZIP download repository.' }
          ]
        }
      ]
    }
  ];

  for (const n of notionKits) {
    await createPDFBook(path.join(NOTION_DIR, n.file), n);
  }

  // 3. ATS Career Resume Suite (4 PDFs in playbooks)
  const resumeKits = [
    {
      file: 'ATS-Tech-Software-Engineer-Resume-Kit.pdf',
      title: 'ATS-Engineered Software Architect & Full-Stack Resume Kit',
      subtitle: 'Keyword Density Matrix, Quantifiable Bullet Formulas & System Design Interview Cheat Sheet',
      category: 'Career Acceleration',
      pages: [
        {
          sectionTitle: '1. The ATS Parser Optimization Blueprint',
          intro: 'How modern Applicant Tracking Systems (Workday, Greenhouse, Lever) parse and score software engineer CVs.',
          bullets: [
            { title: 'Action Verb + Metric Formula', desc: 'Engineered high-throughput Go service reducing p99 latency from 420ms to 48ms under 20k RPS.' },
            { title: 'Keywords Section', desc: 'Exact taxonomy for TypeScript, Next.js, Kubernetes, PostgreSQL, and AWS Architecture.' }
          ]
        }
      ]
    },
    {
      file: 'ATS-Executive-Finance-Director-Resume-Kit.pdf',
      title: 'ATS-Optimized Finance Director & CFO Executive Resume Kit',
      subtitle: 'EBITDA Expansion, M&A Deal Bullet Points & Board Presentation Formats',
      category: 'Executive Career',
      pages: [
        {
          sectionTitle: '1. Quantifiable Executive Bullet Formulas',
          intro: 'Framing corporate balance sheet stewardship and capital allocation for board-level evaluation.',
          bullets: [
            { title: 'M&A Deal Bullet', desc: 'Directed $42M cross-border acquisition, capturing $6.8M in annualized SG&A synergies within 9 months.' },
            { title: 'Cash Runway Expansion', desc: 'Restructured corporate debt facilities, extending runway from 11 to 28 months.' }
          ]
        }
      ]
    },
    {
      file: 'ATS-Product-Manager-Marketing-Resume-Kit.pdf',
      title: 'ATS Product Manager & Growth Marketing Resume Kit',
      subtitle: 'CAC Reduction, PLG Activation Metrics & GTM Bullet Points',
      category: 'Growth Career',
      pages: [
        {
          sectionTitle: '1. High-Impact Product Growth Bullet Formulas',
          intro: 'Framing product-led growth (PLG) initiatives, user onboarding conversion, and retention metrics.',
          bullets: [
            { title: 'Conversion Funnel', desc: 'Redesigned self-serve onboarding flow, elevating trial-to-paid conversion from 3.2% to 7.8%.' },
            { title: 'Feature Launch', desc: 'Spearheaded zero-to-one launch of core analytics engine generating $1.2M ARR in first 180 days.' }
          ]
        }
      ]
    },
    {
      file: 'LinkedIn-Personal-Branding-Inbound-Clients.pdf',
      title: 'LinkedIn Personal Branding & Inbound Client Attraction Playbook',
      subtitle: 'Profile Optimization, Headline Engineering & Inbound Lead DM Conversion Scripts',
      category: 'Inbound Growth',
      pages: [
        {
          sectionTitle: '1. The 100% Inbound Profile Framework',
          intro: 'Transforming a passive digital CV into a high-converting 24/7 client generation sales page.',
          bullets: [
            { title: 'Banner & Tagline Formula', desc: 'I help [Niche] achieve [Desirable Result] without [Painful Mechanism].' },
            { title: 'Featured Section Lead Magnet', desc: 'Drive visitors directly to your storefront or newsletter with zero ad spend.' }
          ]
        }
      ]
    }
  ];

  for (const r of resumeKits) {
    await createPDFBook(path.join(PLAYBOOKS_DIR, r.file), r);
  }

  // 4. Generate 4 New Excel Models (.xlsx)
  const excelModels = [
    {
      file: 'Shopify-Unit-Economics-Contribution-Margin.xlsx',
      sheet: 'Contribution Margin',
      title: 'Shopify E-Commerce Contribution Margin Model',
      headers: ['Product Name', 'Retail Price', 'COGS', 'Payment Fee (3%)', 'Shipping & Pick/Pack', 'Ad Spend (CPA)', 'Gross Margin $', 'Contribution Margin %'],
      data: [
        ['Wireless ANC Headphones', 129.99, 32.50, { formula: 'B4*0.03' }, 9.50, 42.00, { formula: 'B4-C4-D4-E4-F4' }, { formula: 'G4/B4' }],
        ['Ergonomic Desk Mat', 49.99, 8.20, { formula: 'B5*0.03' }, 6.20, 18.00, { formula: 'B5-C5-D5-E5-F5' }, { formula: 'G5/B5' }],
        ['Mechanical Keyboard Pro', 189.00, 48.00, { formula: 'B6*0.03' }, 12.00, 55.00, { formula: 'B6-C6-D6-E6-F6' }, { formula: 'G6/B6' }],
        ['USB-C 100W GaN Charger', 39.99, 7.50, { formula: 'B7*0.03' }, 4.50, 14.00, { formula: 'B7-C7-D7-E7-F7' }, { formula: 'G7/B7' }]
      ]
    },
    {
      file: 'SaaS-Cohort-Retention-Matrix.xlsx',
      sheet: 'Cohort Retention',
      title: 'SaaS Monthly Cohort Retention Matrix (Month 0 - 12)',
      headers: ['Cohort Month', 'Users Acquired', 'M0', 'M1', 'M2', 'M3', 'M6', 'M12'],
      data: [
        ['Jan 2026', 150, 1.0, 0.88, 0.82, 0.78, 0.72, 0.68],
        ['Feb 2026', 180, 1.0, 0.89, 0.84, 0.80, 0.74, 0.70],
        ['Mar 2026', 220, 1.0, 0.91, 0.86, 0.82, 0.76, 0.71],
        ['Apr 2026', 260, 1.0, 0.92, 0.87, 0.83, 0.77, 0.73]
      ]
    },
    {
      file: 'Crypto-DCA-Tax-Lot-Tracker.xlsx',
      sheet: 'DCA Tax Lots',
      title: 'Cryptocurrency DCA & FIFO Tax Lot Accounting Tracker',
      headers: ['Asset', 'Date Purchased', 'Units Bought', 'Purchase Price ($)', 'Cost Basis ($)', 'Current Price ($)', 'Current Value ($)', 'Unrealized Gain ($)'],
      data: [
        ['Bitcoin (BTC)', '2026-01-15', 0.25, 68000, { formula: 'C4*D4' }, 84000, { formula: 'C4*F4' }, { formula: 'G4-E4' }],
        ['Ethereum (ETH)', '2026-02-01', 3.50, 3200, { formula: 'C5*D5' }, 4100, { formula: 'C5*F5' }, { formula: 'G5-E5' }],
        ['Solana (SOL)', '2026-02-20', 25.00, 145, { formula: 'C6*D6' }, 210, { formula: 'C6*F6' }, { formula: 'G6-E6' }]
      ]
    },
    {
      file: 'Agency-Client-Retainer-Billing.xlsx',
      sheet: 'Retainer Billing',
      title: 'Agency Client Retainer & Billable Hours Utilization Ledger',
      headers: ['Client Account', 'Monthly Retainer ($)', 'Allotted Hours', 'Hourly Target ($)', 'Hours Logged', 'Overages (Hrs)', 'Overages Billed ($)', 'Effective Hourly Rate ($)'],
      data: [
        ['Apex Fintech Inc', 5000, 40, { formula: 'B4/C4' }, 44, { formula: 'MAX(0,E4-C4)' }, { formula: 'F4*150' }, { formula: '(B4+G4)/E4' }],
        ['Nova SaaS Global', 7500, 60, { formula: 'B5/C5' }, 58, { formula: 'MAX(0,E5-C5)' }, { formula: 'F5*150' }, { formula: '(B5+G5)/E5' }],
        ['Luminary E-Com', 3500, 25, { formula: 'B6/C6' }, 31, { formula: 'MAX(0,E6-C6)' }, { formula: 'F6*150' }, { formula: '(B6+G6)/E6' }]
      ]
    }
  ];

  for (const m of excelModels) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(m.sheet);

    // Title banner
    ws.mergeCells('A1:H2');
    const titleCell = ws.getCell('A1');
    titleCell.value = m.title;
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Headers
    const headerRow = ws.getRow(4);
    headerRow.values = m.headers;
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Rows
    m.data.forEach((r, idx) => {
      const row = ws.getRow(5 + idx);
      row.values = r;
      row.eachCell((cell) => {
        cell.font = { name: 'Calibri', size: 10.5 };
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    // Auto-fit columns
    ws.columns.forEach(col => {
      col.width = 22;
    });

    await wb.xlsx.writeFile(path.join(EXCEL_DIR, m.file));
  }

  console.log('All trending digital products generated successfully!');
}

run().catch(console.error);
