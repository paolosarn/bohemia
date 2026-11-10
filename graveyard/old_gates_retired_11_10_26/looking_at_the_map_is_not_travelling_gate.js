const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* ============================================================================
   LOOKING AT THE MAP IS NOT TRAVELLING (8/27/26, RUN lane)

     "how come in the run like it wants to keep spawning me like outside of like
      my starter Neighbourhood it's so confusing like I'll just throw me some
      randomly on the map it's it's really weird bro."

   REPRODUCED ON THE REAL SURFACE, with real touch:

       standing              tile 6205,6271   cell [48,48]   marker [48,48]
       pinch out to the map  tile 6205,6271   cell [48,48]   marker [48,48]
       three taps of the pad tile 6205,6271   cell [48,48]   marker [49,48]
       pinch back in         tile 6336,6208   cell [49,48]   194 TILES AWAY

   HE LOOKED AT THE MAP AND CAME BACK 194 TILES FROM WHERE HE WAS STANDING.

   TWO HALVES, AND THE FIRST ONE IS WHY HE CALLS IT RANDOM:
   1. THE PAD DOES NOT MEAN THE SAME THING AT BOTH ZOOMS. Zoomed out it is still
      in the same corner under the same thumb, and a press moves the MARKER a
      whole overmap cell and spends TEN MINUTES of his day. He never asked to go
      anywhere.
   2. AND COMING BACK NEVER RETURNED HIM TO HIS BODY: swapMode opens the
      city->human branch by throwing away where he was standing and centring him
      in the marker cell, then spiralling for a road. Correct for ARRIVING
      somewhere. Wrong for a glance.

   AND THE 8/26 ACTION BUTTON WORK MADE IT LOUD. Before that you had to press
   DROP IN on purpose to cross the seam; making zoom the primary way in and out
   -- his ruling, and right -- routed every glance through a landing built for
   arrival. A change can be correct and still hand a latent bug a huge audience.

   THE RULE, AND THE GAME ALREADY SAID IT SOMEWHERE ELSE: the phone's GO "moves
   the CITY MARKER to it ... IT NEVER MOVES HIS BODY." The marker is a camera.
   The zoom seam was the one place that disagreed.

   SO THE TWO GESTURES MEAN TWO THINGS NOW, and this gate holds both:
     A. PINCH = LOOK. He comes back to the exact tile he left, wherever the
        marker wandered while he was up there.
     B. THE CHIP = GO. Pressing DROP IN still puts him where the marker is,
        because that is deliberate and it is the travel the game has.
   Delete either half and the other becomes a bug: without A a glance teleports
   him, without B he can never cross the valley at all.

   node gates/looking_at_the_map_is_not_travelling_gate.js
   ========================================================================== */
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('\n=== LOOKING IS NOT TRAVELLING: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                         hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await SETTLE(page, 4000);
    await page.click('#front').catch(() => { });
    await SETTLE(page, 30000, async () => {
      const f = page.frames().find(x => x.name() === 'cityFrame');
      if (!f) return false;
      try { return await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1); }
      catch (e) { return false; }
    });
    const city = page.frames().find(x => x.name() === 'cityFrame');
    ok('the walked world is up', !!city);
    if (!city) { await browser.close(); done(); }
    await page.evaluate(() => { const n = document.getElementById('openNot'); if (n) n.click(); });
    await SETTLE(page, 1300);
    await city.evaluate(() => {
      const c = document.getElementById('daycard');
      if (c && getComputedStyle(c).display !== 'none') {
        const b = c.querySelector('.dcgo') || c.querySelector('.dcbtn'); if (b) b.click(); }
    });
    await SETTLE(page, 1600);

    const at = () => city.evaluate(() => ({ hx, hy, cell: [(hx / FN) | 0, (hy / FN) | 0],
      mode: MODE, marker: [city.x, city.y] }));

    /* REAL TOUCH. Hand-made PointerEvents make the city's setPointerCapture throw,
       and a probe that never touched the canvas then reports the zoom does nothing. */
    const cdp = await ctx.newCDPSession(page);
    const box = await (await city.$('#cv')).boundingBox();
    const px = box.x + box.width / 2, py = box.y + box.height / 2;
    const touch = (type, sep) => cdp.send('Input.dispatchTouchEvent', { type,
      touchPoints: sep === null ? [] : [{ x: px - sep / 2, y: py, id: 1 },
                                        { x: px + sep / 2, y: py, id: 2 }] });
    async function pinch(dir, steps) {
      let sep = dir > 0 ? 300 : 40;
      await touch('touchStart', sep);
      for (let i = 0; i < steps; i++) {
        sep = dir > 0 ? Math.max(16, sep * 0.84) : Math.min(340, sep * 1.19);
        await touch('touchMove', sep);
        await new Promise(r => setTimeout(r, 32));
      }
      await touch('touchEnd', null);
      await new Promise(r => setTimeout(r, 250));
    }

    /* ---- A. A LOOK IS A LOOK ------------------------------------------- */
    const start = await at();
    await pinch(1, 14); await SETTLE(page, 800);
    const up = await at();
    ok('pinching out really reaches the map (' + up.mode + ')', up.mode === 'city');

    /* HIS THUMB IS ALREADY THERE. The pad does not move or hide when he zooms out,
       so this is not a contrived input -- it is where his hand already is. */
    const pb = await city.$$('#pad .pb');
    for (let i = 0; i < 3; i++) { await pb[2].click({ timeout: 5000 }).catch(() => { }); await SETTLE(page, 700); }
    const drifted = await at();
    ok('a tap on the pad while he is up there really does move the marker ('
      + JSON.stringify(start.marker) + ' -> ' + JSON.stringify(drifted.marker)
      + ') -- which is the half he never asked for',
      drifted.marker[0] !== start.marker[0] || drifted.marker[1] !== start.marker[1]);

    await pinch(-1, 14); await SETTLE(page, 900);
    await pinch(-1, 14); await SETTLE(page, 900);
    const back = await at();
    const moved = Math.abs(back.hx - start.hx) + Math.abs(back.hy - start.hy);
    ok('he is back on his feet in the walked world (' + back.mode + ')', back.mode === 'human');
    ok('*** LOOKING AT THE MAP MOVED HIM ' + moved + ' TILES *** -- it was 194, and '
      + 'his words were "it\'ll just throw me somewhere randomly on the map"',
      moved === 0);
    ok('and it is the same tile, not merely the same neighbourhood ('
      + JSON.stringify(back.cell) + ')',
      back.hx === start.hx && back.hy === start.hy);

    /* ---- B. AND THE DELIBERATE GO STILL TRAVELS ------------------------- */
    /* WITHOUT THIS HALF THE FIX IS A CAGE. If coming back always returned him to
       his feet no matter what, the marker would be scenery and he could never
       cross the valley -- NO DISTRICT IS A PRISON. The chip is the deliberate one. */
    const chip = await city.evaluate(() => {
      const b = document.getElementById('modechip');
      if (!b) return { missing: true };
      const r = b.getBoundingClientRect();
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { text: b.textContent, box: [Math.round(r.width), Math.round(r.height)],
               reachable: !!(t && (t === b || b.contains(t))) };
    });
    /* *** THE FIRST VERSION OF THIS CLAIM ONLY READ THE CHIP'S TEXT, AND PASSED
       WHILE THE CHIP WAS UNREACHABLE. *** I created it at a hardcoded corner
       offset underneath #blstack, the column that owns that corner at z-index 39
       -- the exact bug that column exists to prevent, made one day after I fixed
       it. A real click timed out. A control is not offered because it exists; it
       is offered because a thumb can press it. */
    ok('the camera toggle is REACHABLE, not merely present ("' + chip.text + '", '
      + JSON.stringify(chip.box) + ')', !chip.missing && chip.reachable === true);

    const b0 = await at();
    await city.click('#modechip', { timeout: 8000 }).catch(() => { });
    await SETTLE(page, 1600);
    for (let i = 0; i < 4; i++) { await pb[2].click({ timeout: 5000 }).catch(() => { }); await SETTLE(page, 700); }
    const marked = await at();
    await city.click('#modechip', { timeout: 8000 }).catch(() => { });
    await SETTLE(page, 1800);
    const landed = await at();
    ok('the chip took him out to the map and back', landed.mode === 'human');
    ok('*** AND A DELIBERATE DROP IN STILL TRAVELS *** (' + JSON.stringify(b0.cell)
      + ' -> ' + JSON.stringify(landed.cell) + ') -- without this half the marker '
      + 'is scenery and he can never cross the valley',
      landed.cell[0] !== b0.cell[0] || landed.cell[1] !== b0.cell[1]);
    ok('and he lands where the marker actually is',
      landed.cell[0] === marked.marker[0] && landed.cell[1] === marked.marker[1]);

    ok('and nothing threw ('
      + (errs.length ? errs.slice(0, 2).join(' | ') : 'none') + ')', errs.length === 0);
    console.log('  MEASURED: a look moved him ' + moved + ' tiles (was 194) · a '
      + 'deliberate drop in travelled ' + (landed.cell[0] - b0.cell[0]) + ','
      + (landed.cell[1] - b0.cell[1]) + ' cells');
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 160) + ']', false);
  }
  await browser.close();
  done();
})();
