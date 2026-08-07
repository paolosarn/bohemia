/* BOHEMIA PIXEL SNAP LOOK (8/6/26, CHARACTER lane) -- render the character
 * surfaces after the snap and LOOK at them, plus prove nothing overflowed.
 *
 * VERIFY ON THE REAL SURFACE (7/18) says a number is not a look. The snap moved
 * five element sizes UP -- #charCv to 338 declared, .g8c from ~86 to 114, .cloBig
 * to 170 -- and every one of those sits inside a flex or wrap container on a
 * 390px phone. An integer scale that overflows its row, clips a facing off the
 * gallery, or squeezes the wardrobe strip to nothing is not a fix, it just moves
 * the damage somewhere the scale audit cannot see.
 *
 * So this does the two things the audit cannot:
 *   1. measures horizontal overflow of the document and of every container the
 *      snap touched (scrollWidth vs clientWidth -- a row that overflows makes the
 *      whole page pan sideways on a phone, which is its own bug)
 *   2. writes PNGs of the surfaces so the pixels can actually be looked at
 *
 * Reuses the tab navigation the scale audit already established (#front to
 * dismiss the splash, .tab[data-p=...] to switch) rather than inventing another.
 *
 *   node tools/bohemia_pixel_snap_look.js [outdir]
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = process.argv[2] || path.join(REPO, 'records', 'pixelsnap');
fs.mkdirSync(OUT, { recursive: true });

/* Every container the snap can push wider, plus the page itself. */
const BOXES = [
  ['document', 'body'],
  ['char panel', '#p-char'],
  ['anim panel', '#p-anim'],
  ['ALL-8 gallery', '#grid8'],
  ['clothes panel', '#p-clothes'],
];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);

  let bad = 0;
  const shot = async (tab, name, prep) => {
    await page.click('.tab[data-p="' + tab + '"]').catch(() => {});
    await page.waitForTimeout(1200);
    if (prep) { await prep(); await page.waitForTimeout(1600); }
    const f = path.join(OUT, name + '.png');
    await page.screenshot({ path: f });
    const over = await page.evaluate(sel => sel.map(([label, q]) => {
      const el = document.querySelector(q);
      if (!el || el.offsetParent === null && q !== 'body') return null;
      return { label, sw: el.scrollWidth, cw: el.clientWidth };
    }).filter(Boolean), BOXES);
    for (const o of over) {
      const spill = o.sw - o.cw;
      /* 1px is subpixel rounding, not a layout break. */
      const isBad = spill > 1;
      if (isBad) bad++;
      console.log('   ' + (isBad ? 'OVERFLOW ' : '      ok ') + (tab + ' / ' + o.label).padEnd(30) +
        'content ' + o.sw + ' in ' + o.cw + (spill > 0 ? '  (+' + spill + ')' : ''));
    }
    console.log('   wrote ' + path.relative(REPO, f));
  };

  console.log('PIXEL SNAP LOOK — iPhone portrait 390x844, DPR 3');
  await shot('char', 'char_tab');
  /* DO NOT CLICK #grid8Btn. The ALL-8 gallery is already open on load, so
     clicking it CLOSES it -- my first run of this probe screenshotted the one
     surface it exists to check with the gallery toggled off, and the empty shot
     looked like a perfectly normal anim tab. Assert the state, never toggle it. */
  await shot('anim', 'anim_all8', async () => {
    const open = await page.evaluate(() => {
      const g = document.getElementById('grid8');
      if (!g) return false;
      if (getComputedStyle(g).display === 'none') document.getElementById('grid8Btn').click();
      g.scrollIntoView({ block: 'center' });
      return getComputedStyle(g).display !== 'none';
    });
    if (!open) { console.log('   FAIL: the ALL-8 gallery would not open'); bad++; }
  });
  await shot('clothes', 'clothes_tab');

  console.log('PIXEL SNAP LOOK: ' + (bad ? bad + ' container(s) OVERFLOW' : 'no container overflows'));
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
