/* THE MASTER PALETTE, ON THE REAL FRAME (7/29/26).
 *
 * Paolo liked the palette SHEET. A sheet is swatches, and swatches always look
 * good — every colour is next to a colour that was chosen to sit beside it. The
 * only question that matters is what the street looks like when the whole set is
 * forced through one palette, so this drives all three versions of the SAME frame
 * — same map, same layout, same renderer, tile images the only variable — in a
 * real browser canvas, and saves what the canvas actually produced.
 *
 * REUSE CHECK: draws nothing. Three screenshots of a canvas.
 *   node tools/bohemia_master_palette_proof.js -> records/target/PAL_*.png */
const path = require('path'), fs = require('fs');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
const SHOTS = [
  ['BOHEMIA_REASSEMBLY_7_26_26.html', 'REASSEMBLED', 'PAL_FROZEN.png'],
  ['BOHEMIA_REASSEMBLY_RECOOK_7_28_26.html', 'RECOOK-REASSEMBLED', 'PAL_RECOOK.png'],
  ['BOHEMIA_REASSEMBLY_MASTER_7_29_26.html', 'RECOOK-REASSEMBLED', 'PAL_MASTER.png'],
];
(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  for (const [page, title, out] of SHOTS) {
    const p = await b.newPage({ viewport: { width: 900, height: 1900 } });
    p.on('pageerror', e => console.log('  PAGEERR', String(e).slice(0, 200)));
    await p.goto('file://' + path.join(REPO, 'slices', page));
    await p.waitForFunction(t => document.title === t, title, { timeout: 30000 });
    const buf = await p.evaluate(() => document.getElementById('cv').toDataURL('image/png'));
    fs.writeFileSync(path.join(REPO, 'records', 'target', out),
                     Buffer.from(buf.split(',')[1], 'base64'));
    console.log('OK ->', out);
    await p.close();
  }
  await b.close();
})();
