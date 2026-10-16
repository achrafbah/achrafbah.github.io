const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../achrafbah.github.io-main');
const EXCEL_DIR = path.join(ROOT, 'downloads/excel');
const PLANNERS_DIR = path.join(ROOT, 'downloads/planners');
const PLAYBOOKS_DIR = path.join(ROOT, 'downloads/playbooks');
const BUNDLES_DIR = path.join(ROOT, 'downloads/bundles');

function formatTitle(slug) {
  return slug
    .replace(/\.xlsx$/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/-(xlsx|pdf)$/i, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// 1. Gather Excel Models
const excelFiles = fs.readdirSync(EXCEL_DIR).filter(f => f.endsWith('.xlsx'));
console.log(`Found ${excelFiles.length} Excel models.`);

// 2. Gather Planners (grouped by base name)
const plannerFiles = fs.readdirSync(PLANNERS_DIR).filter(f => f.endsWith('.pdf'));
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

// 3. Gather Playbooks & SOP Kits
const playbookFiles = fs.readdirSync(PLAYBOOKS_DIR).filter(f => f.endsWith('.pdf'));
console.log(`Found ${playbookFiles.length} Playbooks & SOP Kits.`);

// 4. Gather Bundles
const bundleFiles = fs.readdirSync(BUNDLES_DIR).filter(f => f.endsWith('.zip'));
console.log(`Found ${bundleFiles.length} Mega Bundles.`);

// Build Catalog Cards HTML
let cardsHtml = '';

// A. Interactive Web Tools (4)
const interactiveTools = [
  {
    title: 'Smart Invoice & Receipt Generator',
    url: '/tools/invoice/',
    desc: 'Full-featured interactive invoice maker with real-time tax/discount math, multi-currency ($/€/£/CAD/AUD), vector PDF export, CSV export, and draft saving.',
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
    desc: 'Browser-based focus operating system with customizable timers, audio chimes, and an interactive 4-quadrant Eisenhower Task Matrix.',
    category: 'interactive productivity',
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

// B. Mega Bundles (5)
const bundles = [
  {
    file: 'Complete-380-Digital-Products-Mega-Bundle.zip',
    title: 'Complete 380+ Digital Products Mega Bundle',
    desc: 'The ultimate VIP package: all 40 Excel models, all 300+ vector PDF planners (Ocean/Sage/Rose), and all 40 AI Playbooks & SOP Kits.',
    badge: 'VIP BUNDLE',
    category: 'bundle all',
    tier: 'pro',
    price: '$29'
  },
  {
    file: 'All-40-Business-Excel-Templates-Bundle.zip',
    title: 'All 40 Business & Financial Excel Models',
    desc: 'Complete workbook collection covering SaaS, P&L, Real Estate ROI, Cash Flow, E-Com ROAS, Cap Table, Agile, and HR.',
    badge: 'EXCEL BUNDLE',
    category: 'bundle spreadsheet finance operations',
    tier: 'pro',
    price: '$19'
  },
  {
    file: 'All-300-Printable-Planners-Bundle.zip',
    title: 'All 300+ Printable & Tablet PDF Planners',
    desc: '102 unique planners in 3 signature themes (Ocean, Sage, Rose) covering Executive, ADHD, Wealth, Fitness, Home, and Academic.',
    badge: 'PLANNER BUNDLE',
    category: 'bundle planner productivity wellness lifestyle',
    tier: 'pro',
    price: '$19'
  },
  {
    file: 'All-40-AI-Prompts-and-SOP-Kits-Bundle.zip',
    title: 'All 40 AI Prompt Bibles & Business SOP Kits',
    desc: 'Commercial digital books & playbooks: 500+ AI Prompts Bible, Agency Client Onboarding, Solopreneur AI OS, and Career Kits.',
    badge: 'PLAYBOOK BUNDLE',
    category: 'bundle playbook operations productivity',
    tier: 'pro',
    price: '$19'
  }
];

bundles.forEach(b => {
  cardsHtml += `
    <div class="tool-card item-card bundle-highlight-card" data-category="${b.category}" data-tier="pro" data-title="${b.title.toLowerCase()}" data-desc="${b.desc.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge" style="background:#fef3c7; color:#b45309;" data-astro-cid-l4z7ivqh>${b.badge}</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>BESTSELLER</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${b.title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>${b.desc}</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Instant ZIP Archive • Commercial Lifetime Rights</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <button class="card-btn pro-btn" data-download-url="/downloads/bundles/${b.file}" onclick="if(localStorage.getItem('biztools_pro_active')==='true'){window.location.href='/downloads/bundles/${b.file}';}else{window.openUpgradeModal('${b.title.replace(/'/g, "\\'")}');}" data-astro-cid-l4z7ivqh>
          <svg class="lock-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-l4z7ivqh><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-astro-cid-l4z7ivqh></path></svg>
          <span class="pro-btn-label" data-astro-cid-l4z7ivqh>Unlock Bundle (${b.price})</span>
        </button>
      </div>
    </div>`;
});

// C. Excel Spreadsheets (40)
excelFiles.forEach((file, idx) => {
  const title = formatTitle(file);
  const isFree = idx < 3; // First 3 free starter
  const tier = isFree ? 'free' : 'pro';
  const category = file.toLowerCase().includes('roas') || file.toLowerCase().includes('hr') || file.toLowerCase().includes('warehouse') || file.toLowerCase().includes('agile') || file.toLowerCase().includes('inventory')
    ? 'spreadsheet operations'
    : 'spreadsheet finance';

  cardsHtml += `
    <div class="tool-card item-card" data-category="${category}" data-tier="${tier}" data-title="${title.toLowerCase()} ${file.toLowerCase()}" data-desc="professional formula-driven excel model for ${title.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge excel" data-astro-cid-l4z7ivqh>Excel .XLSX</span>
        <span class="tier-badge ${tier}" data-astro-cid-l4z7ivqh>${tier.toUpperCase()}</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Executive formula-driven workbook with KPI summary dashboard, dynamic calculations, and structured data tables.</p>
      <div class="formula-tags" data-astro-cid-l4z7ivqh>
        <span class="formula-label" data-astro-cid-l4z7ivqh>Formulas:</span><code data-astro-cid-l4z7ivqh>SUM, IF, AVERAGE, KPI Models</code>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        ${isFree
          ? `<a href="/downloads/excel/${file}" download class="card-btn secondary" data-astro-cid-l4z7ivqh>Get Free Template &darr;</a>`
          : `<button class="card-btn pro-btn" data-download-url="/downloads/excel/${file}" onclick="if(localStorage.getItem('biztools_pro_active')==='true'){window.location.href='/downloads/excel/${file}';}else{window.openUpgradeModal('${title.replace(/'/g, "\\'")}');}" data-astro-cid-l4z7ivqh>
              <svg class="lock-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-l4z7ivqh><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-astro-cid-l4z7ivqh></path></svg>
              <span class="pro-btn-label" data-astro-cid-l4z7ivqh>Unlock with Pro ($7)</span>
            </button>`
        }
      </div>
    </div>`;
});

// D. Printable & Digital Planners (102 Unique Planners)
uniquePlanners.forEach((base, idx) => {
  const title = formatTitle(base);
  const isFree = idx < 2; // First 2 free
  const tier = isFree ? 'free' : 'pro';

  let subCategory = 'productivity';
  const l = base.toLowerCase();
  if (l.includes('budget') || l.includes('debt') || l.includes('spend') || l.includes('wealth') || l.includes('sinking') || l.includes('tax') || l.includes('expense') || l.includes('savings')) subCategory = 'finance';
  else if (l.includes('workout') || l.includes('meal') || l.includes('health') || l.includes('sleep') || l.includes('cbt') || l.includes('75-day') || l.includes('running') || l.includes('hydration') || l.includes('mindful')) subCategory = 'wellness';
  else if (l.includes('home') || l.includes('travel') || l.includes('cleaning') || l.includes('wedding') || l.includes('family') || l.includes('pet') || l.includes('garden') || l.includes('spiritual')) subCategory = 'lifestyle';
  else if (l.includes('exam') || l.includes('study') || l.includes('language') || l.includes('creator') || l.includes('reading') || l.includes('research') || l.includes('college') || l.includes('script') || l.includes('seller')) subCategory = 'academic';

  cardsHtml += `
    <div class="tool-card item-card" data-category="planner ${subCategory}" data-tier="${tier}" data-title="${title.toLowerCase()} ${base.toLowerCase()}" data-desc="printable and tablet vector pdf planner for ${title.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge pdf" data-astro-cid-l4z7ivqh>PDF Planner</span>
        <span class="tier-badge ${tier}" data-astro-cid-l4z7ivqh>${tier.toUpperCase()}</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>High-resolution vector printable planner and digital tablet journal with priority matrices, habit checkboxes, and ruled pages.</p>
      <div class="planner-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>US Letter • Multi-Page Vector</span>
        <div class="theme-dots" title="Click dot to select Ocean, Sage, or Rose theme" data-astro-cid-l4z7ivqh>
          <span class="dot ocean active-dot" onclick="switchPlannerTheme(this, '${base}', 'ocean')" data-astro-cid-l4z7ivqh></span>
          <span class="dot sage" onclick="switchPlannerTheme(this, '${base}', 'sage')" data-astro-cid-l4z7ivqh></span>
          <span class="dot rose" onclick="switchPlannerTheme(this, '${base}', 'rose')" data-astro-cid-l4z7ivqh></span>
        </div>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        ${isFree
          ? `<a id="link-${base}" href="/downloads/planners/${base}_ocean.pdf" download class="card-btn secondary" data-astro-cid-l4z7ivqh>Get Free PDF (Ocean) &darr;</a>`
          : `<button id="btn-${base}" class="card-btn pro-btn" data-download-url="/downloads/planners/${base}_ocean.pdf" onclick="if(localStorage.getItem('biztools_pro_active')==='true'){window.location.href=this.getAttribute('data-download-url');}else{window.openUpgradeModal('${title.replace(/'/g, "\\'")}');}" data-astro-cid-l4z7ivqh>
              <svg class="lock-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-l4z7ivqh><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-astro-cid-l4z7ivqh></path></svg>
              <span class="pro-btn-label" data-astro-cid-l4z7ivqh>Unlock PDF (${title.length > 20 ? 'Planner' : title})</span>
            </button>`
        }
      </div>
    </div>`;
});

// E. AI Prompt Bibles & Business SOP Kits (40)
playbookFiles.forEach(file => {
  const title = formatTitle(file);
  const isAI = file.toLowerCase().includes('ai') || file.toLowerCase().includes('prompt') || file.toLowerCase().includes('chatgpt') || file.toLowerCase().includes('claude') || file.toLowerCase().includes('midjourney');
  const catBadge = isAI ? 'AI Prompt Bible' : 'Business SOP Kit';
  const badgeColor = isAI ? '#7c3aed' : '#0284c7';
  const badgeBg = isAI ? '#ede9fe' : '#e0f2fe';
  const subCategory = isAI ? 'playbook productivity' : 'playbook operations';

  cardsHtml += `
    <div class="tool-card item-card" data-category="${subCategory}" data-tier="pro" data-title="${title.toLowerCase()} ${file.toLowerCase()}" data-desc="comprehensive digital playbook and execution vault for ${title.toLowerCase()}" data-astro-cid-l4z7ivqh>
      <div class="card-top" data-astro-cid-l4z7ivqh>
        <span class="type-badge" style="background:${badgeBg}; color:${badgeColor};" data-astro-cid-l4z7ivqh>${catBadge}</span>
        <span class="tier-badge pro" data-astro-cid-l4z7ivqh>PRO GUIDE</span>
      </div>
      <h3 data-astro-cid-l4z7ivqh>${title}</h3>
      <p class="card-desc" data-astro-cid-l4z7ivqh>Comprehensive digital playbook featuring step-by-step systems, copy-paste prompt vaults, checklists, and implementation frameworks.</p>
      <div class="card-meta" data-astro-cid-l4z7ivqh>
        <span data-astro-cid-l4z7ivqh>Full-Length Digital PDF • Lifetime Commercial License</span>
      </div>
      <div class="card-footer" data-astro-cid-l4z7ivqh>
        <button class="card-btn pro-btn" data-download-url="/downloads/playbooks/${file}" onclick="if(localStorage.getItem('biztools_pro_active')==='true'){window.location.href='/downloads/playbooks/${file}';}else{window.openUpgradeModal('${title.replace(/'/g, "\\'")}');}" data-astro-cid-l4z7ivqh>
          <svg class="lock-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-l4z7ivqh><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" data-astro-cid-l4z7ivqh></path></svg>
          <span class="pro-btn-label" data-astro-cid-l4z7ivqh>Unlock Playbook ($7)</span>
        </button>
      </div>
    </div>`;
});

// Construct full tools/index.html
const catalogHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Tools &amp; Business Templates Catalog | SmartCents Digital Studio</title><meta name="description" content="Explore over 380 professional digital products: interactive SaaS tools, formula-driven Excel models, vector printable planners, AI prompt bibles, and business SOP kits."><link rel="canonical" href="https://achrafbah.github.io/tools/"><link rel="sitemap" href="/sitemap-index.xml"><link rel="alternate" type="application/rss+xml" title="SmartCents" href="/rss.xml"><style>:root{--text:#1c1c1e;--muted:#6b7280;--bg:#fff;--card:#f7f7f9}*{box-sizing:border-box}body{color:var(--text);background:var(--bg);margin:0;font:18px/1.7 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}a{color:var(--accent)}header{border-bottom:1px solid #eee;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;padding:1rem max(1rem,50% - 480px);display:flex}.brand{font-size:1.4rem;font-weight:800;text-decoration:none;color:#0f172a}nav{flex-wrap:wrap;gap:1rem;font-size:.95rem;display:flex}nav a{color:var(--text);text-decoration:none}nav a:hover{color:var(--accent)}main{max-width:1200px;margin:0 auto;padding:2rem 1rem}footer{text-align:center;color:var(--muted);border-top:1px solid #eee;padding:2rem 1rem;font-size:.85rem}.grid{grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;display:grid}.card{background:var(--card);border-radius:12px;padding:1.25rem}.card h3{margin:.25rem 0;font-size:1.15rem;line-height:1.3}.card a{color:inherit;text-decoration:none}.meta{color:var(--muted);font-size:.85rem}.tag{background:var(--accent);color:#fff;border-radius:99px;padding:0 .6rem;font-size:.75rem;display:inline-block}article h1{line-height:1.2}article img{max-width:100%}article table{border-collapse:collapse;width:100%}article th,article td{border:1px solid #ddd;padding:.4rem .6rem}
.dot{cursor:pointer;transition:transform .15s;}
.dot:hover{transform:scale(1.35);}
.dot.active-dot{outline:2px solid #0f172a; outline-offset:1px;}
.bundle-highlight-card{border:2px solid #f59e0b !important; background:#fffdf5 !important;}
</style><link rel="stylesheet" href="/_astro/UpgradeModal.rCoh7SEV.css"><link rel="stylesheet" href="/_astro/index.HiuEWove.css"></head><body style="--accent:#0f9d58"><header><a class="brand" href="/">SmartCents</a><nav><a href="/category/saving/">Saving</a><a href="/category/budgeting/">Budgeting</a><a href="/category/investing/">Investing</a><a href="/category/side-hustles/">Side Hustles</a><a href="/tools/">Tools &amp; Templates (380+)</a><a href="/about/">About</a></nav></header><main><div class="tools-container" data-astro-cid-l4z7ivqh><!-- Hero Section --><header class="catalog-hero" data-astro-cid-l4z7ivqh><div class="hero-badge" data-astro-cid-l4z7ivqh>380+ COMMERCIAL ASSETS</div><h1 data-astro-cid-l4z7ivqh>Digital Products &amp; Template Empire</h1><p class="hero-subtitle" data-astro-cid-l4z7ivqh>Accelerate your business and wealth with 4 interactive SaaS utilities, 40 automated Excel financial models, 300+ vector PDF planners, and 40 AI prompt bibles &amp; SOP playbooks.</p><!-- Freemium Banner --><div class="freemium-banner" data-astro-cid-l4z7ivqh><div class="banner-content" data-astro-cid-l4z7ivqh><span class="pro-chip" data-astro-cid-l4z7ivqh>VIP ALL-ACCESS</span><div data-astro-cid-l4z7ivqh><strong data-astro-cid-l4z7ivqh>Free Starter Tier Active:</strong> Test web SaaS tools &amp; download starter templates.<span class="pro-pitch" data-astro-cid-l4z7ivqh>Unlock Pro for $7/mo or $29 Lifetime for all 380+ files, 40 Excel models, 300+ planners, and 40 AI Playbooks.</span></div></div><button class="upgrade-banner-btn" onclick="window.openUpgradeModal('Complete 380+ Product Suite')" data-astro-cid-l4z7ivqh>Upgrade to Pro ($29 Lifetime) &rarr;</button></div></header>

<!-- Featured Interactive SaaS Apps Row -->
<section class="featured-app-section" data-astro-cid-l4z7ivqh>
  <div class="featured-badge" data-astro-cid-l4z7ivqh>FEATURED INTERACTIVE WEB SAAS SUITE</div>
  <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-top: 0.75rem;">
    <div style="background:#fff; border:2px solid #0f9d58; border-radius:12px; padding:1.25rem;">
      <h3 style="margin-bottom:0.5rem; color:#0f172a;">Smart Invoice Maker</h3>
      <p style="font-size:0.88rem; color:#64748b; margin-bottom:1rem;">Real-time taxes, multi-currency ($/€/£), vector PDF export &amp; CSV.</p>
      <a href="/tools/invoice/" class="card-btn primary">Launch Invoice App &rarr;</a>
    </div>
    <div style="background:#fff; border:2px solid #0f9d58; border-radius:12px; padding:1.25rem;">
      <h3 style="margin-bottom:0.5rem; color:#0f172a;">Compound &amp; FIRE Simulator</h3>
      <p style="font-size:0.88rem; color:#64748b; margin-bottom:1rem;">Visual portfolio growth curves, inflation adjustment &amp; retirement timeline.</p>
      <a href="/tools/wealth-simulator/" class="card-btn primary">Launch Wealth Simulator &rarr;</a>
    </div>
    <div style="background:#fff; border:2px solid #2563eb; border-radius:12px; padding:1.25rem;">
      <h3 style="margin-bottom:0.5rem; color:#0f172a;">Freelance Rate Estimator</h3>
      <p style="font-size:0.88rem; color:#64748b; margin-bottom:1rem;">Sustainable hourly &amp; day rates, overhead buffers, and client quote builder.</p>
      <a href="/tools/rate-calculator/" class="card-btn primary" style="background:#2563eb;">Launch Rate Tool &rarr;</a>
    </div>
    <div style="background:#fff; border:2px solid #8b5cf6; border-radius:12px; padding:1.25rem;">
      <h3 style="margin-bottom:0.5rem; color:#0f172a;">Deep Work &amp; Pomodoro OS</h3>
      <p style="font-size:0.88rem; color:#64748b; margin-bottom:1rem;">Sprint focus timers, audio chimes, and interactive Eisenhower task board.</p>
      <a href="/tools/focus-os/" class="card-btn primary" style="background:#8b5cf6;">Launch Focus OS &rarr;</a>
    </div>
  </div>
</section>

<!-- Search & Filter Controls -->
<section class="filter-section" data-astro-cid-l4z7ivqh>
  <div class="search-box" data-astro-cid-l4z7ivqh>
    <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-l4z7ivqh><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" data-astro-cid-l4z7ivqh></path></svg>
    <input type="text" id="tool-search" placeholder="Search 380+ tools, spreadsheets, planners, AI prompt vaults (e.g. invoice, crypto, adhd, roas)..." autocomplete="off" data-astro-cid-l4z7ivqh>
    <button id="search-clear" class="clear-btn" style="display:none;" data-astro-cid-l4z7ivqh>&times;</button>
  </div>
  <div class="filter-pills" id="filter-pills" data-astro-cid-l4z7ivqh>
    <button class="pill active" data-filter="all" data-astro-cid-l4z7ivqh>All Products (190+ Cards / 380+ Files)</button>
    <button class="pill" data-filter="bundle" data-astro-cid-l4z7ivqh>Mega Bundles (ZIP)</button>
    <button class="pill" data-filter="interactive" data-astro-cid-l4z7ivqh>Interactive SaaS Apps (4)</button>
    <button class="pill" data-filter="spreadsheet" data-astro-cid-l4z7ivqh>Business Excel (40)</button>
    <button class="pill" data-filter="planner" data-astro-cid-l4z7ivqh>Printable Planners (300+)</button>
    <button class="pill" data-filter="playbook" data-astro-cid-l4z7ivqh>AI Bibles &amp; SOP Kits (40)</button>
    <button class="pill" data-filter="finance" data-astro-cid-l4z7ivqh>Finance &amp; Wealth</button>
    <button class="pill" data-filter="productivity" data-astro-cid-l4z7ivqh>Productivity &amp; ADHD</button>
    <button class="pill" data-filter="operations" data-astro-cid-l4z7ivqh>Operations &amp; E-Com</button>
    <button class="pill" data-filter="wellness" data-astro-cid-l4z7ivqh>Health &amp; Wellness</button>
    <button class="pill" data-filter="lifestyle" data-astro-cid-l4z7ivqh>Home &amp; Lifestyle</button>
    <button class="pill" data-filter="academic" data-astro-cid-l4z7ivqh>Academic &amp; Creator</button>
  </div>
</section>

<!-- Catalog Grid -->
<div class="catalog-grid" id="catalog-grid" data-astro-cid-l4z7ivqh>
  ${cardsHtml}
</div>

<!-- Empty search state -->
<div id="no-results" class="no-results" style="display:none;" data-astro-cid-l4z7ivqh>
  <p data-astro-cid-l4z7ivqh>No tools or templates match your search criteria.</p>
  <button class="card-btn secondary" onclick="document.getElementById('tool-search').value=''; document.getElementById('tool-search').dispatchEvent(new Event('input'));" data-astro-cid-l4z7ivqh>Reset Search</button>
</div>
</div>

<!-- Upgrade Modal -->
<div id="upgrade-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" style="display: none;" data-astro-cid-udg2w24d>
  <div class="modal-card" data-astro-cid-udg2w24d>
    <button class="modal-close-btn" id="modal-close" aria-label="Close modal" data-astro-cid-udg2w24d>&times;</button>
    <div class="modal-header" data-astro-cid-udg2w24d>
      <span class="pro-tag" data-astro-cid-udg2w24d>BIZTOOLS PRO SUITE</span>
      <h2 id="modal-title" data-astro-cid-udg2w24d>Upgrade to Pro &amp; Unlock Everything</h2>
      <p class="modal-subtitle" data-astro-cid-udg2w24d>Get instant, unrestricted commercial access to all 380+ digital templates, spreadsheets, printable planners, and AI books.</p>
    </div>
    <div class="feature-checklist" data-astro-cid-udg2w24d>
      <div class="feature-item" data-astro-cid-udg2w24d>
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-udg2w24d><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-udg2w24d></path></svg>
        <div data-astro-cid-udg2w24d><strong data-astro-cid-udg2w24d>All 40 Automated Excel Workbooks</strong><span data-astro-cid-udg2w24d>P&amp;L, SaaS, Cap Table, Real Estate ROI, ROAS, HR &amp; Cash Flow</span></div>
      </div>
      <div class="feature-item" data-astro-cid-udg2w24d>
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-udg2w24d><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-udg2w24d></path></svg>
        <div data-astro-cid-udg2w24d><strong data-astro-cid-udg2w24d>All 300+ Printable &amp; Tablet PDF Planners</strong><span data-astro-cid-udg2w24d>102 unique planners in 3 colors: Ocean, Sage, and Rose</span></div>
      </div>
      <div class="feature-item" data-astro-cid-udg2w24d>
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-udg2w24d><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-udg2w24d></path></svg>
        <div data-astro-cid-udg2w24d><strong data-astro-cid-udg2w24d>All 40 AI Prompt Bibles &amp; Business SOP Kits</strong><span data-astro-cid-udg2w24d>500+ Prompts Bible, Agency Onboarding, AI Solopreneur OS &amp; Career Kits</span></div>
      </div>
      <div class="feature-item" data-astro-cid-udg2w24d>
        <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor" data-astro-cid-udg2w24d><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" data-astro-cid-udg2w24d></path></svg>
        <div data-astro-cid-udg2w24d><strong data-astro-cid-udg2w24d>All 4 Interactive Web SaaS Apps</strong><span data-astro-cid-udg2w24d>White-label invoice generator, wealth simulator, and deep work OS</span></div>
      </div>
    </div>
    <div class="pricing-grid" data-astro-cid-udg2w24d>
      <div class="pricing-card" data-astro-cid-udg2w24d>
        <div class="plan-name" data-astro-cid-udg2w24d>Pro Monthly</div>
        <div class="price" data-astro-cid-udg2w24d><span class="currency" data-astro-cid-udg2w24d>$</span><span class="amount" data-astro-cid-udg2w24d>7</span><span class="period" data-astro-cid-udg2w24d>/month</span></div>
        <p class="plan-desc" data-astro-cid-udg2w24d>Instant access to all 380+ templates &amp; interactive tools.</p>
        <button class="plan-btn secondary-btn" id="btn-upgrade-monthly" data-astro-cid-udg2w24d>Pay $7 via PayPal &rarr;</button>
      </div>
      <div class="pricing-card popular" data-astro-cid-udg2w24d>
        <div class="best-value-badge" data-astro-cid-udg2w24d>BEST VALUE</div>
        <div class="plan-name" data-astro-cid-udg2w24d>Lifetime VIP All-Access</div>
        <div class="price" data-astro-cid-udg2w24d><span class="currency" data-astro-cid-udg2w24d>$</span><span class="amount" data-astro-cid-udg2w24d>29</span><span class="period" data-astro-cid-udg2w24d>one-time</span></div>
        <p class="plan-desc" data-astro-cid-udg2w24d>Pay once, own all 380+ templates + Mega ZIP archive forever.</p>
        <button class="plan-btn primary-btn" id="btn-upgrade-lifetime" data-astro-cid-udg2w24d>Buy Lifetime ($29 PayPal) &rarr;</button>
      </div>
    </div>
    <div class="modal-footer" data-astro-cid-udg2w24d>
      <button class="text-dismiss-btn" id="btn-continue-free" data-astro-cid-udg2w24d>Continue with Free Plan</button>
      <div class="test-pro-wrapper" data-astro-cid-udg2w24d>
        <label class="test-pro-label" data-astro-cid-udg2w24d>
          <input type="checkbox" id="test-pro-toggle" data-astro-cid-udg2w24d>
          <span data-astro-cid-udg2w24d>Simulate Pro Mode (Preview / Testing)</span>
        </label>
      </div>
    </div>
  </div>
</div>

<script>
  window.openUpgradeModal = function(featureReason) {
    var modal = document.getElementById('upgrade-modal');
    if (modal) {
      modal.style.display = 'flex';
      var title = document.getElementById('modal-title');
      if (title && featureReason) {
        title.setAttribute('data-original-title', title.innerText);
        title.innerText = 'Unlock ' + featureReason + ' with Pro';
      }
    }
  };

  window.closeUpgradeModal = function() {
    var modal = document.getElementById('upgrade-modal');
    if (modal) {
      modal.style.display = 'none';
      var title = document.getElementById('modal-title');
      if (title && title.getAttribute('data-original-title')) {
        title.innerText = title.getAttribute('data-original-title');
      }
    }
  };

  window.switchPlannerTheme = function(dotEl, baseName, theme) {
    var parent = dotEl.closest('.planner-meta');
    if (parent) {
      parent.querySelectorAll('.dot').forEach(function(d) { d.classList.remove('active-dot'); });
      dotEl.classList.add('active-dot');
    }
    var link = document.getElementById('link-' + baseName);
    if (link) {
      link.href = '/downloads/planners/' + baseName + '_' + theme + '.pdf';
      link.innerText = 'Get Free PDF (' + theme.toUpperCase() + ') \u2193';
    }
    var btn = document.getElementById('btn-' + baseName);
    if (btn) {
      btn.setAttribute('data-download-url', '/downloads/planners/' + baseName + '_' + theme + '.pdf');
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    var closeBtn = document.getElementById('modal-close');
    var continueBtn = document.getElementById('btn-continue-free');
    var modal = document.getElementById('upgrade-modal');
    var monthlyBtn = document.getElementById('btn-upgrade-monthly');
    var lifetimeBtn = document.getElementById('btn-upgrade-lifetime');
    var testProToggle = document.getElementById('test-pro-toggle');

    if (closeBtn) closeBtn.addEventListener('click', window.closeUpgradeModal);
    if (continueBtn) continueBtn.addEventListener('click', window.closeUpgradeModal);
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) window.closeUpgradeModal();
      });
    }

    var PAYPAL_EMAIL = 'htcmobile.ab@gmail.com';
    var RETURN_URL = 'https://achrafbah.github.io/tools/?pro_unlocked=1&bundle=1';
    var CANCEL_URL = 'https://achrafbah.github.io/tools/';

    var buildPayPalUrl = function(itemName, amount) {
      return 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick'
        + '&business=' + encodeURIComponent(PAYPAL_EMAIL)
        + '&item_name=' + encodeURIComponent(itemName)
        + '&amount=' + encodeURIComponent(amount)
        + '&currency_code=USD'
        + '&no_shipping=1'
        + '&return=' + encodeURIComponent(RETURN_URL)
        + '&cancel_return=' + encodeURIComponent(CANCEL_URL);
    };

    if (monthlyBtn) {
      monthlyBtn.addEventListener('click', function() {
        window.location.href = buildPayPalUrl('BizTools Pro Pass - All 380+ Templates & SaaS Apps (Monthly)', '7.00');
      });
    }
    if (lifetimeBtn) {
      lifetimeBtn.addEventListener('click', function() {
        window.location.href = buildPayPalUrl('BizTools Lifetime VIP All-Access (380+ Digital Products + Mega ZIP Archive)', '29.00');
      });
    }

    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('pro_unlocked') === '1') {
        localStorage.setItem('biztools_pro_active', 'true');
        window.dispatchEvent(new CustomEvent('biztools:pro_changed', { detail: { isPro: true } }));
        if (params.get('bundle') === '1') {
          setTimeout(function() {
            window.location.href = '/downloads/bundles/Complete-380-Digital-Products-Mega-Bundle.zip';
          }, 600);
        }
      }
    } catch (e) {}

    var savedPro = localStorage.getItem('biztools_pro_active') === 'true';
    if (testProToggle) {
      testProToggle.checked = savedPro;
      testProToggle.addEventListener('change', function(e) {
        localStorage.setItem('biztools_pro_active', e.target.checked ? 'true' : 'false');
        window.dispatchEvent(new CustomEvent('biztools:pro_changed', { detail: { isPro: e.target.checked } }));
        window.closeUpgradeModal();
      });
    }

    // Search and Filtering
    var searchInput = document.getElementById('tool-search');
    var clearBtn = document.getElementById('search-clear');
    var pills = document.querySelectorAll('.pill');
    var cards = document.querySelectorAll('.item-card');
    var noResults = document.getElementById('no-results');

    var currentFilter = 'all';
    var currentQuery = '';

    function filterItems() {
      var visibleCount = 0;
      cards.forEach(function(card) {
        var category = card.getAttribute('data-category') || '';
        var title = card.getAttribute('data-title') || '';
        var desc = card.getAttribute('data-desc') || '';

        var matchesCategory = (currentFilter === 'all') || category.indexOf(currentFilter) !== -1;
        var matchesQuery = !currentQuery || (title.indexOf(currentQuery) !== -1) || (desc.indexOf(currentQuery) !== -1);

        if (matchesCategory && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        currentQuery = e.target.value.toLowerCase().trim();
        if (clearBtn) clearBtn.style.display = currentQuery ? 'block' : 'none';
        filterItems();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (searchInput) {
          searchInput.value = '';
          currentQuery = '';
          clearBtn.style.display = 'none';
          filterItems();
        }
      });
    }

    pills.forEach(function(pill) {
      pill.addEventListener('click', function() {
        pills.forEach(function(p) { p.classList.remove('active'); });
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter') || 'all';
        filterItems();
      });
    });

    function syncProButtons() {
      var isPro = localStorage.getItem('biztools_pro_active') === 'true';
      document.querySelectorAll('.pro-btn-label').forEach(function(el) {
        el.innerText = isPro ? 'Download Pro Item \\u2193' : 'Unlock with Pro ($7)';
      });
    }
    syncProButtons();
    window.addEventListener('biztools:pro_changed', syncProButtons);
  });
</script>
</main>
<footer>
  <p>Some links are affiliate links. We may earn a commission at no cost to you.</p>
  <p>&copy; 2026 SmartCents Digital Products &middot; <a href="/tools/">Tools &amp; Templates (380+)</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy</a></p>
</footer>
</body></html>`;

fs.writeFileSync(path.join(ROOT, 'tools/index.html'), catalogHtml, 'utf8');
console.log('Successfully compiled achrafbah.github.io-main/tools/index.html!');
