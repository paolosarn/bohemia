/* SMOOTH BUT DEFINITE — the measurement behind Paolo's 8/11 ruling.
 * Opens the vista on the REAL page and prints the overview's edge energy and its
 * composite filter. Kept as its own file so vista_gate.js stays synchronous and
 * readable; the gate shells out and asserts on the two numbers. */
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'),
    { waitUntil: 'load', timeout: 240000 });
  await p.waitForTimeout(8000);
  const r = await p.evaluate(() => {
    if (!window.__VISTA || !window.__VISTA.open()) return null;
    const c = document.getElementById('cv'), x = c.getContext('2d');
    const w = c.width, h = c.height, d = x.getImageData(0, 0, w, h).data;
    const L = i => 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    let sum = 0, n = 0;
    for (let y = Math.floor(h * 0.30); y < h - 1; y += 2) for (let x2 = 1; x2 < w - 1; x2 += 2) {
      const i = (y * w + x2) * 4;
      sum += Math.abs(4 * L(i) - L(i - 4) - L(i + 4) - L(i - w * 4) - L(i + w * 4)); n++;
    }
    return { edge: sum / n, filter: getComputedStyle(c).imageRendering };
  });
  await b.close();
  if (!r) { console.log('EDGE=0 FILTER=none'); process.exit(1); }
  console.log('EDGE=' + r.edge.toFixed(2) + ' FILTER=' + r.filter);
})();
