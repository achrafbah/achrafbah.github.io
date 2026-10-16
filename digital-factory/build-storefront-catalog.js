const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCEL_DIR = path.join(ROOT, 'downloads/excel');
const PLANNERS_DIR = path.join(ROOT, 'downloads/planners');
const PLAYBOOKS_DIR = path.join(ROOT, 'downloads/playbooks');
const AUTOMATIONS_DIR = path.join(ROOT, 'downloads/automations');
const NOTION_DIR = path.join(ROOT, 'downloads/notion');
const BUNDLES_DIR = path.join(ROOT, 'downloads/bundles');

function formatTitle(slug) {
  return slug
    .replace(/\.xlsx$/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/\.json$/i, '')
    .replace(/-(xlsx|pdf|json)$/i, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// 1. Gather Excel Models
const excelFiles = fs.existsSync(EXCEL_DIR) ? fs.readdirSync(EXCEL_DIR).filter(f => f.endsWith('.xlsx')) : [];
console.log(`Found ${excelFiles.length} Excel models.`);

// 2. Gather Planners
const plannerFiles = fs.existsSync(PLANNERS_DIR) ? fs.readdirSync(PLANNERS_DIR).filter(f => f.endsWith('.pdf')) : [];
const plannerGroups = {};
plannerFiles.forEach(f => {
  const match = f.match(/^(.*)_(ocean|sage|rose)\.pdf$/i);
  if (match) {
    const base = match[1];
    const theme = match[2].toLowerCase();
    if (!plannerGroups[base]) plannerGroups[base] = [];
    plannerGroups[base].push(theme);
  }
});
const uniquePlanners = Object.keys(plannerGroups);
console.log(`Found ${uniquePlanners.length} unique planners (${plannerFiles.length} PDFs total).`);

// 3. Gather Playbooks
const playbookFiles = fs.existsSync(PLAYBOOKS_DIR) ? fs.readdirSync(PLAYBOOKS_DIR).filter(f => f.endsWith('.pdf')) : [];
console.log(`Found ${playbookFiles.length} Playbooks & SOP Kits.`);

// 4. Gather Automations
const autoFiles = fs.existsSync(AUTOMATIONS_DIR) ? fs.readdirSync(AUTOMATIONS_DIR).filter(f => f.endsWith('.json') || f.endsWith('.pdf')) : [];
console.log(`Found ${autoFiles.length} Automation Workflows.`);

// 5. Gather Notion Systems
const notionFiles = fs.existsSync(NOTION_DIR) ? fs.readdirSync(NOTION_DIR).filter(f => f.endsWith('.pdf')) : [];
console.log(`Found ${notionFiles.length} Notion Systems.`);

// 6. Gather Bundles
const bundleFiles = fs.existsSync(BUNDLES_DIR) ? fs.readdirSync(BUNDLES_DIR).filter(f => f.endsWith('.zip')) : [];
console.log(`Found ${bundleFiles.length} Mega Bundles.`);

// Build Catalog Cards HTML
let cardsHtml = '';

// A. Interactive Web Tools (9)
const interactiveTools = [
  {
    title: 'Smart Invoice & Receipt Generator',
    url: '/tools/invoice/',
    desc: 'Full-featured interactive invoice maker with real-time tax/discount math, multi-currency ($/€/£/MAD), vector PDF export, CSV export, and draft saving.',
    category: 'interactive finance',
    tier: 'free'
  },
  {
    title: 'Compound Interest, FIRE & Wealth Simulator',
    url: '/tools/wealth-simulator/',
    desc: 'Simulate long-term portfolio compounding, inflation adjustments, and calculate your exact timeline to complete financial freedom (FIRE).',
    category: 'interactive finance',
    tier: 'free'
  },
  {
    title: 'Freelance Rate & Project Proposal Estimator',
    url: '/tools/rate-calculator/',
    desc: 'Calculate sustainable minimum hourly rates, day rates, and retainer quotes factoring in taxes, overhead, and profit margin buffers.',
    category: 'interactive productivity finance',
    tier: 'free'
  },
  {
    title: 'Deep Work & Pomodoro Focus OS',
    url: '/tools/focus-os/',
    desc: 'Browser-based focus operating system with customizable sprint timers, audio chimes, and an interactive 4-quadrant Eisenhower Task Matrix.',
    category: 'interactive productivity',
    tier: 'free'
  },
  {
    title: 'AI Prompt Formatter & Meta-Prompt Architect',
    url: '/tools/prompt-architect/',
    desc: 'Convert vague ideas into production-ready system prompts for Claude, GPT-4o, and Gemini with XML tags, role constraints, and output schemas.',
    category: 'interactive ai productivity',
    tier: 'free'
  },
  {
    title: 'Viral Social Media Hook & Headline Scorer',
    url: '/tools/hook-analyzer/',
    desc: 'Analyze opening lines and headlines for LinkedIn, TikTok, and X. Get real-time viral potential scores and instant psychological rewrites.',
    category: 'interactive marketing',
    tier: 'free'
  },
  {
    title: 'Custom QR Code & Dynamic Link Studio',
    url: '/tools/qr-studio/',
    desc: 'Generate branded, high-resolution QR codes for websites, WiFi networks, WhatsApp, and vCard business cards with instant HD PNG download.',
    category: 'interactive utilities marketing',
    tier: 'free'
  },
  {
    title: 'Privacy Policy & Terms of Service Generator',
    url: '/tools/legal-generator/',
    desc: 'Generate customized GDPR and CCPA-compliant Privacy Policies, Terms of Service, and Cookie Disclaimers for SaaS and Shopify stores in 60s.',
    category: 'interactive legal utilities',
    tier: 'free'
  },
  {
    title: 'SaaS & E-Commerce Unit Economics Simulator',
    url: '/tools/unit-economics/',
    desc: 'Simulate Customer Lifetime Value (LTV), CAC payback velocity, churn decay curves, and venture viability with interactive SVG charts.',
    category: 'interactive finance',
    tier: 'free'
  }
];

interactiveTools.forEach(t => {
  cardsHtml += `
    <div class="tool-card item-card" data-category="${t.category}" data-tier="${t.tier}" data-title="${t.title.toLowerCase()}" data-desc="${t.desc.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge interactive" data-astro-cid-l4z7ivqh>Interactive App</span>
        <span class="tier-badge free" data-astro-cid-l4z7ivqh>Free Tier</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh><a href="${t.url}" data-astro-cid-l4z7ivqh>${t.title}</a></h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>${t.desc}</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Browser Web App • Zero Install • Mobile Responsive</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="${t.url}" class="card-btn primary" data-astro-cid-l4z7ivqh>Launch Tool &rarr;</a>
      </div>
    </div>`;
});

// B. Mega Bundles (ZIP)
const bundles = [
  {
    file: 'Complete-400-Digital-Products-Mega-Bundle.zip',
    title: 'Complete 400+ Digital Products Mega Bundle',
    desc: 'The ultimate commercial empire collection: All 44 Excel models, all 300+ vector PDF planners across 3 color palettes, all 44 AI & SOP playbooks, and all n8n/Make automation workflows.',
    category: 'bundle'
  },
  {
    file: 'All-Automations-and-Notion-Systems-Bundle.zip',
    title: 'All Automations & Notion Systems Suite',
    desc: 'Production-ready n8n/Make.com JSON workflows and 5 comprehensive Notion architecture system guides (Second Brain, Real Estate CRM, Creator Hub).',
    category: 'bundle automations notion'
  },
  {
    file: 'All-40-Business-Excel-Templates-Bundle.zip',
    title: 'All 44 Business & Financial Excel Models',
    desc: 'Every executive spreadsheet: SaaS MRR/ARR, Real Estate Cash Flow, Unit Economics, Cap Table, ROAS Pricing, and 39 more fully formula-driven models.',
    category: 'bundle excel'
  },
  {
    file: 'All-300-Printable-Planners-Bundle.zip',
    title: 'All 300+ Printable & Tablet PDF Planners',
    desc: 'Massive library of 102 unique planners each in Ocean Blue, Sage Green, and Rose Gold. Executive OKR, ADHD Focus, Budget, Fitness, and Travel binders.',
    category: 'bundle planner'
  },
  {
    file: 'All-40-AI-Prompts-and-SOP-Kits-Bundle.zip',
    title: 'All 44 AI Prompt Bibles, SOPs & ATS Kits',
    desc: 'The 500+ AI Prompts Mega Bible, Faceless Content Engine, ATS-Engineered Resume Kits, and Agency Client Onboarding Standard Operating Procedures.',
    category: 'bundle playbook'
  }
];

bundles.forEach(b => {
  cardsHtml += `
    <div class="tool-card item-card bundle-highlight" data-category="${b.category}" data-tier="pro" data-title="${b.title.toLowerCase()}" data-desc="${b.desc.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge bundle" data-astro-cid-l4z7ivqh>Mega Bundle (ZIP)</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO ALL-ACCESS</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${b.title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>${b.desc}</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Full ZIP Archive • Commercial License • Instant Download</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/bundles/${b.file}" class="card-btn primary" download data-astro-cid-l4z7ivqh>Direct ZIP Download &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Unlock VIP ($29)</button>
      </div>
    </div>`;
});

// C. Automation Workflows (JSON / PDF)
autoFiles.forEach(f => {
  const isJson = f.endsWith('.json');
  const title = formatTitle(f);
  cardsHtml += `
    <div class="tool-card item-card" data-category="automations ai" data-tier="pro" data-title="${title.toLowerCase()}" data-desc="automation workflow json" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge" style="background: #ede9fe; color: #7c3aed;" data-astro-cid-l4z7ivqh>${isJson ? 'Automation JSON' : 'Master Guide'}</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Production-ready automation scenario blueprint for ${isJson ? 'n8n or Make.com with pre-built nodes, API authentication, and error loops' : 'autonomous multi-agent architecture and deployment'}.</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>${isJson ? 'Import-Ready Workflow JSON' : 'Comprehensive PDF Guide'} • Zero Code Config</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/automations/${f}" class="card-btn secondary" download data-astro-cid-l4z7ivqh>Download ${isJson ? 'JSON' : 'PDF'} &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Pro ($29)</button>
      </div>
    </div>`;
});

// D. Notion Systems (PDF Guides & Templates)
notionFiles.forEach(f => {
  const title = formatTitle(f);
  cardsHtml += `
    <div class="tool-card item-card" data-category="notion productivity" data-tier="pro" data-title="${title.toLowerCase()}" data-desc="notion database architecture" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge" style="background: #fef3c7; color: #b45309;" data-astro-cid-l4z7ivqh>Notion System</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Full database schema, relation formulas, rollups, and structured dashboard layout designed for high-performance productivity.</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Notion Architecture PDF Guide & Direct Template Blueprint</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/notion/${f}" class="card-btn secondary" download data-astro-cid-l4z7ivqh>Download PDF &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Pro ($29)</button>
      </div>
    </div>`;
});

// E. Excel Models (44)
excelFiles.forEach(f => {
  const title = formatTitle(f);
  cardsHtml += `
    <div class="tool-card item-card" data-category="excel finance ops" data-tier="pro" data-title="${title.toLowerCase()}" data-desc="${title.toLowerCase()} automated excel template" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge excel" data-astro-cid-l4z7ivqh>Excel (.xlsx)</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Executive-grade multi-sheet financial and operational model. Features dynamic formulas, formatted KPI cards, and realistic pre-filled data rows.</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Microsoft Excel & Google Sheets Compatible • Unlocked Formulas</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/excel/${f}" class="card-btn secondary" download data-astro-cid-l4z7ivqh>Download .xlsx &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Pro ($29)</button>
      </div>
    </div>`;
});

// F. Printable Planners (102 unique)
uniquePlanners.forEach(base => {
  const title = formatTitle(base);
  cardsHtml += `
    <div class="tool-card item-card planner-card" data-category="planner productivity wellness lifestyle" data-tier="free" data-title="${title.toLowerCase()}" data-desc="${title.toLowerCase()} printable pdf planner" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge pdf" data-astro-cid-l4z7ivqh>Printable PDF</span>
        <span class="tier-badge free" data-astro-cid-l4z7ivqh>Free Tier</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>High-resolution vector printable and GoodNotes/iPad planner. Available in 3 signature color palettes: Ocean Blue, Sage Green, and Rose Gold.</p>
      <div class="theme-options" data-astro-cid-l4z7ivqh>
        <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;" data-astro-cid-l4z7ivqh>Palettes:</span>
        <a href="/downloads/planners/${base}_ocean.pdf" class="color-dot ocean active" download title="Download Ocean Blue Theme" data-astro-cid-l4z7ivqh></a>
        <a href="/downloads/planners/${base}_sage.pdf" class="color-dot sage" download title="Download Sage Green Theme" data-astro-cid-l4z7ivqh></a>
        <a href="/downloads/planners/${base}_rose.pdf" class="color-dot rose" download title="Download Rose Gold Theme" data-astro-cid-l4z7ivqh></a>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/planners/${base}_ocean.pdf" class="card-btn secondary planner-dl" download data-astro-cid-l4z7ivqh>Download PDF (Ocean) &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Pro Bundle</button>
      </div>
    </div>`;
});

// G. Playbooks & SOP Kits (44)
playbookFiles.forEach(f => {
  const title = formatTitle(f);
  cardsHtml += `
    <div class="tool-card item-card" data-category="playbook ai career" data-tier="pro" data-title="${title.toLowerCase()}" data-desc="${title.toLowerCase()} playbook sop guide" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge" style="background: #e0e7ff; color: #4338ca;" data-astro-cid-l4z7ivqh>AI Bible & SOP</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Executive standard operating procedure, prompt engineering vault, and career playbooks with copy-pasteable templates.</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Full E-Book Edition • Commercial Ready • Verified Frameworks</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <a href="/downloads/playbooks/${f}" class="card-btn secondary" download data-astro-cid-l4z7ivqh>Download Guide (PDF) &darr;</a>
        <button class="card-btn pro-btn" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Pro ($29)</button>
      </div>
    </div>`;
});

// Build Storefront HTML
const storefrontPath = path.join(ROOT, 'tools/index.html');
const storefrontHtml = `<!DOCTYPE html>
<html lang="en" data-astro-cid-l4z7ivqh>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tools & Business Templates Catalog (400+) | SmartCents Digital Studio</title>
  <meta name="description" content="Explore 400+ verified commercial assets: 9 interactive SaaS apps, 44 automated Excel models, 300+ vector PDF planners across 3 color themes, and 50+ AI prompt bibles and n8n automations.">
  <link rel="stylesheet" href="/_astro/index.HiuEWove.css">
  <link rel="stylesheet" href="/_astro/UpgradeModal.rCoh7SEV.css">
  <style data-astro-cid-l4z7ivqh>
    .store-hero { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 4rem 1.5rem; text-align: center; border-bottom: 1px solid #334155; }
    .store-hero h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 1rem; letter-spacing: -0.02em; }
    .store-hero p { font-size: 1.15rem; color: #94a3b8; max-width: 760px; margin: 0 auto 1.5rem; }
    .search-filter-section { max-width: 1200px; margin: -2rem auto 2.5rem; padding: 0 1rem; position: relative; z-index: 10; }
    .search-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.25rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 1rem; }
    .search-input-wrapper { position: relative; width: 100%; }
    .search-input { width: 100%; padding: 0.9rem 1.2rem 0.9rem 2.8rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1rem; outline: none; transition: border-color .15s; }
    .search-input:focus { border-color: #0f9d58; box-shadow: 0 0 0 3px rgba(15,157,88,0.15); }
    .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 1.1rem; }
    .filter-pills { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .pill { background: #f1f5f9; border: 1px solid #e2e8f0; padding: 0.4rem 0.85rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; color: #475569; cursor: pointer; transition: all .15s; }
    .pill:hover { background: #e2e8f0; color: #0f172a; }
    .pill.active { background: #0f172a; color: #fff; border-color: #0f172a; }
    .catalog-grid { max-width: 1200px; margin: 0 auto; padding: 0 1rem 4rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
    .item-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between; transition: transform .2s, box-shadow .2s; }
    .item-card:hover { transform: translateY(-3px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08); }
    .bundle-highlight { border: 2px solid #0f9d58; background: #f0fdf4; }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .type-badge { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; text-transform: uppercase; }
    .type-badge.interactive { background: #e0f2fe; color: #0284c7; }
    .type-badge.excel { background: #dcfce7; color: #15803d; }
    .type-badge.pdf { background: #fee2e2; color: #b91c1c; }
    .type-badge.bundle { background: #fef3c7; color: #b45309; }
    .tier-badge { font-size: 0.75rem; font-weight: 700; padding: 0.2rem 0.55rem; border-radius: 6px; }
    .tier-badge.free { background: #f1f5f9; color: #475569; }
    .tier-badge.pro { background: #0f172a; color: #fff; }
    .item-card h3 { font-size: 1.15rem; color: #0f172a; margin-bottom: 0.5rem; line-height: 1.4; }
    .item-card h3 a { color: inherit; text-decoration: none; }
    .card-desc { font-size: 0.9rem; color: #64748b; line-height: 1.5; margin-bottom: 1rem; flex-grow: 1; }
    .card-meta { font-size: 0.78rem; color: #94a3b8; margin-bottom: 1rem; border-top: 1px solid #f1f5f9; padding-top: 0.5rem; }
    .theme-options { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .color-dot { width: 18px; height: 18px; border-radius: 50%; display: inline-block; cursor: pointer; border: 2px solid #fff; box-shadow: 0 0 0 1px #cbd5e1; transition: transform .15s; }
    .color-dot:hover { transform: scale(1.2); }
    .color-dot.ocean { background: #0284c7; }
    .color-dot.sage { background: #0f9d58; }
    .color-dot.rose { background: #e11d48; }
    .card-footer { display: flex; gap: 0.5rem; }
    .card-btn { flex: 1; text-align: center; padding: 0.65rem 0.85rem; border-radius: 8px; font-weight: 600; font-size: 0.88rem; text-decoration: none; cursor: pointer; transition: all .15s; border: none; }
    .card-btn.primary { background: #0f9d58; color: #fff; }
    .card-btn.primary:hover { background: #0b8043; }
    .card-btn.secondary { background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; }
    .card-btn.secondary:hover { background: #e2e8f0; }
    .card-btn.pro-btn { background: #0f172a; color: #fff; }
    .card-btn.pro-btn:hover { background: #1e293b; }
    .saas-showcase { max-width: 1200px; margin: 0 auto 3rem; padding: 0 1rem; }
    .saas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
    .saas-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; text-align: left; transition: all .2s; text-decoration: none; color: inherit; display: block; }
    .saas-card:hover { transform: translateY(-2px); border-color: #0f9d58; box-shadow: 0 8px 16px -4px rgba(0,0,0,0.06); }
    .saas-title { font-weight: 700; font-size: 1rem; color: #0f172a; margin-bottom: 0.35rem; }
    .saas-desc { font-size: 0.82rem; color: #64748b; line-height: 1.4; }
  </style>
</head>
<body data-astro-cid-l4z7ivqh>
  <header data-astro-cid-l4z7ivqh>
    <a href="/" class="brand" data-astro-cid-l4z7ivqh>SmartCents</a>
    <nav data-astro-cid-l4z7ivqh>
      <a href="/category/saving/" data-astro-cid-l4z7ivqh>Saving</a>
      <a href="/category/budgeting/" data-astro-cid-l4z7ivqh>Budgeting</a>
      <a href="/category/investing/" data-astro-cid-l4z7ivqh>Investing</a>
      <a href="/category/side-hustles/" data-astro-cid-l4z7ivqh>Side Hustles</a>
      <a href="/tools/" class="active" data-astro-cid-l4z7ivqh>Tools & Templates (400+)</a>
      <a href="/about/" data-astro-cid-l4z7ivqh>About</a>
    </nav>
  </header>

  <div class="store-hero" data-astro-cid-l4z7ivqh>
    <span class="tool-badge" style="background: rgba(15,157,88,0.2); color: #34d399; margin-bottom: 0.75rem;" data-astro-cid-l4z7ivqh>⭐ 400+ COMMERCIAL DIGITAL ASSETS</span>
    <h1 data-astro-cid-l4z7ivqh>Digital Products & Template Empire</h1>
    <p data-astro-cid-l4z7ivqh>Accelerate your business and wealth with 9 interactive SaaS utilities, 44 automated Excel financial models, 300+ vector PDF planners across 3 signature palettes, and 50+ AI prompt bibles & n8n automations.</p>
    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;" data-astro-cid-l4z7ivqh>
      <button class="card-btn" style="background: #0f9d58; color: #fff; max-width: 280px; padding: 0.85rem 1.5rem; font-size: 1rem;" onclick="openUpgradeModal()" data-astro-cid-l4z7ivqh>Unlock VIP Lifetime Pass ($29) &rarr;</button>
      <a href="/downloads/bundles/Complete-400-Digital-Products-Mega-Bundle.zip" class="card-btn" style="background: #1e293b; color: #fff; max-width: 280px; padding: 0.85rem 1.5rem; font-size: 1rem;" download data-astro-cid-l4z7ivqh>Download All 400+ Files (ZIP) &darr;</a>
    </div>
  </div>

  <div class="saas-showcase" data-astro-cid-l4z7ivqh>
    <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem; text-align: center;" data-astro-cid-l4z7ivqh>⚡ 9 FEATURED INTERACTIVE WEB SAAS SUITES</h2>
    <div class="saas-grid" data-astro-cid-l4z7ivqh>
      <a href="/tools/invoice/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Smart Invoice Maker</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Real-time taxes, multi-currency ($/€/£/MAD), vector PDF export & CSV.</div>
      </a>
      <a href="/tools/wealth-simulator/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>FIRE & Wealth Simulator</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Visual compounding curves, inflation adjustment & retirement timeline.</div>
      </a>
      <a href="/tools/rate-calculator/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Freelance Rate Estimator</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Sustainable hourly/day rates, overhead buffers, and client quote builder.</div>
      </a>
      <a href="/tools/focus-os/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Deep Work & Pomodoro OS</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Sprint focus timers, audio chimes, and interactive 4-quadrant Eisenhower board.</div>
      </a>
      <a href="/tools/prompt-architect/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>AI Prompt Architect</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Format enterprise system prompts with XML tags and role schemas for Claude & GPT.</div>
      </a>
      <a href="/tools/hook-analyzer/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Viral Hook Scorer</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>Live 0-100% viral score, emotional triggers, and instant psychological rewrites.</div>
      </a>
      <a href="/tools/qr-studio/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>QR Code Studio</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>High-res custom QR codes for websites, WiFi networks, WhatsApp, and vCards.</div>
      </a>
      <a href="/tools/legal-generator/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Legal Policy Maker</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>GDPR & CCPA-compliant Privacy Policies and Terms of Service in 60s.</div>
      </a>
      <a href="/tools/unit-economics/" class="saas-card" data-astro-cid-l4z7ivqh>
        <div class="saas-title" data-astro-cid-l4z7ivqh>Unit Economics Simulator</div>
        <div class="saas-desc" data-astro-cid-l4z7ivqh>LTV/CAC ratios, CAC payback velocity, and 24-month cohort decay charts.</div>
      </a>
    </div>
  </div>

  <div class="search-filter-section" data-astro-cid-l4z7ivqh>
    <div class="search-card" data-astro-cid-l4z7ivqh>
      <div class="search-input-wrapper" data-astro-cid-l4z7ivqh>
        <span class="search-icon" data-astro-cid-l4z7ivqh>🔍</span>
        <input type="text" id="catalogSearch" class="search-input" placeholder="Search 400+ templates, SaaS apps, planners, Excel models, or AI playbooks..." oninput="filterCatalog()" data-astro-cid-l4z7ivqh>
      </div>
      <div class="filter-pills" data-astro-cid-l4z7ivqh>
        <button class="pill active" onclick="setCategory('all')" data-astro-cid-l4z7ivqh>All Products (400+ Files)</button>
        <button class="pill" onclick="setCategory('bundle')" data-astro-cid-l4z7ivqh>Mega Bundles (ZIP)</button>
        <button class="pill" onclick="setCategory('interactive')" data-astro-cid-l4z7ivqh>Interactive SaaS Apps (9)</button>
        <button class="pill" onclick="setCategory('automations')" data-astro-cid-l4z7ivqh>Automation Workflows (6)</button>
        <button class="pill" onclick="setCategory('notion')" data-astro-cid-l4z7ivqh>Notion Systems (5)</button>
        <button class="pill" onclick="setCategory('excel')" data-astro-cid-l4z7ivqh>Business Excel (44)</button>
        <button class="pill" onclick="setCategory('planner')" data-astro-cid-l4z7ivqh>Printable Planners (300+)</button>
        <button class="pill" onclick="setCategory('ai')" data-astro-cid-l4z7ivqh>AI Bibles & Prompts (20)</button>
        <button class="pill" onclick="setCategory('career')" data-astro-cid-l4z7ivqh>ATS Career & SOP Kits (24)</button>
      </div>
    </div>
  </div>

  <div class="catalog-grid" id="catalogGrid" data-astro-cid-l4z7ivqh>
    ${cardsHtml}
  </div>

  <!-- PayPal Checkout Modal -->
  <div id="upgradeModal" class="modal-backdrop" style="display: none;" data-astro-cid-l4z7ivqh>
    <div class="modal-card" style="background: #fff; max-width: 500px; margin: 5vh auto; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); position: relative;" data-astro-cid-l4z7ivqh>
      <button onclick="closeUpgradeModal()" style="position: absolute; right: 1.25rem; top: 1.25rem; background: none; border: none; font-size: 1.4rem; cursor: pointer;" data-astro-cid-l4z7ivqh>&times;</button>
      <span class="tool-badge" style="background: #dcfce7; color: #15803d; margin-bottom: 0.5rem;" data-astro-cid-l4z7ivqh>⭐ VERIFIED COMMERCIAL LICENSE</span>
      <h2 style="font-size: 1.6rem; color: #0f172a; margin-bottom: 0.5rem;" data-astro-cid-l4z7ivqh>Upgrade to Pro & Unlock Everything</h2>
      <p style="font-size: 0.95rem; color: #64748b; margin-bottom: 1.5rem;" data-astro-cid-l4z7ivqh>Get immediate commercial download access to all 400+ digital assets, 44 financial Excel models, 300+ vector PDF planners across 3 palettes, 50+ AI prompt bibles and n8n workflows.</p>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;" data-astro-cid-l4z7ivqh>
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;" data-astro-cid-l4z7ivqh>
          <span style="font-weight: 700; color: #0f172a;" data-astro-cid-l4z7ivqh>Lifetime VIP Unlimited Access</span>
          <span style="font-size: 1.5rem; font-weight: 800; color: #0f9d58;" data-astro-cid-l4z7ivqh>$29 <span style="font-size: 0.85rem; color: #64748b; font-weight: 450;" data-astro-cid-l4z7ivqh>one-time</span></span>
        </div>
        <p style="font-size: 0.8rem; color: #64748b; margin: 0;" data-astro-cid-l4z7ivqh>Includes lifetime updates, all future templates, and direct instant delivery of the Mega ZIP bundle.</p>
      </div>

      <!-- Live PayPal Button -->
      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" style="text-align: center;" data-astro-cid-l4z7ivqh>
        <input type="hidden" name="cmd" value="_xclick">
        <input type="hidden" name="business" value="htcmobile.ab@gmail.com">
        <input type="hidden" name="item_name" value="SmartCents Pro 400+ Complete Digital Products Mega Bundle">
        <input type="hidden" name="amount" value="29.00">
        <input type="hidden" name="currency_code" value="USD">
        <input type="hidden" name="return" value="https://achrafbah.github.io/tools/">
        <input type="hidden" name="cancel_return" value="https://achrafbah.github.io/tools/">
        <button type="submit" class="card-btn primary" style="width: 100%; padding: 0.85rem; font-size: 1rem; border: none; cursor: pointer;" data-astro-cid-l4z7ivqh>
          Pay $29 with PayPal Secure Checkout &rarr;
        </button>
      </form>
      <div style="text-align: center; margin-top: 1rem; font-size: 0.78rem; color: #94a3b8;" data-astro-cid-l4z7ivqh>
        🔒 256-Bit SSL Encrypted • Verified Merchant htcmobile.ab@gmail.com
      </div>
    </div>
  </div>

  <footer style="background: #0f172a; color: #94a3b8; padding: 3rem 1.5rem; text-align: center; border-top: 1px solid #1e293b;" data-astro-cid-l4z7ivqh>
    <p style="margin-bottom: 0.5rem;" data-astro-cid-l4z7ivqh>&copy; 2026 SmartCents Studio &bull; Curated by Achraf Bahloul</p>
    <p style="font-size: 0.85rem;" data-astro-cid-l4z7ivqh>Commercial Digital Assets, Interactive Web SaaS Tools & Automation Blueprints.</p>
  </footer>

  <script data-astro-cid-l4z7ivqh>
    let activeCat = 'all';

    function setCategory(cat) {
      activeCat = cat;
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      event.target.classList.add('active');
      filterCatalog();
    }

    function filterCatalog() {
      const q = (document.getElementById('catalogSearch').value || '').toLowerCase().trim();
      const cards = document.querySelectorAll('.item-card');

      cards.forEach(card => {
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const title = (card.getAttribute('data-title') || '').toLowerCase();
        const desc = (card.getAttribute('data-desc') || '').toLowerCase();

        const matchesCat = (activeCat === 'all') || cat.includes(activeCat);
        const matchesQuery = !q || title.includes(q) || desc.includes(q);

        card.style.display = (matchesCat && matchesQuery) ? 'flex' : 'none';
      });
    }

    // Color theme swapper on planner cards
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('color-dot')) {
        e.preventDefault();
        const parent = e.target.closest('.planner-card');
        if (!parent) return;

        parent.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        e.target.classList.add('active');

        const dlBtn = parent.querySelector('.planner-dl');
        if (dlBtn) {
          dlBtn.href = e.target.href;
          const themeName = e.target.classList.contains('ocean') ? 'Ocean' : e.target.classList.contains('sage') ? 'Sage' : 'Rose';
          dlBtn.textContent = 'Download PDF (' + themeName + ') ↓';
        }
      }
    });

    function openUpgradeModal() {
      document.getElementById('upgradeModal').style.display = 'block';
    }

    function closeUpgradeModal() {
      document.getElementById('upgradeModal').style.display = 'none';
    }
  </script>
</body>
</html>`;

fs.writeFileSync(storefrontPath, storefrontHtml, 'utf8');
console.log('Successfully updated tools/index.html with all 400+ assets!');

// Also update homepage index.html
const homePath = path.join(ROOT, 'index.html');
let homeHtml = fs.readFileSync(homePath, 'utf8');
homeHtml = homeHtml.replace(/380\+/g, '400+').replace(/4 interactive/g, '9 interactive');
fs.writeFileSync(homePath, homeHtml, 'utf8');
console.log('Successfully updated index.html with 400+ assets and 9 interactive SaaS tools!');
