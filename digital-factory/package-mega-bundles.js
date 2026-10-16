const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../../achrafbah.github.io-main/downloads');
const BUNDLE_DIR = path.join(BASE_DIR, 'bundles');
if (!fs.existsSync(BUNDLE_DIR)) fs.mkdirSync(BUNDLE_DIR, { recursive: true });

function zipDirectory(sourceDir, outZipPath, filterFn) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Created: ${path.basename(outZipPath)} (${archive.pointer()} bytes)`);
      resolve();
    });
    archive.on('error', reject);

    archive.pipe(output);

    if (Array.isArray(sourceDir)) {
      sourceDir.forEach(src => {
        archive.directory(src.dir, src.dest || false);
      });
    } else {
      archive.directory(sourceDir, false);
    }

    archive.finalize();
  });
}

async function run() {
  console.log('Packaging all updated Mega Bundles...');

  const excelDir = path.join(BASE_DIR, 'excel');
  const plannersDir = path.join(BASE_DIR, 'planners');
  const playbooksDir = path.join(BASE_DIR, 'playbooks');

  // 1. All 40 Excel Models Bundle
  await zipDirectory(excelDir, path.join(BUNDLE_DIR, 'All-40-Business-Excel-Templates-Bundle.zip'));

  // 2. All 300+ Printable Planners Bundle
  await zipDirectory(plannersDir, path.join(BUNDLE_DIR, 'All-300-Printable-Planners-Bundle.zip'));

  // 3. All 40 AI Playbooks & SOP Kits Bundle
  await zipDirectory(playbooksDir, path.join(BUNDLE_DIR, 'All-40-AI-Prompts-and-SOP-Kits-Bundle.zip'));

  // 4. Complete 380+ Digital Products Mega Bundle
  await zipDirectory([
    { dir: excelDir, dest: '01_Excel_Models' },
    { dir: plannersDir, dest: '02_Printable_Planners_PDF' },
    { dir: playbooksDir, dest: '03_AI_Prompt_Bibles_and_SOP_Kits' }
  ], path.join(BUNDLE_DIR, 'Complete-380-Digital-Products-Mega-Bundle.zip'));

  // Also maintain legacy name alias so existing download links work seamlessly:
  fs.copyFileSync(
    path.join(BUNDLE_DIR, 'Complete-380-Digital-Products-Mega-Bundle.zip'),
    path.join(BUNDLE_DIR, 'Complete-60-Templates-Mega-Bundle.zip')
  );
  fs.copyFileSync(
    path.join(BUNDLE_DIR, 'All-40-Business-Excel-Templates-Bundle.zip'),
    path.join(BUNDLE_DIR, 'All-12-Business-Excel-Templates-Bundle.zip')
  );
  fs.copyFileSync(
    path.join(BUNDLE_DIR, 'All-300-Printable-Planners-Bundle.zip'),
    path.join(BUNDLE_DIR, 'All-48-Printable-Planners-Bundle.zip')
  );

  console.log('All Mega Bundles packaged successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
