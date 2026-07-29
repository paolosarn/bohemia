/* PROOF THE PALETTE JUDGE ACTUALLY WORKS ON THE REAL SURFACE (7/29/26).
 *
 * Paolo asked "WHERE DO I SEE?" and the honest answer was nowhere — I had sent him
 * a picture in chat instead of putting it under his thumb. The fix is a judge page
 * in the LIFE tab, and VERIFY-ON-THE-REAL-SURFACE says a page that exists is not a
 * page that works. So this opens it at iPhone portrait width, waits for the tile
 * banks to actually paint, taps a vote, and saves what the screen shows.
 *
 * REUSE CHECK: draws nothing. It is a screenshot plus four assertions.
 *   node tools/bohemia_palette_judge_shot.js -> records/target/PALETTE_JUDGE.png */
const path = require('path'), fs = require('fs');
function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
const REPO = path.dirname(__dirname);
let bad = 0;
const check = (n, c, d) => { if (!c) { bad++; console.log('  FAIL', n, d || ''); } };

(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 2 });
  p.on('pageerror', e => { bad++; console.log('  PAGEERR', String(e).slice(0, 200)); });

  // THROUGH THE LIFE TAB, not straight to the page. The whole complaint was that he
  // could not FIND it, so the thing under test is the route, not the file.
  await p.goto('file://' + path.join(REPO, 'slices', 'BOHEMIA_LIFE_CURRENT.html'));
  const link = p.locator('a[href="BOHEMIA_PALETTE_JUDGE_7_29_26.html"]');
  check('life_tab_links_to_it', await link.count() === 1);
  await link.first().click();
  await p.waitForLoadState('load');

  // the canvases must carry REAL PIXELS, not just exist. A blank canvas is exactly
  // the "technically shipped" failure the name-the-tab gate was written about.
  await p.waitForFunction(() => {
    const c = document.getElementById('b2');
    if (!c || !c.width) return false;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    for (let i = 3; i < d.length; i += 4) if (d[i] > 8) return true;
    return false;
  }, null, { timeout: 20000, polling: 200 });

  for (const id of ['a1', 'a2', 'b1', 'b2']) {
    const painted = await p.evaluate(i => {
      const c = document.getElementById(i);
      if (!c || !c.width) return 0;
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let n = 0;
      for (let k = 3; k < d.length; k += 4) if (d[k] > 8) n++;
      return n;
    }, id);
    check('canvas_has_pixels:' + id, painted > 2000, painted + ' opaque pixels');
  }

  // the greyscale panel must actually be grey, or the test he is being asked to
  // judge is not the test I told him it was
  const isGrey = await p.evaluate(() => {
    const c = document.getElementById('b2');
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] > 8 && (d[i] !== d[i + 1] || d[i + 1] !== d[i + 2])) return false;
    }
    return true;
  });
  check('greyscale_panel_is_actually_grey', isGrey);

  await p.locator('.vote button[data-v="B"]').click();
  check('vote_registers', await p.evaluate(() =>
    document.querySelectorAll('.vote button.on').length === 1));

  // and it must not spill off a phone screen
  const over = await p.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('fits_390px_portrait', over <= 1, over + 'px of horizontal overflow');

  fs.writeFileSync(path.join(REPO, 'records', 'target', 'PALETTE_JUDGE.png'),
                   await p.screenshot({ fullPage: true }));
  await b.close();
  console.log(bad ? '  PALETTE JUDGE SHOT: ' + bad + ' FAILED'
                  : '  PALETTE JUDGE SHOT: all checks passed -> records/target/PALETTE_JUDGE.png');
  process.exit(bad ? 1 : 0);
})();
