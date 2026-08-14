/* BOHEMIA THE CLOTHES HE PUTS ON SURVIVE A RELOAD (8/11/26, CHARACTER lane)
 *
 * There are TWO WARDROBES on this character and only one of them was ever saved:
 *
 *   G.equipped   the PD layer slots (body/facial/shirt/pants/shoes/hair/...)
 *                -- in PERSIST.snapshot() since forever
 *   G_WORN       the CLO garment catalogue, 258 items / 236 st:'canon', everything
 *                the clothes tab and SHUFFLE FIT put on him -- IN NO SAVE AT ALL
 *
 * Measured boot to boot before the fix: SHUFFLE FIT works, survives a tab
 * round-trip, and comes back {} after a refresh. You dress the character, come
 * back, and he is in the default PD layers again.
 *
 * frameLookHash has carried G_WORN since 7/31 ("putting on a red shirt changed the
 * frame"), so the RENDERER has known about this wardrobe for weeks. Only the SAVE
 * did not. That asymmetry is what this gate exists to keep closed.
 *
 * IT DRIVES THE REAL BUTTON AND DOES A REAL RELOAD. Asserting that the string
 * `worn:` appears in snapshot() would pass on a save that never round-trips; the
 * only honest test of persistence is to put clothes on, reload the page, and look.
 *
 *   node gates/worn_persist_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  /* ONE CONTEXT for the whole run, so localStorage really does carry across the
     reload the way it does on his phone. A fresh context per load would wipe the
     save and this gate would pass by never testing anything. */
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  const boot = async () => {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(2500);
    await page.click('#front').catch(() => {});
    await page.waitForTimeout(1500);
    await page.click('.tab[data-p="char"]');
    await page.waitForTimeout(6000);
  };
  const worn = () => page.evaluate(() => JSON.stringify(window.G_WORN || {}));

  await boot();
  const catalogue = await page.evaluate(() => {
    const g = window.GARMENTS || [];
    return { total: g.length, canon: g.filter(x => x.st === 'canon').length,
             hasBtn: !![...document.querySelectorAll('button')].find(b => /SHUFFLE FIT/i.test(b.textContent || '')) };
  });
  ok('the CLO catalogue reaches the page (' + catalogue.total + ' garments, ' +
     catalogue.canon + ' canon)', catalogue.total > 50 && catalogue.canon > 50);
  ok('the SHUFFLE FIT button is on the character screen', catalogue.hasBtn);

  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button')].find(x => /SHUFFLE FIT/i.test(x.textContent || ''));
    if (b) b.click();
  });
  await page.waitForTimeout(2500);
  const fit = await worn();
  const nSlots = Object.keys(JSON.parse(fit)).length;
  ok('SHUFFLE FIT actually dresses him (' + nSlots + ' slots filled) — not a dead button', nSlots >= 2);

  await page.click('.tab[data-p="clothes"]'); await page.waitForTimeout(2500);
  await page.click('.tab[data-p="char"]');    await page.waitForTimeout(2500);
  ok('the fit survives a TAB ROUND-TRIP', (await worn()) === fit);

  await boot();
  const after = await worn();
  ok('THE FIT SURVIVES A RELOAD — the CLO wardrobe was in NO save at all, so every ' +
     'garment he put on from the 236-item canon catalogue died on refresh and he came ' +
     'back in the default PD layers\n         saved: ' + fit + '\n        reload: ' + after,
     after === fit);

  /* NO MERGE-VS-REPLACE ASSERTION HERE, AND THAT IS A FINDING, NOT AN OMISSION.
     restore() uses Object.assign({}, d.worn) -- it REPLACES -- because a fit is a
     whole outfit and a leftover garment must not hang in a slot the saved fit left
     empty. But I mutation-tested the merging version and THE GATE STILL PASSED: on
     a page load G_WORN is empty before restore runs, so merging into {} and
     replacing {} are the same operation. The distinction is real defensive code and
     is worth keeping, but it is NOT observable through the real surface, so
     asserting on it would be a check that can never fail.
     My first version of this block did exactly that -- it ended in `return true`
     and asserted `merged === true`. Removed rather than dressed up. A gate that
     cannot fail is worse than a missing gate, because it reads as coverage. */
  console.log('WORN PERSIST GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
