/* ============================================================================
   REROLL GATE (8/15/26, PEOPLE lane — his bug, reported live)

   PAOLO, VERBATIM: "I pressed re-roll the seed button on the run tab and now I
   can't find the house I'm supposed to be at what's up with that."

   HE WAS RIGHT AND IT WAS TWO BUGS STACKED, both measured across one press:

   1. REROLL REPLACED THE WORLD AND LEFT EVERYTHING DERIVED FROM IT STANDING.
        seed   2691674296 -> 3182853632   (a new valley)
        cell   48,48      -> 52,48        (a new neighbourhood)
        hx,hy  6205,6271  -> 6205,6271    (HE NEVER MOVED)
        HOME   6219,6256  -> 6219,6256    (a house in a valley that is gone)
      Walk again and his own front door was 549 TILES AWAY, in a cell he was not
      standing in. HOME anchors on LANDED -- where you dropped in -- so a stale
      LANDED also drags the anchor back to the centre of the cell, which is the
      exact regression homeFind's own comment records from 8/11: "HOME 55 cells
      north of the drop-in ... indistinguishable from not having one."

   2. AND REROLL PUT HIM ON THE STRIP, WHICH HAS NO HOUSES. The handler carried
      a COPY of `city.x=L.stripX; city.y=Math.round(96*0.5)` -- which is, word
      for word, the line __WORKING_DISTRICT__'s own comment names as the 8/2 bug
      ("the literal middle of the valley, on the Strip, every run") and keeps
      only as a LAST-RESORT FALLBACK. Boot was fixed on 8/2. Reroll kept the
      dead version because the fix lived in an anonymous IIFE nothing could call.
      Measured after fixing bug 1 alone: district 'strip', homeFind scanned the
      cell, correctly found no house, and he had NO HOME AT ALL.

   THE FIX IS ONE RESOLVER. placeWorkingDistrict() is called at boot and at
   reroll, so the two can never disagree again. A COPIED LINE IS A FIX THAT ONLY
   HALF-SHIPPED.

   WHAT THIS GATE HOLDS, on the real surface, through the one link: press the
   button he pressed, and afterwards he must be somewhere he can live, with a
   house he can find.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  await page.goto('file://' + ALPHA);
  await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
  await page.reload();
  await page.waitForTimeout(3400);
  await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    const t = Array.from(document.querySelectorAll('.tab'))
      .find(e => (e.textContent || '').trim() === 'RUN');
    if (t) t.click();
  });
  await page.waitForTimeout(16000);

  let city = null;
  for (const f of page.frames()) {
    try { if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof placeWorkingDistrict === 'function')) { city = f; break; } }
    catch (_e) {}
  }
  ok('the world is loaded through the one link, and it has ONE placement resolver',
    !!city, 'placeWorkingDistrict must exist and be callable from both boot and reroll');
  if (!city) { await b.close(); console.log('REROLL GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); }

  const before = await city.evaluate(() => ({ seed: seed >>> 0, cell: [city.x, city.y] }));

  /* FIVE PRESSES, not one. A single reroll can land somewhere livable by luck;
     the claim is that it ALWAYS does, on whatever valley the seed produces. */
  const runs = [];
  for (let n = 0; n < 5; n++) {
    await city.evaluate(() => { document.getElementById('reroll').click(); });
    await page.waitForTimeout(2500);
    /* the state derived from the OLD world must be gone the instant it is
       replaced -- checked BEFORE walking, because that is when it went stale */
    const cleared = await city.evaluate(() => ({
      landed: LANDED, home: HOME, key: HOME_KEY, seed: seed >>> 0,
    }));
    await city.evaluate(() => { if (typeof swapMode === 'function') swapMode(); });
    let s = null;
    for (let i = 0; i < 6 && !(s && s.home); i++) {
      await city.evaluate(() => { try { renderHuman(); } catch (_e) { try { render(); } catch (_e2) {} } });
      await page.waitForTimeout(900);
      s = await city.evaluate(() => ({
        seed: seed >>> 0,
        district: (function () { try { return String((om.at(city.x, city.y) || {}).district); } catch (_e) { return '?'; } })(),
        home: HOME ? [HOME.x, HOME.y] : null,
        dist: HOME ? Math.abs(HOME.x - hx) + Math.abs(HOME.y - hy) : null,
        homeCell: HOME ? [(HOME.x / FN) | 0, (HOME.y / FN) | 0] : null,
        meCell: [(hx / FN) | 0, (hy / FN) | 0],
      }));
    }
    runs.push({ cleared, s });
  }

  ok('the seed really changes on every press (' + before.seed + ' -> ' +
    runs.map(r => r.s && r.s.seed).join(' -> ') + ')',
    new Set([before.seed].concat(runs.map(r => r.s && r.s.seed))).size === 6);

  const staleCarried = runs.filter(r => r.cleared.landed || r.cleared.home || r.cleared.key);
  ok('NOTHING FROM THE OLD VALLEY SURVIVES THE PRESS — LANDED, HOME and HOME_KEY are cleared',
    staleCarried.length === 0,
    staleCarried.length ? JSON.stringify(staleCarried[0].cleared) : '');

  const strip = runs.filter(r => !r.s || /strip|freeway|interchange|beltway/.test(r.s.district));
  ok('EVERY REROLL LANDS SOMEWHERE HE CAN LIVE, never the Strip (' +
    runs.map(r => r.s && r.s.district).join(', ') + ')',
    strip.length === 0, 'the Strip has no houses; that is the whole bug');

  const homeless = runs.filter(r => !r.s || !r.s.home);
  ok('AND HE HAS A HOUSE AFTERWARDS, every time',
    homeless.length === 0, homeless.length + ' of 5 rerolls left him with no home at all');

  const far = runs.filter(r => r.s && r.s.dist !== null && r.s.dist > 200);
  ok('and it is a house he can FIND — distances ' +
    runs.map(r => r.s && r.s.dist).join(', ') + ' tiles',
    far.length === 0, 'before the fix this measured 549 tiles, in a cell he was not in');

  const wrongCell = runs.filter(r => r.s && r.s.home &&
    (r.s.homeCell[0] !== r.s.meCell[0] || r.s.homeCell[1] !== r.s.meCell[1]));
  ok('and it is in the neighbourhood he is standing in, not a leftover from the last valley',
    wrongCell.length === 0);

  ok('five rerolls with no page error' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  await b.close();
  console.log('REROLL GATE: ' + pass + ' passed, ' + fail + ' failed  (5 presses, districts: ' +
    runs.map(r => r.s && r.s.district).join('/') + ')');
  process.exit(fail ? 1 : 0);
})();
