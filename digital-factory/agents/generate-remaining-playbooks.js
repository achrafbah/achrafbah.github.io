const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../../downloads/playbooks');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function generatePlaybook(filename, meta) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: 40 });
    const outPath = path.join(OUT_DIR, filename);
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    const primaryColor = meta.color || '#0f172a';
    const accentColor = meta.accent || '#0f9d58';

    // Page 1: Premium Book Cover
    doc.rect(0, 0, 612, 792).fill(primaryColor);
    doc.rect(40, 40, 532, 712).stroke('#334155');

    // Category Chip
    doc.rect(60, 80, 180, 26).fill(accentColor);
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold').text(meta.category.toUpperCase(), 70, 88);

    // Title
    doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold').text(meta.title, 60, 140, { width: 480, lineGap: 6 });
    doc.fontSize(14).fillColor('#94a3b8').font('Helvetica').text(meta.subtitle, 60, 240, { width: 480, lineGap: 4 });

    // Feature highlights
    doc.rect(60, 360, 492, 180).fill('#1e293b');
    doc.fontSize(12).fillColor('#38bdf8').font('Helvetica-Bold').text('EXECUTIVE PLAYBOOK ARCHITECTURE & CONTENTS:', 80, 380);
    meta.highlights.forEach((h, idx) => {
      doc.fontSize(10).fillColor('#e2e8f0').font('Helvetica').text('•  ' + h, 80, 410 + idx * 24, { width: 450 });
    });

    // Author / Publisher Bar
    doc.rect(60, 640, 492, 60).fill('#0f172a');
    doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold').text('BIZTOOLS EXECUTIVE SUITE • COMMERCIAL EDITION', 80, 655);
    doc.fontSize(9).fillColor('#64748b').font('Helvetica').text('Lifetime Commercial License • Verified Best-Seller Blueprint • https://achrafbah.github.io/tools/', 80, 675);

    // Content Pages
    meta.chapters.forEach((ch, chIdx) => {
      doc.addPage();
      // Header banner
      doc.rect(40, 30, 532, 45).fill('#f8fafc');
      doc.rect(40, 75, 532, 2).fill(accentColor);
      doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(ch.title, 50, 45);
      doc.fontSize(8.5).fillColor('#64748b').font('Helvetica').text('CHAPTER ' + (chIdx + 1) + ' OF ' + meta.chapters.length + ' • ' + meta.title, 50, 60);

      let curY = 95;
      doc.fontSize(11).fillColor('#1e293b').font('Helvetica-Bold').text(ch.sectionHeader, 45, curY);
      curY += 20;

      doc.fontSize(9.5).fillColor('#334155').font('Helvetica').text(ch.body, 45, curY, { width: 522, lineGap: 3 });
      curY += doc.heightOfString(ch.body, { width: 522, lineGap: 3 }) + 15;

      // Structured Box (Prompt Vault or SOP Step)
      if (ch.boxTitle) {
        doc.rect(45, curY, 522, 180).fill('#f1f5f9').stroke('#cbd5e1');
        doc.rect(45, curY, 522, 24).fill('#0f172a');
        doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold').text(ch.boxTitle.toUpperCase(), 55, curY + 7);
        doc.fontSize(8.5).fillColor('#0f172a').font('Courier').text(ch.boxContent, 55, curY + 34, { width: 502, lineGap: 2 });
        curY += 195;
      }

      // Action Checkpoints
      if (ch.checkpoints && ch.checkpoints.length > 0) {
        doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text('CRITICAL EXECUTION CHECKPOINTS & METRICS:', 45, curY);
        curY += 16;
        ch.checkpoints.forEach((cp, cpIdx) => {
          doc.rect(45, curY + cpIdx * 18, 10, 10).stroke('#64748b');
          doc.fontSize(9).fillColor('#334155').font('Helvetica').text(cp, 62, curY + cpIdx * 18 + 1, { width: 500 });
        });
      }

      // Page footer
      doc.fontSize(8).fillColor('#94a3b8').font('Helvetica').text(
        'Page ' + (chIdx + 2) + ' of ' + (meta.chapters.length + 1) + ' • BizTools Master Playbook Series',
        40, 755, { align: 'center', width: 532 }
      );
    });

    doc.end();
    stream.on('finish', () => {
      console.log('Created Playbook: ' + filename);
      resolve();
    });
    stream.on('error', reject);
  });
}

async function run() {
  console.log('Generating remaining 32 high-value Playbooks & SOP Kits...');

  const playbooks = [
    // --- 16 AI PLAYBOOKS (Agent 8) ---
    {
      file: 'ChatGPT-SEO-Blogging-Engine.pdf',
      color: '#0f172a', accent: '#2563eb', category: 'AI Prompt Vault',
      title: 'ChatGPT SEO & Long-Form Content Engine',
      subtitle: 'Prompt Architectures for Semantic SEO, Topical Authority Maps & Zero-Click Answers',
      highlights: ['Keyword Cluster to Semantic Outline Engine', 'High-Retention Hook & Intro Prompts', 'People Also Ask (PAA) Instant FAQ Generator', 'E-E-A-T Credibility & Citation Infuser'],
      chapters: [
        { title: 'Topical Authority & Semantic Keyword Clustering', sectionHeader: 'Building Unbeatable Semantic Topic Graphs', body: 'Modern SEO algorithms prioritize holistic domain authority over single keyword stuffing. Use this framework to generate 30 interlinked subtopic silos.', boxTitle: 'Prompt: Complete 30-Post Semantic Pillar Map', boxContent: 'Act as a Principal SEO Strategist. For the target niche [Niche], generate 5 core pillar topics and 6 spoke sub-articles for each. Include primary search intent, recommended schema type, and exact internal linking anchors.', checkpoints: ['Map 5 pillar pages with high intent', 'Verify 25 spoke articles link up to pillars', 'Ensure target anchor text varies naturally'] },
        { title: 'High-Converting Humanized Long-Form Drafting', sectionHeader: 'Bypassing Robotic Cadence with Real Editorial Voice', body: 'Tone, cadence, short punchy paragraphs, and real-world analogies make AI-generated articles rank and convert readers into buyers.', boxTitle: 'Prompt: 2,500-Word Comprehensive Pillar Draft', boxContent: 'You are an award-winning senior tech journalist. Write a comprehensive guide on [Topic]. Structure with H2/H3 hierarchies, comparison tables, real-world case study callouts, and conversational rhythm without fluff or passive voice.', checkpoints: ['Incorporate 2 data tables in article', 'Add bulleted takeaway box after H2', 'Ensure readability score matches Grade 8'] }
      ]
    },
    {
      file: 'Claude-Coding-Architect-Playbook.pdf',
      color: '#0f172a', accent: '#7c3aed', category: 'AI Developer Vault',
      title: 'Claude 3.5 Sonnet Full-Stack Architect Playbook',
      subtitle: 'System Prompts & Architecture Blueprints for 10x Software Engineering',
      highlights: ['Full-Stack Refactoring & Architectural Reviews', 'Unit & End-to-End Test Suite Generators', 'SQL Schema & Query Optimization Prompts', 'Automated CI/CD Pipeline & Docker Generators'],
      chapters: [
        { title: 'Multi-File Codebase Architecture Synthesis', sectionHeader: 'Structuring Large Modular Systems in One Prompt', body: 'Claude excels at deep reasoning and whole-codebase context. Use structured markdown file blocks to orchestrate frontend and backend parity.', boxTitle: 'Prompt: Senior Full-Stack Architecture Blueprint', boxContent: 'You are a Principal Software Architect. Review the following API endpoints and design a resilient, TypeScript-first React & Node.js architecture with clean error boundaries, type inference, and optimistic UI updates.', checkpoints: ['Define strict TypeScript interface schemas', 'Implement zero-runtime schema validation (Zod)', 'Setup robust try/catch with status codes'] },
        { title: 'Automated Test Generation & Regression Defense', sectionHeader: 'Producing 100% Coverage Vitest & Cypress Suites', body: 'Turn ambiguous user stories into deterministic test suites that catch edge cases and network timeouts before production deploy.', boxTitle: 'Prompt: Exhaustive Edge-Case Test Suite', boxContent: 'Generate comprehensive Vitest unit tests for the following function. Cover: nominal paths, null/undefined inputs, boundary integer values, asynchronous rejection, and concurrency race conditions.', checkpoints: ['Mock external HTTP network calls', 'Verify assertion density (>2 per test case)', 'Test error boundary fallback renders'] }
      ]
    },
    {
      file: 'Midjourney-Photorealistic-Prompt-Book.pdf',
      color: '#0f172a', accent: '#db2777', category: 'AI Visuals & Art',
      title: 'Midjourney v6 Photorealistic Prompt Engineering',
      subtitle: 'Camera Specs, Studio Lighting Codes, Aspect Ratios & Commercial Stock Imagery',
      highlights: ['35mm, 85mm & Hasselblad Camera Parameter Codes', 'Cinematic Volumetric & Rembrant Lighting Tokens', 'Product Mockups, Hero Banners & Stock Photography', 'Negative Weighting & Stylize Parameter Calibration'],
      chapters: [
        { title: 'Camera Lenses, Sensors & Depth-of-Field Formulas', sectionHeader: 'Emulating High-End Optical Hardware', body: 'Adding authentic camera models like Sony A7R V or Arri Alexa alongside f/1.4 aperture tokens instantly eliminates the plastic AI sheen.', boxTitle: 'Prompt Formula: Commercial Studio Hero Shot', boxContent: '/imagine prompt: editorial lifestyle photography, modern tech gadget on oak desk, shot on Hasselblad H6D-100c, 80mm lens, f/2.8, soft diffused natural morning window light, subtle film grain, 8k resolution, minimalist --ar 16:9 --style raw --v 6.0', checkpoints: ['Specify exact focal length (35mm / 85mm)', 'Set aperture between f/1.4 and f/4 for natural bokeh', 'Always append --style raw to disable cartoonish glow'] },
        { title: 'Commercial Packaging & E-Commerce Product Renders', sectionHeader: 'Generating Clean Stock Mockups for Storefronts', body: 'Design white-background and editorial product mockups ready for Canva overlays and digital store banners.', boxTitle: 'Prompt: Clean Minimalist Cosmetic Packaging Mockup', boxContent: '/imagine prompt: luxury matte amber dropper bottle on neutral travertine stone pedestal, gentle sunlight shadow play, clean studio backdrop, commercial packaging catalog style --ar 4:5 --v 6.0', checkpoints: ['Ensure background is neutral for easy cutout', 'Check symmetry on bottle caps and typography', 'Upscale with subtle detail retention'] }
      ]
    },
    {
      file: 'AI-Cold-Email-Client-Acquisition.pdf',
      color: '#0f172a', accent: '#0284c7', category: 'AI Sales Playbook',
      title: 'AI Cold Email & B2B Client Acquisition System',
      subtitle: 'Dynamic Personalization Prompts, 3-Touch Follow-Up Sequences & 35%+ Reply Rates',
      highlights: ['Pain-Point Observation & Hook Prompts', '1-Sentence Value Proposition Framework', 'Soft CTA Friction-Free Reply Triggers', 'Automated Objection Handling Cheat Codes'],
      chapters: [
        { title: 'Scraping Insights to Dynamic 1-to-1 Personalization', sectionHeader: 'Escaping the Generic Template Trap', body: 'Modern decision-makers delete generic emails in 2 seconds. Use AI to synthesize LinkedIn company posts and podcast interviews into hyper-relevant openers.', boxTitle: 'Prompt: 1-to-1 Cold Email Opener Synthesizer', boxContent: 'Analyze this prospect info: [Company news / LinkedIn bio]. Write a 2-sentence conversational opening line that genuinely compliments their recent milestone without sounding like a pitch.', checkpoints: ['Keep opening sentence under 18 words', 'Never start with "I hope this email finds you well"', 'Tie opening observation to business revenue impact'] },
        { title: 'The 3-Step Multi-Touch Follow-Up Campaign', sectionHeader: 'Polite Persistence that Converts Non-Responders', body: 'Over 68% of closed deals happen on follow-ups 2, 3, and 4. Never re-pitch your offer; provide new contextual value and quick binary choices.', boxTitle: 'Prompt: Frictionless 3-Touch Follow-Up Suite', boxContent: 'Draft a 3-part follow-up sequence. Email 2 (Day 3): Share a 1-page PDF case study relevant to their niche. Email 3 (Day 7): Quick 2-line check-in. Email 4 (Day 14): Polite breakup email with an open door.', checkpoints: ['Ensure email 2 delivers standalone value', 'Make email 3 replyable with a simple "yes/no"', 'Email 4 must leave a positive lasting impression'] }
      ]
    },
    {
      file: 'SaaS-Copywriting-High-Converting-Prompts.pdf',
      color: '#0f172a', accent: '#0f9d58', category: 'AI Copywriting',
      title: 'SaaS Landing Page & Micro-Copy AI Bible',
      subtitle: 'Hero Headlines, Feature-Benefit Bridges, Pricing FAQs & Onboarding Modals',
      highlights: ['5 Hero Headline Archetypes that Convert', 'Feature-to-Outcome Benefit Translator', 'Objection-Crushing Pricing Page FAQs', 'Sticky Micro-Copy for In-App Tooltips & Buttons'],
      chapters: [
        { title: 'Hero Section Psychology: 5-Second Clarity Test', sectionHeader: 'Turning Skeptical Visitors into Active Signups', body: 'The headline must state what it does, who it is for, and the ultimate transformation within 5 seconds of page load.', boxTitle: 'Prompt: 10 High-Converting Hero Variations', boxContent: 'You are a world-class conversion copywriter (like Joanna Wiebe). For SaaS [Product Description], generate 10 hero headline + subheadline combinations across 5 frameworks: Pain-Agitate-Solve, Direct Value, Before-After-Bridge, Secret/Enemy, and Bold Promise.', checkpoints: ['Score each headline on clarity vs cleverness', 'Subheadline must explain mechanics in 1 sentence', 'CTA button text must start with an active verb'] },
        { title: 'Feature-to-Outcome Benefit Translation Tables', sectionHeader: 'Never Sell Features; Sell Unfair Competitive Advantages', body: 'Convert boring technical specifications into emotional and financial outcomes that make the purchase feel like a no-brainer.', boxTitle: 'Prompt: Feature-Benefit Matrix Generator', boxContent: 'Translate these 5 technical features of [Product] into: 1) What it does, 2) The immediate time/money saved, and 3) The emotional relief experienced by the founder/manager.', checkpoints: ['Quantify benefits in hours saved or % gain', 'Eliminate technical jargon where possible', 'Add a 1-line customer quote mockup for each'] }
      ]
    },
    {
      file: 'Social-Media-Viral-Hooks-Bible.pdf',
      color: '#0f172a', accent: '#f59e0b', category: 'AI Social Strategy',
      title: 'The 250+ Viral Social Media Hooks & Openers Bible',
      subtitle: 'Psychological Hooks for Twitter/X Threads, LinkedIn Carousels & Short-Form Video',
      highlights: ['Contrarian Truth & Counter-Intuitive Openers', 'Curiosity Gap & Knowledge Asymmetry Triggers', 'High-Retention Visual First-Slide Prompts', 'Call-to-Action Closing Scripts that Drive Saves & Shares'],
      chapters: [
        { title: 'The Anatomy of a Viral 3-Second Scroll-Stopper', sectionHeader: 'Overcoming Attention Deficit on Algorithmic Feeds', body: 'The first sentence determines 80% of your post distribution. Master the 6 core emotional levers: fear of missing out, contrarian perspective, secret reveal, and rapid ROI.', boxTitle: 'Prompt: 25 Viral Hook Variations for Topic', boxContent: 'For topic [Topic], write 25 viral hook openers categorized into: 1) The Contrarian ("Stop doing X..."), 2) The Asymmetric ROI ("How 1 file made $42k..."), 3) The Hard Truth, 4) The Cheat Sheet ("I spent 100 hours researching..."), and 5) The Step-by-Step Blueprint.', checkpoints: ['Keep hook under 120 characters', 'Create a visual gap between hook and line 2', 'Ensure line 2 confirms and intensifies the premise'] },
        { title: 'Carousel Slide-by-Slide Pacing Architecture', sectionHeader: 'Maintaining 85%+ Slide Retention Rates', body: 'A 10-slide carousel must follow a rollercoaster narrative: Problem -> Agitation -> 3 Framework Steps -> Proof -> Immediate Action -> Save Prompt.', boxTitle: 'Prompt: Complete 10-Slide Educational Carousel', boxContent: 'Write a full 10-slide LinkedIn / Instagram carousel for [Subject]. Give exact text for Slide 1 (Hook), Slides 2-3 (Context), Slides 4-8 (Actionable Steps), Slide 9 (Summary), and Slide 10 (Save & Share CTA).', checkpoints: ['Slide text must stay under 40 words per slide', 'Use bold highlight tokens on key metrics', 'Include a visual arrow or progression indicator'] }
      ]
    },
    {
      file: 'Real-Estate-Agent-AI-Marketing-Vault.pdf',
      color: '#0f172a', accent: '#e11d48', category: 'AI Real Estate',
      title: 'Real Estate Agent AI Marketing & Listing Vault',
      subtitle: 'Luxury Property Descriptions, Local Neighborhood SEO Guides & Buyer Nurture SMS',
      highlights: ['MLS Luxury Listing Copy Prompts (Architectural & Lifestyle)', 'Local Neighborhood Guidebook Generators', 'First-Time Homebuyer Educational Email Drips', 'Open House Follow-Up SMS Scripts & Cold Outreach'],
      chapters: [
        { title: 'Emotional & Architectural MLS Listing Copy', sectionHeader: 'Selling the Lifestyle, Not Just Square Footage', body: 'Elevate ordinary property features into aspirational living experiences that attract high-net-worth buyers and competing offers.', boxTitle: 'Prompt: Luxury Property Showcase Listing', boxContent: 'Write a compelling 400-word MLS property description for a [Bed/Bath/SqFt] home in [City/Neighborhood]. Emphasize chef-grade kitchen, seamless indoor-outdoor entertaining, natural morning light, and proximity to award-winning amenities.', checkpoints: ['Highlight 3 unique architectural details', 'Include bulleted key specifications at bottom', 'Add clear Private Tour Showing instructions'] },
        { title: 'Hyper-Local SEO Neighborhood Guides', sectionHeader: 'Ranking #1 for Local Relocation & School Queries', body: 'Position yourself as the undisputed neighborhood authority by publishing comprehensive community guides that Google loves.', boxTitle: 'Prompt: Complete Local Community Guide', boxContent: 'Generate an in-depth neighborhood guide for [Neighborhood, City]. Cover: vibe/demographics, top 5 local coffee shops/eateries, school district rankings, parks, commuter access, and current real estate trends.', checkpoints: ['Incorporate exact commute times to downtown', 'Name specific parks and local landmarks', 'Embed a free home valuation contact widget'] }
      ]
    },
    {
      file: 'Executive-Ghostwriting-AI-Playbook.pdf',
      color: '#0f172a', accent: '#0f172a', category: 'AI Ghostwriting',
      title: 'Executive Ghostwriting & Thought Leadership AI Playbook',
      subtitle: 'Extracting Founder Wisdom, Voice Cloning & Publishing Tier-1 Opinion Editorials',
      highlights: ['Voice Print & Cadence Extraction Framework', 'Interview-to-Op-Ed Synthesizer Prompts', 'Forbes/FastCompany Style Thought Pieces', 'Founder Storytelling & Vulnerability Anchors'],
      chapters: [
        { title: 'Voice Print Calibration & Tone Cloning', sectionHeader: 'Capturing the Founder Voice without Sounding Generic', body: 'Analyze writing samples to quantify vocabulary richness, average sentence length, paragraph pacing, and rhetorical questions.', boxTitle: 'Prompt: Executive Voice Clone Analyzer', boxContent: 'Analyze these 3 writing samples from CEO [Name]. Detail: 1) Average sentence cadence, 2) Preferred vocabulary and metaphors, 3) Tone stance (authoritative, empathetic, contrarian). Then adopt this exact voice for all future outputs.', checkpoints: ['Document 5 forbidden generic buzzwords', 'Establish signature sign-off or recurring phrase', 'Match punctuation style (em-dashes, semicolons)'] },
        { title: 'Turning 15-Minute Brain Dumps into Tier-1 Op-Eds', sectionHeader: 'From Voice Memo to Published Industry Authority', body: 'Take raw audio transcripts and shape them into structured, evidence-backed thought leadership articles that industry peers respect.', boxTitle: 'Prompt: 1,200-Word Thought Leadership Article', boxContent: 'Transform this raw interview transcript into an authoritative, 1,200-word thought leadership piece suitable for Substack or LinkedIn Top Voices. Frame around an emerging industry shift, supported by 3 counter-intuitive leadership lessons.', checkpoints: ['Open with a high-stakes personal anecdote', 'Include 2 actionable frameworks or mental models', 'Close with a provocative question for the industry'] }
      ]
    },
    {
      file: 'AI-Agents-LangChain-Workflow-Guide.pdf',
      color: '#0f172a', accent: '#6366f1', category: 'AI Engineering',
      title: 'Autonomous AI Agents & Multi-Agent Pipeline Blueprint',
      subtitle: 'State Machines, Tool Calling, Vector Memory & Production Failover Architectures',
      highlights: ['LangGraph & State Machine Design Patterns', 'Deterministic Tool Calling & JSON Schema Enforcers', 'RAG Vector Chunking & Hybrid Search Strategies', 'Production Rate Limit & 429 Graceful Fallbacks'],
      chapters: [
        { title: 'Agent Orchestration & Deterministic Tool Schemas', sectionHeader: 'Building Resilient Multi-Agent Pipelines', body: 'Coordinate specialized worker agents with clear boundaries, shared state dictionaries, and automatic schema validation.', boxTitle: 'Architecture Blueprint: Multi-Agent Hub & Spoke', boxContent: 'Design a 4-agent autonomous pipeline: 1) Researcher Agent, 2) Synthesizer Agent, 3) Reviewer/Critic Agent, 4) Formatter Agent. Detail input/output schemas, error boundaries, and consensus voting mechanisms.', checkpoints: ['Specify strict JSON Schema for tool calls', 'Implement timeout limits (60s max per step)', 'Include human-in-the-loop escalation gate'] },
        { title: 'Graceful Degradation & Quota Exhaustion Fallbacks', sectionHeader: 'Surviving API Downtime and 429 Rate Limits', body: 'Production-ready agents must never crash when external LLM providers return rate limits or intermittent outages.', boxTitle: 'Implementation Pattern: Exponential Backoff & Local Caching', boxContent: 'Detail the architecture for automatic provider failover (Gemini -> Claude -> OpenAI) with exponential jitter backoff, cached prompt templates, and local rule-based fallback generation.', checkpoints: ['Set initial retry backoff to 2s, 4s, 8s', 'Cache static curated assets on disk', 'Log structured telemetry to observability tools'] }
      ]
    },
    {
      file: 'Etsy-Print-On-Demand-AI-Blueprint.pdf',
      color: '#0f172a', accent: '#f97316', category: 'AI E-Commerce',
      title: 'Etsy Print-On-Demand & Digital Seller AI Blueprint',
      subtitle: 'Niche Research Prompts, 13-Tag SEO Generators, Mockup Scripts & 5-Star Review Engines',
      highlights: ['Low-Competition High-Search Niche Mining', '13-Tag Long-Tail Keyword Generators for Etsy SEO', 'Listing Description Copy with Conversion Bullets', 'Customer Support & Positive Review Automation Scripts'],
      chapters: [
        { title: 'Uncovering Untapped High-Margin Etsy Niches', sectionHeader: 'Finding Buyer Demand with Low Shop Competition', body: 'Identify underserved search queries with high conversion intent across wedding stationery, wall art, and digital templates.', boxTitle: 'Prompt: Etsy Niche Opportunity Analyzer', boxContent: 'You are an Etsy SEO expert. Analyze search trends in [Broad Category]. Identify 10 micro-niches with high buyer intent, low existing listing saturation, and seasonal evergreen stability. Give 5 exact product ideas for each.', checkpoints: ['Verify average sales price is >$15', 'Check that top competitors have <500 reviews', 'Confirm digital delivery viability (zero shipping cost)'] },
        { title: '13-Tag Keyword Stacking & Optimized Listing Copy', sectionHeader: 'Dominating Etsy First Page Search Placements', body: 'Maximize your search surface area by utilizing all 13 tags with full 20-character phrase utilization and exact title matching.', boxTitle: 'Prompt: 13-Tag Etsy SEO Generator', boxContent: 'For product [Product Name/Type], generate: 1) An 80-character SEO title with 3 primary keywords, 2) Exactly 13 multi-word tags under 20 characters each, and 3) A 300-word product description with download instructions.', checkpoints: ['Ensure no single-word tags are used', 'Check that all tags relate directly to product', 'Include clear instant download instructions'] }
      ]
    },
    {
      file: 'AI-Customer-Support-Bot-Prompt-Kit.pdf',
      color: '#0f172a', accent: '#06b6d4', category: 'AI Support Systems',
      title: 'AI Customer Support System & Zendesk Prompt Kit',
      subtitle: 'Empathy Guidelines, Escalation Rules, Refund Policies & 90% First-Touch Resolution',
      highlights: ['Customer Empathy & De-escalation Prompts', 'Knowledge Base Ingestion & Fact-Checked Retrieval', 'VIP Client Recognition & Instant Routing Rules', 'Standard Refund & Return Resolution Scripts'],
      chapters: [
        { title: 'De-Escalation & Emotional Calibration Prompts', sectionHeader: 'Turning Frustrated Customers into Loyal Advocates', body: 'AI support bots must balance swift resolution with genuine empathy and transparent human escalation options.', boxTitle: 'Prompt: Empathetic Support Resolution Engine', boxContent: 'Act as a Senior Customer Support Specialist. Respond to this angry customer regarding [Issue]. Tone: deeply empathetic, accountability-focused, and proactive. Provide immediate solution + courtesy credit offer.', checkpoints: ['Acknowledge customer frustration first', 'Offer clear solution in first 2 sentences', 'Provide ticket escalation option unconditionally'] },
        { title: 'Preventing Hallucinations & Knowledge Base Grounding', sectionHeader: 'Zero-Hallucination Guardrails for Legal & Pricing Policies', body: 'Enforce strict factual constraints so support agents never quote incorrect prices, features, or unauthorized promises.', boxTitle: 'System Prompt: Grounded Policy Guardrail', boxContent: 'You are a support agent. Answer questions using ONLY the provided knowledge base context. If the answer is not explicitly stated in the documentation, reply: "I want to make sure you get the exact answer, so I have routed this to our senior team."', checkpoints: ['Verify context grounding threshold', 'Ban speculation on unreleased features', 'Include direct links to documentation pages'] }
      ]
    },
    {
      file: 'Digital-Course-Curriculum-AI-Builder.pdf',
      color: '#0f172a', accent: '#84cc16', category: 'AI Education',
      title: 'Digital Course Curriculum & Cohort Builder AI Guide',
      subtitle: 'Module Outlines, Video Scripts, Action Worksheets & Community Discussion Prompts',
      highlights: ['Transformational Learning Arc & 6-Module Framework', '10-Minute Video Script Teleprompter Templates', 'Student Action Worksheets & Self-Audit Exercises', 'Live Q&A & Community Engagement Prompts'],
      chapters: [
        { title: 'Designing Transformational Course Outlines', sectionHeader: 'Structuring Content for Maximum Student Completion', body: 'Most online courses suffer from 5% completion rates. Structure each module around a tangible milestone and quick win.', boxTitle: 'Prompt: 6-Week Masterclass Course Architecture', boxContent: 'Create a 6-module curriculum for a masterclass on [Topic]. For each module specify: 1) Transformation outcome, 2) 4 concise 10-minute lessons, 3) 1 hands-on action exercise, and 4) Common student bottleneck & fix.', checkpoints: ['Limit each lesson to 1 core concept', 'Ensure module 1 provides an instant 24-hour win', 'Include downloadable PDF summary checklist'] },
        { title: 'High-Retention Video Scripting Formulas', sectionHeader: 'Keeping Viewers Engaged from First Second to Last', body: 'Draft conversational teleprompter scripts that explain complex concepts simply with visual cues and memorable mental models.', boxTitle: 'Prompt: 10-Minute Video Script Teleprompter', boxContent: 'Write a full 1,400-word video script for lesson [Lesson Title]. Structure: 0-30s Hook & Promise, 1-3m Core Mental Model, 4-8m Step-by-Step Walkthrough with on-screen visual prompts, 9-10m Action Homework.', checkpoints: ['Add [On-Screen Graphic] cues every 90 seconds', 'Speak directly to student ("You" vs "We")', 'End with a clear, single homework assignment'] }
      ]
    },
    {
      file: 'Podcast-Interview-Preparation-AI-Vault.pdf',
      color: '#0f172a', accent: '#a855f7', category: 'AI Media & PR',
      title: 'Podcast Host & Guest Interview Preparation AI Vault',
      subtitle: 'Guest Background Research, Deep-Cut Question Banks & Viral Soundbite Prompts',
      highlights: ['Deep-Cut Background Research in 5 Minutes', 'Non-Obvious Question Stacks (Tim Ferriss / Lex Fridman style)', 'Guest Pitch & Pre-Interview Briefing Templates', 'Post-Interview Viral Clip Timestamp Identifier'],
      chapters: [
        { title: 'Deep-Cut Research & Uncovered Story Mining', sectionHeader: 'Asking Questions Guests Have Never Been Asked Before', body: 'Avoid standard questions they have answered on 20 other podcasts. Find forgotten blog posts and pivotal early-career decisions.', boxTitle: 'Prompt: Comprehensive Podcast Guest Briefing', boxContent: 'Research guest [Name, Domain]. Synthesize: 1) Core career milestones, 2) 3 unique philosophies they champion, 3) 2 controversial stances, and 4) 10 deep-cut interview questions that bypass surface-level talking points.', checkpoints: ['Uncover 1 obscure anecdote from early career', 'Formulate open-ended "How did that feel..." prompts', 'Prepare 2 rapid-fire closing questions'] },
        { title: 'Soundbite Optimization & Viral Clip Extraction', sectionHeader: 'Maximizing Post-Show Reach on TikTok & YouTube Shorts', body: 'Identify high-emotion, high-insight moments in the transcript and format them for short-form video algorithms.', boxTitle: 'Prompt: Viral Clip Extractor & Caption Generator', boxContent: 'Scan this interview transcript and identify the top 5 moments with the highest emotional intensity or counter-intuitive insight. Provide exact timestamps, a 40-character hook title, and a 60-second caption with hashtags.', checkpoints: ['Ensure clips deliver standalone insight', 'Hook must appear in first 3 seconds of transcript', 'Add clean caption copy formatted for mobile'] }
      ]
    },
    {
      file: 'AI-Financial-Analyst-Prompt-Bible.pdf',
      color: '#0f172a', accent: '#10b981', category: 'AI Finance',
      title: 'AI Financial Analyst & 10-K Earnings Report Bible',
      subtitle: 'Balance Sheet Audits, DCF Valuations, Earnings Call Sentiment & Competitor Moats',
      highlights: ['10-K & 10-Q SEC Filing Summary Engines', 'Discounted Cash Flow (DCF) Sensitivity Prompts', 'Earnings Call Tone & Executive Sentiment Analysis', 'Porter’s Five Forces & Economic Moat Deep Dives'],
      chapters: [
        { title: 'Rapid SEC 10-K & 10-Q Filing Synthesizer', sectionHeader: 'Extracting Red Flags & Hidden Risks in Minutes', body: 'Cut through 200 pages of legal disclaimers to isolate revenue drivers, debt maturities, and management discussion nuances.', boxTitle: 'Prompt: 10-K Risk Factor & Moat Extractor', boxContent: 'Act as a Senior Wall Street Equity Analyst. Analyze the 10-K filing of [Ticker/Company]. Detail: 1) Organic vs acquired revenue growth, 2) Gross margin trajectory, 3) Top 3 existential business risks, and 4) Free cash flow conversion rate.', checkpoints: ['Calculate 3-year CAGR for revenue and FCF', 'Check debt-to-equity and interest coverage ratio', 'Flag any changes in revenue recognition accounting'] },
        { title: 'Earnings Call Q&A Sentiment & Hesitation Detection', sectionHeader: 'Reading Between the Lines of Executive Commentary', body: 'Analyze analyst Q&A transcripts for evasive language, hedged guidance, and unexpected positive operational inflection points.', boxTitle: 'Prompt: Earnings Call Tone & Guidance Audit', boxContent: 'Analyze this earnings call transcript. Highlight where management used vague language or deflected analyst questions. Compare CEO optimism with actual CFO numeric guidance.', checkpoints: ['Categorize commentary as Bullish, Neutral, or Bearish', 'Highlight differences between prepared remarks and Q&A', 'Summarize revised full-year guidance in bullet points'] }
      ]
    },
    {
      file: 'TikTok-Shop-Affiliate-AI-Scripts.pdf',
      color: '#0f172a', accent: '#ec4899', category: 'AI E-Commerce',
      title: 'TikTok Shop Affiliate & Live Selling AI Scripts',
      subtitle: '30-Second UGC Product Pitches, Objection-Crushing Live Scripts & Flash Sale CTA',
      highlights: ['3-Second Problem-Solution Video Openers', 'Authentic UGC Unboxing & Review Scripts', 'Live Stream Flash Sale & Urgency Triggers', 'Comment Reply Video Hooks that Drive Direct Purchases'],
      chapters: [
        { title: 'The Anatomy of a $100K TikTok Shop UGC Script', sectionHeader: 'Hook, Demonstration, Social Proof, and Impulse Buy', body: 'TikTok buyers purchase on impulse and emotion. Structure scripts to visually prove product efficacy in under 20 seconds.', boxTitle: 'Prompt: Viral TikTok Shop 30-Second Script', boxContent: 'Write a 30-second TikTok Shop UGC video script for [Product]. Include: 0-3s Visual Shock Hook, 4-12s Pain Point Demonstration, 13-22s Live Feature Proof, 23-30s Tap Orange Cart Urgency CTA.', checkpoints: ['Script must fit within 65 spoken words', 'Specify exact on-screen physical action', 'Instruct creator to physically point at bottom-left cart'] },
        { title: 'Live Stream Sales Funnels & Urgency Triggers', sectionHeader: 'Scaling Hourly Revenue During TikTok Live Streams', body: 'Keep live viewers watching with timed product drops, pinned coupon codes, and interactive viewer demonstrations.', boxTitle: 'Prompt: 1-Hour Live Stream Selling Schedule', boxContent: 'Generate a structured 1-hour TikTok Live selling script for a bundle of [Products]. Break down into 4x 15-minute product showcase cycles with countdown timers and exclusive live discount incentives.', checkpoints: ['Rotate featured product every 15 minutes', 'Include verbal pin-cart reminder every 3 minutes', 'Set up fake scarcity warning ("Only 12 left at this price")'] }
      ]
    },
    {
      file: 'Solopreneur-One-Person-Unicorn-OS.pdf',
      color: '#0f172a', accent: '#3b82f6', category: 'AI Solopreneurship',
      title: 'The Solopreneur AI Operating System (One-Person Unicorn)',
      subtitle: 'Daily Automated Workflows, 24/7 Digital Sales Funnels & Multi-Skill AI Leverage',
      highlights: ['Daily CEO Time-Blocking & AI Task Delegation', 'Automated Digital Product Creation & Store Publishing', 'Zero-Code Email Nurture & Retention Engines', 'Scaling to $20K/Month with Zero Full-Time Employees'],
      chapters: [
        { title: 'The One-Person Solopreneur Leverage Stack', sectionHeader: 'Operating with the Speed and Output of a 10-Person Team', body: 'Replace traditional departments (marketing, customer support, data entry, copywriting) with fine-tuned AI prompts and scheduled workflows.', boxTitle: 'Prompt: Daily Solopreneur Strategy Matrix', boxContent: 'Review my weekly goals: [Goals]. Allocate my time into 80% High-Leverage Creation and 20% Administrative Oversight. Generate the exact prompts to automate all administrative tasks today.', checkpoints: ['Eliminate all low-value manual data entry', 'Automate customer support email drafts', 'Focus 4 uninterrupted hours on core product assets'] },
        { title: 'Building Passive Digital Asset Flywheels', sectionHeader: 'Creating Digital Products that Sell 24 Hours a Day', body: 'Combine high-utility digital templates, SEO articles, and automated payment gateways into a compounding cash flow engine.', boxTitle: 'Prompt: Digital Product Ideation to Launch Plan', boxContent: 'Analyze [My Skill/Domain]. Design a $29 digital bundle (PDF guides + Excel models + Notion template) that solves an acute problem. Provide outline, title, pricing tiers, and landing page outline.', checkpoints: ['Confirm bundle offers 10x value for $29', 'Verify automated checkout and download delivery', 'Connect feedback collection loop for auto-reviews'] }
      ]
    },

    // --- 16 BUSINESS SOP KITS & CAREER PLAYBOOKS (Agent 9) ---
    {
      file: 'SaaS-Customer-Success-Retention-SOP.pdf',
      color: '#0f172a', accent: '#10b981', category: 'Business SOP Kit',
      title: 'SaaS Customer Success, Retention & Anti-Churn SOP',
      subtitle: 'User Onboarding Checklists, Health Scoring Rubrics & Cancellation Save Flows',
      highlights: ['First 14-Day Customer Onboarding Milestone Path', 'Customer Health Score Matrix (Green/Yellow/Red)', 'Automated Churn Warning Signals & Intervention Plays', 'Cancellation Exit Survey & Win-Back Discount Script'],
      chapters: [
        { title: 'The First 14 Days: Time-to-Value Acceleration', sectionHeader: 'Ensuring 100% of New Signups Hit Their "Aha" Moment', body: 'Over 70% of customer churn originates from failed onboarding. Guide every user to achieve core product value within 48 hours.', boxTitle: 'SOP: 14-Day New Customer Activation Protocol', boxContent: 'Day 1: Automated Welcome & 60s Guided Tour. Day 3: First Core Action Verification. If inactive, send proactive personal outreach from Success Lead. Day 7: Live Check-in Offer. Day 14: Value Realization Review.', checkpoints: ['Verify user completed initial setup', 'Trigger personalized check-in if usage is zero', 'Document account owner and primary contact info'] },
        { title: 'The Red-Account Rescue & Churn Reversal Playbook', sectionHeader: 'Saving At-Risk Accounts Before They Hit Cancel', body: 'Monitor feature usage drop-offs and negative support tickets to initiate proactive outreach before billing renewal.', boxTitle: 'SOP: Red-Flag Account Intervention Script', boxContent: 'When usage drops by >40% over 14 days, Success Lead initiates a 15-minute Strategic Alignment Call. Focus: What changed in your workflow? Offer customized configuration assistance and complimentary month extension.', checkpoints: ['Review open support tickets prior to call', 'Offer free bespoke setup or data import', 'Log root cause in internal CRM retention board'] }
      ]
    },
    {
      file: 'Freelancer-Hourly-to-Retainer-Sales-Kit.pdf',
      color: '#0f172a', accent: '#0284c7', category: 'Career & Agency',
      title: 'Freelancer Hourly-to-Monthly Retainer Conversion Kit',
      subtitle: 'Value-Based Pricing Models, 3-Tier Retainer Proposals & Scope Protection Clauses',
      highlights: ['The "Trading Hours for Dollars" Trap Breaker', '3-Tier Goldilocks Monthly Retainer Proposal Template', 'Scope Protection & Rollover Hour Policy Rules', 'Quarterly Rate Escalation & Retention Letter Template'],
      chapters: [
        { title: 'Transitioning One-Off Clients into Monthly Retainers', sectionHeader: 'Building Predictable $10K+ Monthly Recurring Revenue', body: 'Shift the client conversation from "How many hours will this take?" to "What is the continuous business ROI of having our dedicated team on standby?"', boxTitle: 'Template: 3-Tier Monthly Retainer Proposal', boxContent: 'Tier 1 (Foundation): 2 Core Deliverables/Mo ($1,500/mo). Tier 2 (Growth - Recommended): 5 Deliverables + Priority Slack ($3,200/mo). Tier 3 (Scale): Unlimited Deliverables + Weekly Strategy ($6,000/mo).', checkpoints: ['Anchor on client revenue upside', 'Clearly specify included deliverables', 'State that unused hours do not roll over'] },
        { title: 'Scope-Creep Defense & Extra Work Billing SOP', sectionHeader: 'Protecting Profit Margins and Professional Boundaries', body: 'Never do out-of-scope work for free. Use this courteous protocol to quote additional phases without damaging relationships.', boxTitle: 'SOP: Out-of-Scope Work Notification Script', boxContent: '"We would love to build [Feature/Asset]! Since this falls outside our agreed monthly scope, here is a quick add-on estimate: $650 and 4 business days. Shall we add this to this month or schedule for next month?"', checkpoints: ['Identify scope creep before beginning work', 'Provide fixed price quote in writing', 'Await written client approval before executing'] }
      ]
    },
    {
      file: 'Remote-Team-Async-Management-Handbook.pdf',
      color: '#0f172a', accent: '#6366f1', category: 'Operations SOP',
      title: 'Remote Team Async Management & Operations Handbook',
      subtitle: 'Meeting-Free Communication Protocols, Notion Documentation Standards & KPIs',
      highlights: ['The "Write Before You Speak" Async Rule', 'Loom Video & Slack Channel Etiquette Guidelines', 'Daily Standup Automation in Slack/Notion', 'Performance Evaluation & Output-Based Accountability'],
      chapters: [
        { title: 'Async Communication & Documentation Standards', sectionHeader: 'Eliminating Pointless Meetings & Timezone Friction', body: 'High-performing distributed teams communicate asynchronously through well-written context memos, clear deadlines, and tagged assignees.', boxTitle: 'SOP: Async Project Request Format (RFC)', boxContent: 'Every new initiative must be submitted as a 1-page Notion RFC: 1) Context & Problem, 2) Proposed Solution, 3) Risks & Alternatives, 4) Assigned Owner, 5) Exact Decision Due Date.', checkpoints: ['Prohibit meetings without written agenda', 'Give minimum 24 hours for global team feedback', 'Record all final decisions in team Notion wiki'] },
        { title: 'Output-Based Performance Accountability Metrics', sectionHeader: 'Measuring Actual Impact Over "Hours at Desk"', body: 'Trust remote teammates by judging them solely on shipped deliverables, sprint completion percentages, and milestone achievement.', boxTitle: 'SOP: Weekly Deliverable Review Matrix', boxContent: 'Every Friday by 5:00 PM local time, each team member submits: 1) Top 3 shipped wins this week, 2) Blockers encountered, 3) Top 3 committed outcomes for next week.', checkpoints: ['Audit shipped deliverables weekly', 'Address missed deadlines in private 1-on-1s', 'Celebrate remote wins in public #announcements channel'] }
      ]
    },
    {
      file: 'Startup-Pitch-Deck-Fundraising-Playbook.pdf',
      color: '#0f172a', accent: '#f59e0b', category: 'Fundraising Playbook',
      title: 'Startup Pitch Deck & Seed Fundraising Playbook',
      subtitle: 'The 12-Slide Venture Formula, SAFE Note Negotiation & Investor FAQ Vault',
      highlights: ['The 12-Slide Pitch Deck Structure (Sequoia/Y Combinator style)', 'Traction & Unit Economics Visualization Standards', 'SAFE vs Priced Round Term Sheet Cheat Sheet', 'Top 25 Hardest VC Questions & Model Answers'],
      chapters: [
        { title: 'The 12-Slide High-Impact Pitch Deck Anatomy', sectionHeader: 'Securing Second Meetings with Tier-1 Venture Firms', body: 'Investors spend an average of 2 minutes and 40 seconds reviewing a deck. Every slide must tell a cohesive narrative of inevitability.', boxTitle: 'Slide-by-Slide Deck Outline', boxContent: '1. Vision, 2. The Urgent Problem, 3. The Scalable Solution, 4. Market Size (TAM/SAM/SOM), 5. Product Demo, 6. Massive Traction (MoM Growth), 7. Business Model, 8. Go-To-Market, 9. Competition/Moat, 10. Financial Projections, 11. Team, 12. The Ask.', checkpoints: ['Keep slide count strictly to 12 slides', 'Ensure traction graph goes up and to the right', 'Display exact round size and target runway (18-24M)'] },
        { title: 'Term Sheet Mechanics: SAFE Notes & Dilution Math', sectionHeader: 'Raising Capital without Giving Away Your Company', body: 'Understand valuation caps, discount rates, pro-rata rights, and most-favored-nation clauses before signing any investment document.', boxTitle: 'Cheat Sheet: Post-Money SAFE Rules', boxContent: 'Post-Money SAFE formula: Investor Ownership % = Investment Amount / Post-Money Valuation Cap. Never stack SAFEs without modeling total founder dilution in our Startup Cap Table Excel model.', checkpoints: ['Model cap table dilution before signing', 'Set valuation cap realistic for traction level', 'Confirm founder voting control remains >51%'] }
      ]
    },
    {
      file: 'Employee-Performance-Review-SOP-Kit.pdf',
      color: '#0f172a', accent: '#e11d48', category: 'HR & Management',
      title: 'Employee Performance Review & Promotion SOP Kit',
      subtitle: '9-Box Talent Matrix, Quarterly Review Rubrics & Performance Improvement Plans (PIP)',
      highlights: ['9-Box Talent Assessment & Leadership Potential Matrix', 'Quarterly Review Template (Self & Manager Assessment)', 'Objective SMART Goal Setting Framework', 'Constructive Performance Improvement Plan (PIP) Workflow'],
      chapters: [
        { title: 'Quarterly Review Cadence & 9-Box Evaluation', sectionHeader: 'Eliminating Bias and Fostering Continuous Growth', body: 'Ditch obsolete annual reviews in favor of objective quarterly check-ins evaluated on performance results and cultural values.', boxTitle: 'SOP: Quarterly Review Schedule & Scoring', boxContent: 'Step 1: Employee completes Self-Review (Day 1-5). Step 2: Manager completes Assessment (Day 6-10). Step 3: In-person 45-min Calibration Conversation (Day 12-15). Step 4: Finalize next quarter goals.', checkpoints: ['Calibrate scores across department heads', 'Focus 70% of conversation on future goals', 'Document agreed commitments in HR system'] },
        { title: 'Managing Underperformance: Legal & Actionable PIPs', sectionHeader: 'Turning Around Struggling Employees or Parting Ways Amicably', body: 'A Performance Improvement Plan must provide crystal-clear, measurable objectives, weekly check-in milestones, and unequivocal standards.', boxTitle: 'Template: 30-Day Performance Improvement Plan', boxContent: 'Clear statement of performance gap -> 3 specific measurable deliverables required within 30 days -> Weekly support meetings with manager -> Defined outcome if goals are not achieved.', checkpoints: ['Ensure metrics are 100% objective and achievable', 'Hold documented weekly feedback sessions', 'Consult legal/HR counsel before initiating PIP'] }
      ]
    },
    {
      file: 'Content-Creator-Sponsorship-Rate-Card-Kit.pdf',
      color: '#0f172a', accent: '#8b5cf6', category: 'Creator Business',
      title: 'Content Creator Brand Sponsorship & Media Kit',
      subtitle: 'Dynamic CPM Rate Cards, Inbound Brand Pitch Responses & Usage Rights Pricing',
      highlights: ['CPM & Engagement Rate Sponsorship Pricing Formulas', 'Professional 1-Page Media Kit Layout & Demographics', 'Brand Pitch Email Responses (Negotiating 2-3x Higher Rates)', 'Usage Rights, Exclusivity & Whitelisting Contract Clauses'],
      chapters: [
        { title: 'Pricing Sponsorships Based on Value & Audience Intent', sectionHeader: 'Stopping the Underpricing of Creator Influence', body: 'Never charge flat $100 rates. Factor in video views, conversion power, production costs, and 30-day paid usage whitelisting rights.', boxTitle: 'Formula: Sponsorship Rate Calculation', boxContent: 'Base Fee = (Average 30-Day Views / 1000) * $25-$45 CPM. Add-ons: +30% for 30-day ad whitelisting, +25% for 60-day niche exclusivity, +20% for link in bio & newsletter inclusion.', checkpoints: ['Calculate exact 30-day median view count', 'Itemize usage rights separately on invoice', 'Require 50% upfront deposit before filming'] },
        { title: 'Negotiating with Brands: The Inbound Pitch Script', sectionHeader: 'Turning "We Have No Budget" into $3,000+ Packages', body: 'When brands ask for free product gifting, counter with professional commercial packages that tie directly to their quarterly sales targets.', boxTitle: 'Script: The Professional Counter-Offer', boxContent: '"Thank you for reaching out! While we do not accept unpaid gifting, our audience of [Demographics] is actively looking for solutions in your space. Here is our media kit with packages starting at $1,500 that guarantee high engagement."', checkpoints: ['Send media kit as clean PDF attachment', 'Follow up 3 business days later with case study', 'Secure signed agreement before product shipment'] }
      ]
    },
    {
      file: 'E-Commerce-Returns-Chargeback-Defense-SOP.pdf',
      color: '#0f172a', accent: '#ef4444', category: 'E-Commerce SOP',
      title: 'E-Commerce Returns, Refunds & Chargeback Defense SOP',
      subtitle: 'Win 85%+ Stripe/PayPal Disputes, Return Fraud Prevention & Restocking Protocols',
      highlights: ['Stripe/PayPal Chargeback Evidence Submission Templates', 'Friendly Fraud & Package Theft Mitigation Playbook', 'Automated RMA & Customer Self-Service Return Portal', 'Damaged Goods Inspection & Restocking Protocol'],
      chapters: [
        { title: 'The Winning Chargeback Dispute Evidence Package', sectionHeader: 'Reclaiming Revenue from Fraudulent Chargebacks', body: 'Card issuers require bulletproof documentation. Assemble delivery tracking, IP logs, billing address matches, and customer signature proofs.', boxTitle: 'SOP: Stripe/PayPal Dispute Evidence Submission', boxContent: 'Section 1: Executive Summary & Order Timeline. Section 2: Proof of Delivery (Carrier GPS tracking + Signature). Section 3: Customer Communication Log. Section 4: Return Policy Acceptance checkbox at checkout.', checkpoints: ['Submit evidence within 5 business days', 'Highlight matching AVS and CVV pass codes', 'Include screenshot of signed terms of service'] },
        { title: 'Automating the Returns Process with Zero Friction', sectionHeader: 'Protecting Margins While Delivering 5-Star Customer Service', body: 'Clear return guidelines reduce support ticket volume by 60% and turn return customers into repeat purchasers through store credit incentives.', boxTitle: 'SOP: Return Merchandise Authorization (RMA)', boxContent: 'Customer initiates return via portal -> Instant prepaid label generated if within 30 days -> Warehouse scan triggers inspection -> Automatic store credit (+10% bonus) or original payment refund.', checkpoints: ['Offer 10% bonus credit for choosing gift card', 'Require photos for damaged goods claims', 'Restock undamaged inventory within 24 hours'] }
      ]
    },
    {
      file: 'Commercial-Lease-Negotiation-Playbook.pdf',
      color: '#0f172a', accent: '#059669', category: 'Real Estate SOP',
      title: 'Commercial Office & Retail Lease Negotiation Playbook',
      subtitle: 'Tenant Improvement Allowances, CAM Fee Audits, Sublease Rights & Escapes',
      highlights: ['The Top 10 Hidden Landlord Clauses to Strike', 'Tenant Improvement (TI) Allowance Negotiation Strategies', 'Common Area Maintenance (CAM) Audit Checklist', 'Sublease, Assignment & Early Termination Escape Clauses'],
      chapters: [
        { title: 'Key Commercial Lease Terms & Negotiation Levers', sectionHeader: 'Saving $50,000+ on Commercial Real Estate Commitments', body: 'Never sign the landlord’s standard form lease. Negotiate rent abatement, tenant improvement allowances, and personal guarantee sunset clauses.', boxTitle: 'Checklist: Crucial Tenant Protection Clauses', boxContent: '1. Rent Abatement (3-6 months free during fit-out), 2. TI Allowance ($30-$60/sqft landlord contribution), 3. CAM Expense Cap (max 5% annual increase), 4. Right to Sublease without arbitrary landlord denial.', checkpoints: ['Cap controllable CAM expenses at 5% per year', 'Ensure personal guarantee expires after Year 2', 'Verify certificate of occupancy responsibilities'] },
        { title: 'Auditing Operating Expenses & Triple-Net (NNN) Fees', sectionHeader: 'Catching Overbilled Property Management Fees', body: 'Landlords frequently slip capital expenditures into operating expense pass-throughs. Exercise your legal audit rights annually.', boxTitle: 'SOP: Annual CAM Reconciliation Review', boxContent: 'Request detailed general ledger for all CAM charges -> Verify exclusions (roof replacements, leasing broker commissions, legal disputes) -> Compare to contractual expense cap -> Demand refund credit.', checkpoints: ['Demand CAM reconciliation statements by April 1', 'Cross-check against lease exclusion list', 'File written dispute within 60 days of statement'] }
      ]
    },
    {
      file: 'High-Ticket-Consulting-Proposal-Blueprint.pdf',
      color: '#0f172a', accent: '#1d4ed8', category: 'Consulting Sales',
      title: 'High-Ticket B2B Consulting Proposal & Closing Blueprint',
      subtitle: 'Diagnosis-Based Selling, 6-Figure Proposal Architecture & Value Stacking',
      highlights: ['The Strategic Diagnosis Call Framework', 'The 6-Section Value-Based Proposal Layout', 'Handling C-Suite Risk & Implementation Objections', 'Mutual Action Plan & Milestone Sign-Off Protocol'],
      chapters: [
        { title: 'The Diagnosis Conversation: Uncovering $100K+ ROI', sectionHeader: 'Consulting as a Doctor, Not a Pitchman', body: 'Prescription without diagnosis is malpractice. Use deep diagnostic inquiry to quantify the cost of inaction before ever mentioning a solution.', boxTitle: 'Framework: The Strategic Diagnostic Inquiry', boxContent: '1. Current State: What is the exact operational bottleneck? 2. Financial Impact: How much revenue is lost each month? 3. Desired Future: What does success look like in 6 months? 4. Urgency: Why solve this now?', checkpoints: ['Let the prospect quantify the financial problem', 'Never mention your solution during diagnosis', 'Schedule proposal review call on the diagnostic call'] },
        { title: 'The 6-Figure Value-Based Proposal Structure', sectionHeader: 'Crafting Proposals that Executive Boards Sign Without Hesitation', body: 'Frame the proposal around strategic outcomes, risk mitigation, timeline governance, and clear ROI multiples (minimum 5x return).', boxTitle: 'Structure: The 6-Section High-Ticket Proposal', boxContent: 'Section 1: Executive Summary & Problem Diagnosis. Section 2: Strategic Objectives & KPIs. Section 3: Phased Scope of Work. Section 4: Mutual Governance & Timeline. Section 5: Investment Options. Section 6: Mutual Sign-Off.', checkpoints: ['Present 3 investment options (Good, Better, Best)', 'Include client responsibilities and prerequisites', 'Conduct live proposal walkthrough (never email blindly)'] }
      ]
    },
    {
      file: 'Crisis-PR-Brand-Reputation-Playbook.pdf',
      color: '#0f172a', accent: '#b91c1c', category: 'Public Relations SOP',
      title: 'Crisis PR & Executive Brand Reputation Playbook',
      subtitle: 'The 1-Hour Response Protocol, Press Release Templates & Social Media Quarantine',
      highlights: ['The Golden Hour: First 60-Minute Crisis Protocol', 'Holding Statement & Media Press Release Templates', 'Social Media Dark Protocol & Paid Ad Pausing', 'Internal Employee FAQ & Leak Prevention Guidelines'],
      chapters: [
        { title: 'The Golden Hour: Immediate Crisis Response SOP', sectionHeader: 'Taking Control of the Narrative Before Rumors Spread', body: 'The first 60 minutes determine whether a crisis becomes an existential threat or a minor blip. Follow strict command hierarchy.', boxTitle: 'SOP: First 60-Minute Emergency Protocol', boxContent: 'Minute 0-15: Convene Crisis PR Council (CEO, Legal, PR Lead). Minute 15-30: Establish factual timeline and verify details. Minute 30-45: Issue neutral holding statement. Minute 45-60: Pause all automated marketing & social ads.', checkpoints: ['Designate a single authorized company spokesperson', 'Immediately pause all scheduled marketing emails', 'Notify customer support team with approved response lines'] },
        { title: 'The Holding Statement & Formal Press Response', sectionHeader: 'Clear, Accountable Communication Without Legal Exposure', body: 'Acknowledge the situation with dignity, declare the steps being taken, and commit to transparent scheduled updates.', boxTitle: 'Template: Corporate Crisis Press Statement', boxContent: '"We are actively investigating [Issue/Incident]. We take this matter with the utmost seriousness. Our primary focus right now is [Action being taken]. We will provide our next verified update at [Exact Time]."', checkpoints: ['Never speculate or assign premature blame', 'Provide a specific timestamp for the next update', 'Direct all press inquiries to dedicated PR email'] }
      ]
    },
    {
      file: 'Restaurant-Bar-Opening-Standard-Operating-Procedures.pdf',
      color: '#0f172a', accent: '#ea580c', category: 'Hospitality SOP',
      title: 'Restaurant & Bar Grand Opening Standard Operating Procedures',
      subtitle: 'FOH/BOH Checklists, Health Code Inspection Protocols, Food Cost Engineering',
      highlights: ['Front-of-House (FOH) Table Turn & Service Steps', 'Back-of-House (BOH) Line Prep & Food Safety SOP', 'Daily Cash Drawer & POS Closing Reconciliation', 'Health Department Inspection Readiness Audit'],
      chapters: [
        { title: 'Front-of-House (FOH) Service Standards', sectionHeader: 'Delivering Consistent 5-Star Hospitality Experiences', body: 'Systematize the greeting, order-taking, upselling, and bill delivery workflows to maximize guest spend and table turnover.', boxTitle: 'SOP: The 7 Steps of Dining Service', boxContent: 'Step 1: Greet guests within 60 seconds with water. Step 2: Beverage order and daily specials feature. Step 3: Food order with allergy confirmation. Step 4: 2-minute quality check post-delivery. Step 5: Table maintenance. Step 6: Dessert offer. Step 7: Prompt check delivery.', checkpoints: ['Verify tables set to exact diagram spec', 'Train staff on top 3 high-margin wine/app pairings', 'Check restroom cleanliness every 45 minutes'] },
        { title: 'Kitchen Line Prep & Food Safety Compliance (HACCP)', sectionHeader: 'Eliminating Waste and Ensuring Zero Food Safety Violations', body: 'Maintain strict temperature logs, FIFO stock rotation, and labeling standards across all walk-in coolers and prep stations.', boxTitle: 'SOP: Opening & Closing Kitchen Temperature Audits', boxContent: 'Log walk-in cooler temp (must be below 40°F / 4°C) twice daily. Discard all prepared items past 4 days. Sanitize prep stations with quaternary ammonium solution. Calibrate food probe thermometers weekly in ice water.', checkpoints: ['Record daily temperatures on clipboard log', 'Enforce FIFO (First-In, First-Out) rotation', 'Ensure all line cooks wear hairnets and gloves'] }
      ]
    },
    {
      file: 'Real-Estate-Wholesaling-Contract-SOP.pdf',
      color: '#0f172a', accent: '#047857', category: 'Real Estate SOP',
      title: 'Real Estate Wholesaling & Assignment of Contract SOP',
      subtitle: 'Motivated Seller Lead Generation, Purchase Agreements & Title Company Closing',
      highlights: ['Motivated Seller Cold Calling & Direct Mail Scripts', 'Assign-and-Close Purchase Agreement Clauses', 'Cash Buyer Database Curation & Dispo Marketing', 'Title Company Closing & Double-Close Escrow SOP'],
      chapters: [
        { title: 'Securing Off-Market Deals with Motivated Sellers', sectionHeader: 'Finding Distressed Properties at 60-70% of Fair Market Value', body: 'Locate probate, tax delinquent, or pre-foreclosure sellers and position yourself as an all-cash, zero-hassle problem solver.', boxTitle: 'Script: The 4-Pillar Motivated Seller Call', boxContent: '1. Rapport: "I noticed your home on [Street] and was curious if you have ever considered selling?" 2. Condition: "What repairs does it need?" 3. Timeline: "How fast do you need cash?" 4. Price: "What is the absolute bottom dollar you would accept as-is?"', checkpoints: ['Never offer price first; let seller name their number', 'Calculate Maximum Allowable Offer (MAO = ARV*0.7 - Repairs)', 'Include inspection contingency clause in contract'] },
        { title: 'The Assignment of Contract Closing Protocol', sectionHeader: 'Collecting $5,000–$25,000 Assignment Fees Ethically', body: 'Assign your equitable interest in the purchase contract to an end cash buyer using clean escrow documentation.', boxTitle: 'SOP: Assignment Agreement Escrow Submission', boxContent: 'Execute standard Assignment of Contract specifying your Assignment Fee ($10,000) -> Deliver original contract + assignment to investor-friendly Title Company -> Buyer wires non-refundable earnest money -> Title Company disburses fee at closing.', checkpoints: ['Verify buyer deposits non-refundable $5,000 EMD', 'Use investor-friendly title company or closing attorney', 'Ensure contract includes "and/or assigns" clause'] }
      ]
    },
    {
      file: 'Affiliate-Program-Recruitment-Playbook.pdf',
      color: '#0f172a', accent: '#4338ca', category: 'Growth Playbook',
      title: 'Affiliate Program Launch & Influencer Recruitment Playbook',
      subtitle: 'Commission Structures, Affiliate Portal Setup, Outreach Swipes & Cookie Policies',
      highlights: ['Tiered Commission Structures (Flat, Recurring & Performance)', 'Affiliate Portal & Tracking Link Setup (Rewardful/FirstPromoter)', 'Direct Outreach Scripts for Top Bloggers & Creators', 'Monthly Promotional Asset Kits & Swipes'],
      chapters: [
        { title: 'Designing an Irresistible Affiliate Commission Model', sectionHeader: 'Attracting Top-Tier Affiliates Who Actually Promote', body: 'Top affiliates will not promote 10% one-time offers. Structure compelling 30-50% digital or 20-30% recurring SaaS commissions with 60-day cookie tracking.', boxTitle: 'Architecture: Tiered Affiliate Commission Model', boxContent: 'Tier 1 (Bronze): 25% recurring for 1-10 referrals. Tier 2 (Silver): 35% recurring for 11-50 referrals + dedicated discount code. Tier 3 (Gold VIP): 50% recurring for 50+ referrals + co-branded webinar & dedicated affiliate manager.', checkpoints: ['Set cookie window to minimum 60 days', 'Implement automatic payouts via PayPal / Stripe', 'Provide instant access to banners, logos, and swipe copy'] },
        { title: 'Outreach & Onboarding the Top 50 Industry Affiliates', sectionHeader: 'Enrolling Influential Bloggers and Tool Reviewers', body: 'Identify bloggers ranking for "[Competitor] Alternatives" and offer customized affiliate accounts with upfront bonus incentives.', boxTitle: 'Script: The VIP Affiliate Invitation Email', boxContent: '"Hey [Name], loved your recent breakdown on [Topic]. We noticed our tool solves [Problem] for your audience. We set up an exclusive 40% VIP recurring affiliate account for you with a custom $10 off discount code for your followers."', checkpoints: ['Target websites already ranking for related keywords', 'Provide pre-written review post draft and screenshots', 'Send monthly payouts on time on the 1st of every month'] }
      ]
    },
    {
      file: 'Brand-Identity-Design-Handoff-SOP.pdf',
      color: '#0f172a', accent: '#d946ef', category: 'Design & Agency SOP',
      title: 'Brand Identity Design Guidelines & Client Handoff SOP',
      subtitle: 'Color Palette Codes (HEX/RGB/CMYK), Typography Hierarchy, Logo Safe Zones',
      highlights: ['Master Logo Suite Asset File Formats (SVG, EPS, PNG, PDF)', 'Color Harmony & Accessibility Contrast Ratio Matrix', 'Primary & Secondary Typography Font Pairing Rules', 'Client Final Asset Archive Directory Structure'],
      chapters: [
        { title: 'The Complete Master Logo Suite File Standards', sectionHeader: 'Delivering Industry-Standard Vector & Raster Brand Assets', body: 'Never send a single low-res JPG. Deliver full vector lockups in primary, horizontal, stacked, mark-only, and reverse monochrome variants.', boxTitle: 'SOP: Logo Export Directory Structure', boxContent: '/01_Primary_Logo (SVG, EPS, PDF, Transparent PNG), /02_Secondary_Marks, /03_Favicon_AppIcons (16x16 to 512x512), /04_Brand_Guidelines_PDF, /05_Font_Licenses.', checkpoints: ['Convert all vector fonts to outlines (curves)', 'Export transparent PNGs in high-res 300 DPI', 'Include both RGB (digital) and CMYK (print) versions'] },
        { title: 'Brand Guidelines Style Guide Document Assembly', sectionHeader: 'Ensuring Long-Term Visual Consistency Across All Channels', body: 'Create an authoritative 10-page brand book that internal teams and external agencies follow without ambiguity.', boxTitle: 'Guidelines Checklist: Essential Inclusions', boxContent: '1. Logo clear space & minimum sizing rules, 2. Strict logo misuse examples (do not stretch, do not recolor), 3. Primary & Accent color palette with HEX, RGB, CMYK, and Pantone codes, 4. Web typography hierarchy (H1-H4, body, captions).', checkpoints: ['Test color contrast against WCAG AA accessibility standards', 'Specify fallback system fonts for email and web', 'Deliver brand book as locked, searchable vector PDF'] }
      ]
    },
    {
      file: 'Software-Security-Compliance-Audit-SOP.pdf',
      color: '#0f172a', accent: '#0284c7', category: 'Tech & Compliance',
      title: 'Software Security, SOC2 & GDPR Compliance Audit SOP',
      subtitle: 'Data Encryption Protocols, Employee Access Controls, Vendor Risk & Privacy Policies',
      highlights: ['SOC2 Type II Readiness Checklist & Evidence Vault', 'GDPR / CCPA User Data Rights & Deletion Protocols', 'Role-Based Access Control (RBAC) & 2FA Enforcement', 'Incident Response & Data Breach Notification Policy'],
      chapters: [
        { title: 'SOC2 Type II Trust Services Criteria Preparation', sectionHeader: 'Winning Enterprise Deals with Certified Security Posture', body: 'Enterprise buyers require verified security credentials. Establish automated continuous compliance monitoring across infrastructure.', boxTitle: 'SOP: SOC2 Core Security Controls Audit', boxContent: '1. Infrastructure: Enforce TLS 1.3 in transit and AES-256 at rest across all databases. 2. Personnel: Background checks + mandatory annual security awareness training. 3. Access: Enforce hardware 2FA and quarterly RBAC audits.', checkpoints: ['Verify automated database backups are encrypted', 'Confirm PR code reviews require at least 1 approval', 'Enable cloud provider audit trail logs (AWS CloudTrail)'] },
        { title: 'GDPR / CCPA Right-to-be-Forgotten & Data Export SOP', sectionHeader: 'Honoring Global Privacy Mandates Without Manual Overhead', body: 'Establish deterministic database deletion scripts and customer export pipelines to fulfill statutory privacy requests within 30 days.', boxTitle: 'SOP: User Data Deletion & Export Workflow', boxContent: 'Step 1: Authenticate identity of requester. Step 2: Run automated database purge script across primary DB, backups, analytics, and marketing lists. Step 3: Issue signed Certificate of Data Erasure within 30 days.', checkpoints: ['Complete deletion within 30-day statutory window', 'Ensure marketing CRM unsubscribe is synchronized', 'Retain financial transaction logs as required by tax law'] }
      ]
    },
    {
      file: 'Executive-Board-Meeting-Minutes-SOP.pdf',
      color: '#0f172a', accent: '#475569', category: 'Corporate Governance',
      title: 'Executive Board Meeting Minutes & Governance SOP',
      subtitle: 'Legal Meeting Minutes Standards, Resolution Voting Records & Board Packets',
      highlights: ['Board of Directors Meeting Packet Assembly Schedule', 'Legal Minutes Drafting Standards & Quorum Verification', 'Formal Resolution Voting & Dissent Recording SOP', 'Post-Meeting Executive Action Item Accountability Log'],
      chapters: [
        { title: 'Board Packet Assembly & Pre-Meeting Distribution', sectionHeader: 'Enabling Productive Governance and Strategic Alignment', body: 'Distribute structured financial dashboards, CEO strategic updates, and voting resolutions at least 5 business days before the meeting.', boxTitle: 'SOP: Board Packet Timeline & Structure', boxContent: 'T-7 Days: Department heads submit quarterly metrics. T-5 Days: Formal Board Packet distributed via encrypted portal. Structure: 1. Agenda, 2. Financial Statements, 3. Strategic Resolutions, 4. Committee Reports.', checkpoints: ['Verify quorum requirements per company bylaws', 'Ensure financial statements are CFO-signed', 'Distribute via secure board portal (no unencrypted email)'] },
        { title: 'Drafting Legally Defensible Meeting Minutes', sectionHeader: 'Protecting Directors Under the Business Judgment Rule', body: 'Document discussions, director deliberations, abstentions, and formal resolution votes accurately to safeguard company governance.', boxTitle: 'Template: Board Resolution & Minutes Format', boxContent: '"RESOLVED: That the Board of Directors hereby approves [Action]. Motion made by [Director A], seconded by [Director B]. In favor: [All / Names]. Opposed: None. Abstentions: [Director C due to conflict of interest]."', checkpoints: ['Record exact meeting call to order and adjournment times', 'Record all director recusals due to conflict of interest', 'Obtain Corporate Secretary and Chair signatures on final minutes'] }
      ]
    }
  ];

  for (const pb of playbooks) {
    await generatePlaybook(pb.file, pb);
  }

  console.log('Successfully generated all 32 Playbooks & SOP Kits!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
