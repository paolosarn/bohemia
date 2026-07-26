/* THE REASSEMBLY SHOT (7/26/26). Amendment C says the acceptance test happens
 * ON THE REAL RENDER PATH, so this drives the reassembled frame in a real
 * browser canvas (integer blit, smoothing off) and saves what the canvas
 * actually produced. A Python re-render would prove nothing about the engine.
 * REUSE CHECK: draws nothing; it is a screenshot of a canvas.
 *   node tools/bohemia_reassembly_shot.js -> records/target/REASSEMBLED.png */
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
  const p = await b.newPage({ viewport: { width: 900, height: 1900 } });
  p.on('pageerror', e => console.log('  PAGEERR', String(e).slice(0, 200)));
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_REASSEMBLY_7_26_26.html'));
  await p.waitForFunction(() => document.title === 'REASSEMBLED', null, { timeout: 30000 });
  const buf = await p.evaluate(() => document.getElementById('cv').toDataURL('image/png'));
  fs.writeFileSync(path.join(REPO, 'records', 'target', 'REASSEMBLED.png'),
                   Buffer.from(buf.split(',')[1], 'base64'));
  console.log('OK -> records/target/REASSEMBLED.png');
  await b.close();
})();
