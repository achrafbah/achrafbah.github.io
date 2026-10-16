const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../../downloads/planners');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const THEMES = {
  ocean: { primary: '#1f4e79', accent: '#0284c7', light: '#f0f9ff', border: '#bae6fd' },
  sage:  { primary: '#4a6b57', accent: '#0f9d58', light: '#f0fdf4', border: '#bbf7d0' },
  rose:  { primary: '#a8445c', accent: '#e11d48', light: '#fff1f2', border: '#fecdd3' }
};

function createPlannerPDF(baseName, title, category, numPages, pageSections) {
  const promises = Object.keys(THEMES).map(themeKey => {
    return new Promise((resolve, reject) => {
      const theme = THEMES[themeKey];
      const filename = `${baseName}_${themeKey}.pdf`;
      const outPath = path.join(OUT_DIR, filename);
      const doc = new PDFDocument({ size: 'LETTER', margin: 36 });
      const stream = fs.createWriteStream(outPath);
      doc.pipe(stream);

      for (let p = 1; p <= numPages; p++) {
        if (p > 1) doc.addPage();

        // Header Banner
        doc.rect(36, 30, 540, 48).fill(theme.primary);
        doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold').text(title.toUpperCase(), 50, 42);
        doc.fontSize(8.5).fillColor('#e2e8f0').font('Helvetica').text(`${category.toUpperCase()} • EDITION: ${themeKey.toUpperCase()} • PAGE ${p} OF ${numPages}`, 50, 60);

        let curY = 90;
        const sections = pageSections || [
          { title: 'PRIORITY FOCUS & ACTION MATRIX', rows: 8 },
          { title: 'TRACKING & TIME-BLOCK LOG', rows: 10 },
          { title: 'DAILY NOTES & REFLECTION', rows: 6 }
        ];

        sections.forEach(sec => {
          doc.rect(36, curY, 540, 22).fill(theme.light);
          doc.rect(36, curY, 540, 22).stroke(theme.border);
          doc.fontSize(9.5).fillColor(theme.primary).font('Helvetica-Bold').text(sec.title, 46, curY + 6);
          curY += 26;

          const rowCount = sec.rows || 6;
          const rowHeight = 18;
          for (let r = 0; r < rowCount; r++) {
            const isAlt = r % 2 === 1;
            if (isAlt) {
              doc.rect(36, curY + r * rowHeight, 540, rowHeight).fill('#f8fafc');
            }
            doc.rect(36, curY + r * rowHeight, 540, rowHeight).stroke('#e2e8f0');
            // Checkbox
            doc.rect(46, curY + r * rowHeight + 4, 10, 10).stroke(theme.accent);
            doc.fontSize(8.5).fillColor('#94a3b8').font('Helvetica').text(`Item ${r + 1} ____________________________________________________________________`, 64, curY + r * rowHeight + 5);
          }
          curY += rowCount * rowHeight + 14;
        });

        // Footer
        doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text(
          `Page ${p} of ${numPages} • BizTools Signature Collection • ${title} (${themeKey.toUpperCase()})`,
          36, 755, { align: 'center', width: 540 }
        );
      }

      doc.end();
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  });

  return Promise.all(promises);
}

const NEW_PLANNERS = [
  // --- Agent 3: Productivity (10 new -> Total 20) ---
  { base: 'Quarterly-Strategic-Review', title: 'Quarterly Strategic Horizon Review', cat: 'Executive Productivity', pages: 12 },
  { base: 'Brain-Dump-Decompression-Pad', title: 'Brain Dump & Mental Decompression Pad', cat: 'Executive Productivity', pages: 16 },
  { base: 'Delegation-Accountability-Matrix', title: 'Executive Delegation & Ownership Matrix', cat: 'Executive Productivity', pages: 12 },
  { base: 'Energy-Management-Audit', title: 'Circadian Energy & Focus Audit Log', cat: 'Executive Productivity', pages: 14 },
  { base: 'Sprint-Retrospective-Workbook', title: 'Agile Sprint Retrospective & Kaizen Pad', cat: 'Executive Productivity', pages: 16 },
  { base: 'Weekly-Shutdown-Ritual', title: 'Weekly Executive Shutdown & Reset Ritual', cat: 'Executive Productivity', pages: 12 },
  { base: 'Decision-Making-Mental-Models', title: 'First-Principles Decision Framework', cat: 'Executive Productivity', pages: 14 },
  { base: 'Overwhelm-Emergency-Brakepad', title: 'ADHD Overwhelm Emergency Brake Pad', cat: 'Executive Productivity', pages: 10 },
  { base: 'Daily-Highlight-Rulebook', title: 'Make Time Daily Highlight Rulebook', cat: 'Executive Productivity', pages: 20 },
  { base: 'Distraction-Shield-Log', title: 'Distraction Interception & Flow Pad', cat: 'Executive Productivity', pages: 14 },

  // --- Agent 4: Personal Finance & Wealth (12 new -> Total 20) ---
  { base: 'Net-Worth-Quarterly-Audit', title: 'Quarterly Net Worth & Equity Audit', cat: 'Wealth & Investing', pages: 12 },
  { base: 'Emergency-Fund-Liquid-Pad', title: '6-Month Emergency Reserve Builder', cat: 'Wealth & Investing', pages: 10 },
  { base: 'Bill-Payment-Calendar-Grid', title: 'Annual Recurring Bill Payment Matrix', cat: 'Wealth & Investing', pages: 12 },
  { base: 'Tax-Deduction-Mileage-Log', title: 'Schedule C Tax Deduction & Mileage Log', cat: 'Wealth & Investing', pages: 16 },
  { base: 'Kids-Allowance-Savings-Jar', title: 'Kids Financial Literacy & Savings Jar', cat: 'Wealth & Investing', pages: 10 },
  { base: 'Freelance-Invoice-Payment-Log', title: 'Freelance Accounts Receivable Log', cat: 'Wealth & Investing', pages: 14 },
  { base: 'Holiday-Gift-Budget-Binder', title: 'Master Holiday Gift & Spending Binder', cat: 'Wealth & Investing', pages: 12 },
  { base: 'Cryptocurrency-Cold-Storage-Log', title: 'Crypto Hardware Wallet & Basis Log', cat: 'Wealth & Investing', pages: 10 },
  { base: 'Subscription-Audit-Purge', title: 'Annual Recurring Subscription Purge', cat: 'Wealth & Investing', pages: 8 },
  { base: 'Passive-Income-Snowball-Pad', title: 'Passive Dividend & Royalty Snowball', cat: 'Wealth & Investing', pages: 14 },
  { base: 'Real-Estate-Property-Diligence', title: 'Rental Property Inspection Scorecard', cat: 'Wealth & Investing', pages: 16 },
  { base: '50-30-20-Budget-Workbook', title: '50/30/20 Rule Personal Wealth Binder', cat: 'Wealth & Investing', pages: 14 },

  // --- Agent 5: Fitness & Wellness (13 new -> Total 20) ---
  { base: 'Posture-Mobility-Daily-Routine', title: 'Desk Worker Posture & Mobility Log', cat: 'Health & Wellness', pages: 12 },
  { base: 'Hydration-Electrolyte-Tracker', title: 'Daily Gallon Hydration & Electrolytes', cat: 'Health & Wellness', pages: 10 },
  { base: 'Strength-Hypertrophy-Periodization', title: '12-Week Hypertrophy Training Log', cat: 'Health & Wellness', pages: 20 },
  { base: 'Sleep-Architecture-Tracker', title: 'REM & Deep Sleep Optimization Log', cat: 'Health & Wellness', pages: 14 },
  { base: 'Gut-Health-Symptom-Journal', title: 'Food Elimination & Gut Health Journal', cat: 'Health & Wellness', pages: 16 },
  { base: 'Meditation-Breathwork-Log', title: 'Daily Breathwork & Mindfulness Log', cat: 'Health & Wellness', pages: 14 },
  { base: 'Weekly-Grocery-Pantry-Planner', title: 'Macro-Balanced Grocery & Pantry Pad', cat: 'Health & Wellness', pages: 16 },
  { base: 'Cold-Plunge-Sauna-Therapy', title: 'Deliberate Heat & Cold Contrast Log', cat: 'Health & Wellness', pages: 12 },
  { base: 'Mental-Resilience-Stoic-Journal', title: 'Stoic Daily Journal & Evening Audit', cat: 'Health & Wellness', pages: 20 },
  { base: 'Supplement-Biohacking-Stack', title: 'Nootropic & Vitamin Biohacking Stack', cat: 'Health & Wellness', pages: 12 },
  { base: 'Flexibility-Split-Progress', title: 'Daily Mobility & Split Stretch Journal', cat: 'Health & Wellness', pages: 10 },
  { base: 'Body-Measurements-Photolog', title: 'Body Composition & Circumference Log', cat: 'Health & Wellness', pages: 12 },
  { base: 'Yoga-Asana-Practice-Notes', title: 'Yoga Asana Alignment & Flow Log', cat: 'Health & Wellness', pages: 14 },

  // --- Agent 6: Home, Family & Lifestyle (14 new -> Total 20) ---
  { base: 'Home-Maintenance-Seasonal-Binder', title: 'Seasonal Home Maintenance Inspection', cat: 'Home & Family', pages: 16 },
  { base: 'Pantry-Deep-Freezer-Inventory', title: 'Deep Freeze & Pantry Inventory Sheet', cat: 'Home & Family', pages: 12 },
  { base: 'Baby-Infant-Feeding-Diaper-Log', title: 'Newborn Feeding, Sleep & Diaper Log', cat: 'Home & Family', pages: 20 },
  { base: 'Pet-Care-Vaccine-Medical-Log', title: 'Pet Health, Vet Records & Vaccine Log', cat: 'Home & Family', pages: 12 },
  { base: 'Garden-Planting-Harvest-Calendar', title: 'Heirloom Garden & Harvest Calendar', cat: 'Home & Family', pages: 14 },
  { base: 'Road-Trip-Camping-Checklist', title: 'Overland Road Trip & Camp Checklist', cat: 'Home & Family', pages: 12 },
  { base: 'Holiday-Party-Host-Planner', title: 'Dinner Party Host & Catering Timeline', cat: 'Home & Family', pages: 14 },
  { base: 'Emergency-Disaster-Preparedness', title: '72-Hour Emergency Disaster Plan', cat: 'Home & Family', pages: 12 },
  { base: 'Vehicle-Car-Care-Service-Book', title: 'Automotive Maintenance & Mileage Pad', cat: 'Home & Family', pages: 12 },
  { base: 'Relocation-Moving-House-Binder', title: 'Moving House 8-Week Master Checklist', cat: 'Home & Family', pages: 16 },
  { base: 'Wardrobe-Capsule-Outfit-Planner', title: 'Capsule Wardrobe & Lookbook Pad', cat: 'Home & Family', pages: 12 },
  { base: 'Recipe-Heirloom-Cookbook-Binder', title: 'Family Heirloom Recipe Keepsake Pad', cat: 'Home & Family', pages: 20 },
  { base: 'Babysitter-House-Sitter-Guide', title: 'Babysitter Emergency Instructions Sheet', cat: 'Home & Family', pages: 10 },
  { base: 'Birthday-Anniversary-Perpetual', title: 'Perpetual Celebration & Gift Binder', cat: 'Home & Family', pages: 12 },

  // --- Agent 7: Academic, Languages & Creator (12 new -> Total 20) ---
  { base: 'College-Application-Common-App', title: 'College Application & Essay Roadmap', cat: 'Academic & Creator', pages: 16 },
  { base: 'Medical-School-Anki-MCAT-Log', title: 'MCAT & USMLE High-Yield Study Grid', cat: 'Academic & Creator', pages: 20 },
  { base: 'Law-School-Case-Brief-Notebook', title: 'IRAC Law School Case Briefing Notebook', cat: 'Academic & Creator', pages: 24 },
  { base: 'Novel-Writing-Story-Bible', title: 'Novel Character Arc & Story Bible', cat: 'Academic & Creator', pages: 24 },
  { base: 'Podcast-Episode-Production-Sheet', title: 'Podcast Guest & Production Run Sheet', cat: 'Academic & Creator', pages: 16 },
  { base: 'Newsletter-Editorial-Runsheet', title: 'Weekly Newsletter Editorial Curation', cat: 'Academic & Creator', pages: 16 },
  { base: 'Coding-LeetCode-DSA-Journal', title: 'Data Structures & Algorithms Logbook', cat: 'Academic & Creator', pages: 20 },
  { base: 'Language-Immersion-Kanji-Hanja', title: 'Vocabulary & Character Immersion Pad', cat: 'Academic & Creator', pages: 20 },
  { base: 'Public-Speaking-Speech-Outline', title: 'Keynote Speech & TED Talk Architect', cat: 'Academic & Creator', pages: 14 },
  { base: 'Music-Instrument-Practice-Log', title: 'Daily Musical Instrument Mastery Pad', cat: 'Academic & Creator', pages: 16 },
  { base: 'Etsy-SEO-Listing-Optimization', title: 'Etsy SEO Listing & Mockup Blueprint', cat: 'Academic & Creator', pages: 14 },
  { base: 'Digital-Note-Taking-Zettelkasten', title: 'Zettelkasten Atomic Slip-Box Pad', cat: 'Academic & Creator', pages: 18 }
];

async function run() {
  console.log(`Starting generation of ${NEW_PLANNERS.length} unique planners across 3 themes (${NEW_PLANNERS.length * 3} PDFs)...`);
  for (let i = 0; i < NEW_PLANNERS.length; i++) {
    const item = NEW_PLANNERS[i];
    await createPlannerPDF(item.base, item.title, item.cat, item.pages);
    if ((i + 1) % 10 === 0 || i === NEW_PLANNERS.length - 1) {
      console.log(`Progress: ${i + 1}/${NEW_PLANNERS.length} planners generated.`);
    }
  }
  console.log('Finished generating all remaining printable PDF planners!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
