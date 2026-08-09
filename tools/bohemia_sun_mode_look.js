/* BOHEMIA SUN MODE LOOK (8/7/26, CHARACTER lane) — prove the light option is
 * actually light, on the surface Paolo taps.
 *
 * He asked for this because he is OUTSIDE and cannot see hairstyles on a dark
 * background. So the thing to verify is not "a class got added" — it is that the
 * pixels immediately around a hairstyle actually became bright, and that the
 * choice survives coming back to the tab.
 *
 * WHAT IT MEASURES, on a real iPhone-portrait DPR-3 browser:
 *   1. the panel and every hair-bearing canvas report a LIGHT computed background
 *      in sun mode and a DARK one out of it (luminance, not a string compare —
 *      an `!important` that silently loses would still read as "a colour")
 *   2. the toggle PERSISTS across a reload, which is the whole reason it is
 *      stored rather than per-visit
 *   3. screenshots of both states, because a luminance number is not a look
 *
 * THE CANVAS CHECK IS THE POINT. Those backgrounds are set INLINE by the JS that
 * builds them, and an inline style beats a stylesheet rule — so the failure mode
 * this is built to catch is a light panel with every hairstyle still sitting on
 * its own black square, which would look fixed in a diff and be useless to him.
 *
 *   node tools/bohemia_sun_mode_look.js [outdir]
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
/* SHOTS GO TO A TEMP DIR BY DEFAULT, NEVER INTO THE REPO. gates/bottomleft_gate.py
   screenshots straight into records/target/BOTTOMLEFT.png -- tracked AND published --
   so every suite run rewrites a 500 KB binary nobody authored and `git add -A` sweeps
   it up (three commits already). That was diagnosed the same day this was written and
   it would have been absurd to repeat it here. Pass an explicit outdir when you want
   the pictures kept. */
const OUT = process.argv[2] || path.join(require('os').tmpdir(), 'bohemia_sunmode');
fs.mkdirSync(OUT, { recursive: true });

/* relative luminance of a computed `rgb(...)`; anything the eye calls "light"
   sits well above 0.5 and the dark panel sits under 0.1 */
const READ = sels => sels.map(([label, q]) => {
  const el = document.querySelector(q);
  if (!el) return { label, missing: true };
  const c = getComputedStyle(el).backgroundColor || '';
  const m = c.match(/(\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return { label, colour: c, lum: null };
  const [r, g, b] = [+m[1], +m[2], +m[3]].map(v => v / 255);
  return { label, colour: c, lum: +(0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(3) };
});

const TARGETS = [
  ['char panel', '#p-char'],
  ['char preview', '#charCv'],
  ['face portrait', '#portraitCv'],
  ['hair picker tile', '.hairTile'],
  ['hair spin shot', '.hairSpinShot'],
];
const ANIM_TARGETS = [
  ['anim panel', '#p-anim'],
  ['ALL-8 tile', '.g8c'],
];

let bad = 0;
const check = (rows, wantLight) => {
  for (const r of rows) {
    if (r.missing) { console.log('   ABSENT   ' + r.label + ' (not on this surface)'); continue; }
    /* transparent reports rgba(0,0,0,0) and is a REAL failure here: it means the
       element inherits whatever is behind it rather than the colour we set */
    const transparent = /rgba\(0,\s*0,\s*0,\s*0\)/.test(r.colour);
    const isLight = r.lum !== null && r.lum > 0.5 && !transparent;
    const okRow = wantLight ? isLight : !isLight;
    if (!okRow) bad++;
    console.log('   ' + (okRow ? '   ok ' : ' WRONG') + ' ' + r.label.padEnd(18) +
      String(r.colour).padEnd(22) + 'lum ' + (r.lum === null ? '?' : r.lum));
  }
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  console.log('SUN MODE LOOK — iPhone portrait 390x844, DPR 3');

  console.log('  DARK (default):');
  check(await page.evaluate(READ, TARGETS), false);
  await page.screenshot({ path: path.join(OUT, 'char_dark.png') });

  const found = await page.evaluate(() => {
    const b = document.querySelector('#p-char .sunBtn');
    if (!b) return false;
    b.click();
    return true;
  });
  if (!found) { console.log('   FAIL: no SUN button on the character panel'); bad++; }
  await page.waitForTimeout(1200);

  console.log('  SUN ON:');
  check(await page.evaluate(READ, TARGETS), true);
  await page.screenshot({ path: path.join(OUT, 'char_sun.png') });

  await page.click('.tab[data-p="anim"]');
  await page.waitForTimeout(3000);
  console.log('  SUN ON, animation tab (the ALL-8 hair gallery):');
  check(await page.evaluate(READ, ANIM_TARGETS), true);
  await page.screenshot({ path: path.join(OUT, 'anim_sun.png') });

  /* PERSISTENCE. The entire reason this is stored instead of per-visit: he is
     outside, and a setting he must re-tap every visit is barely a setting. */
  await page.reload({ waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(3500);
  console.log('  AFTER A RELOAD (must still be light):');
  check(await page.evaluate(READ, TARGETS), true);

  console.log('SUN MODE LOOK: ' + (bad ? bad + ' WRONG' : 'every surface flipped, and it survived a reload'));
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
