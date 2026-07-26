/* BOHEMIA "BEFORE" SHOT (7/26/26). The target screens are worthless without the
 * thing they are a target FOR. This drives the SHIPPED walkable street level
 * (slices/BOHEMIA_RUN_CURRENT.html) in a real browser at iPhone portrait and
 * saves exactly what Paolo sees today, so the judge page is a real comparison
 * and not a claim. VERIFY-ON-THE-REAL-SURFACE law.
 *   node tools/bohemia_target_before_shot.js -> records/target/BEFORE_RUN.png
 * REUSE CHECK: draws nothing; it is a screenshot of the shipped build. */
const path = require('path'), fs = require('fs');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 418, height: 912 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_RUN_CURRENT.html'));
  await p.waitForTimeout(6000);
  for (let i = 0; i < 3; i++) { await p.mouse.click(209, 640); await p.waitForTimeout(900); }
  fs.mkdirSync(path.join(REPO, 'records', 'target'), { recursive: true });
  await p.screenshot({ path: path.join(REPO, 'records', 'target', 'BEFORE_RUN.png') });
  await b.close();
  console.log('OK -> records/target/BEFORE_RUN.png');
})();
