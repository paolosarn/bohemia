/* HOUSE 01 AGAINST A REAL PERSON (7/29/26).
 *
 * Paolo: "lets make a single house realistic to human sizing please." A spec sheet
 * saying "the door is 2.03 m" is not a proof of that — the only proof is the
 * character standing next to the door. So this lifts the ACTUAL player sprite off
 * the CHARACTER tab's canvas (not a stand-in silhouette, not a redraw) and reports
 * its real pixel height, so the house can be composited against the thing he steers.
 *
 * WHY THE SPRITE AND NOT A DRAWN FIGURE: a figure I invent proves my own arithmetic
 * against itself. The sprite is the body already in the game, so if IT is the wrong
 * size the comparison shows that too, which is the more useful answer.
 *
 * REUSE CHECK: draws nothing. It is a screenshot of an existing canvas.
 *   node tools/bohemia_house_scale_proof.js -> records/target/HERO_SPRITE.png */
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
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  p.on('pageerror', e => console.log('  PAGEERR', String(e).slice(0, 160)));
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_ALPHA_0_9.html'));
  await p.waitForTimeout(1200);
  await p.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { const t = [...document.querySelectorAll('.tab')]
    .find(x => x.getAttribute('data-p') === 'char'); if (t) t.click(); });
  await p.waitForTimeout(4000);

  const out = await p.evaluate(() => {
    const c = document.getElementById('charCv');
    if (!c) return null;
    const g = c.getContext('2d');
    const d = g.getImageData(0, 0, c.width, c.height).data;
    // tight bounding box of the body, so the height is the FIGURE and not the canvas
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        if (d[(y * c.width + x) * 4 + 3] > 8) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    if (x1 < 0) return null;
    return { url: c.toDataURL('image/png'), cw: c.width, ch: c.height,
             box: [x0, y0, x1 - x0 + 1, y1 - y0 + 1] };
  });
  await b.close();
  if (!out) { console.log('  NO SPRITE — the character canvas was empty'); process.exit(1); }
  fs.writeFileSync(path.join(REPO, 'records', 'target', 'HERO_SPRITE.png'),
                   Buffer.from(out.url.split(',')[1], 'base64'));
  fs.writeFileSync(path.join(REPO, 'records', 'target', 'HERO_SPRITE.json'),
                   JSON.stringify(out.box));
  console.log('  hero sprite %dx%d on a %dx%d canvas -> records/target/HERO_SPRITE.png',
              out.box[2], out.box[3], out.cw, out.ch);
})();
