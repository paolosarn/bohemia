/* BOHEMIA THE HEAD MUST FOLLOW THE RIG (8/11/26, CHARACTER lane)
 *
 * Paolo 8/11, on a screenshot with the chin circled: "this is not how the rig has
 * my head and my neck line. Why does it look so fucked up... there needs to be
 * more head underneath the mouth following how the rig has it."
 *
 * HE IS RIGHT AND IT IS MEASURABLE. Skin width per row, S facing, hair removed --
 * his painted FACE (BAKED part 2) against the skin the game actually paints:
 *
 *      row     y6  y7  y8  y9  y10 y11 y12 y13 y14 y15
 *      RIG      6   8   8   8   10  10   8   8   6   4      <- an EGG
 *      GAME     7   9  10  10   10  10  10  10   9   5      <- a BARREL
 *                       +2  +2            +2  +2  +3  +1
 *
 * The rig narrows above the cheekbones and again below them into a jaw that comes
 * to a 4px chin. The game draws SIX STRAIGHT ROWS at full width and then falls off
 * a cliff. The worst row is y14 -- the jaw, three pixels too wide -- and y14 is
 * exactly the flat shelf under the mouth he circled.
 *
 * WHY THIS IS A RATCHET AND NOT A PASS/FAIL. The cause is in the SKINNER, the
 * shared engine every body on screen goes through, and RIG LAW makes that the most
 * dangerous code in the repo to guess at. So this gate does what MAP BOUND does
 * with typed map bounds: it PINS the deviation that exists today and lets it only
 * SHRINK. Nobody can make the head follow the rig less well than it does right
 * now, the debt is visible in the suite instead of living in someone's memory, and
 * the day the skinner is fixed this is the check that proves it -- lower the
 * numbers below and it stays green.
 *
 * WHAT IS DELIBERATELY NOT ASSERTED: exact equality. The renderer is entitled to
 * differ from a flat stamp; that is what a skinner is for. What it is not entitled
 * to do is flatten a jaw into a box.
 *
 *   node gates/head_follows_rig_gate.js
 */
'use strict';
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

/* MEASURED 8/11/26. These may only go DOWN. */
const PINNED_TOTAL = 13;   // sum of |game - rig| across the face rows (ratchet: only ever shrinks)
const PINNED_WORST = 3;    // the worst single row (y14, the jaw)

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await page.waitForTimeout(2500);
  await page.click('#front').catch(() => {});
  await page.waitForTimeout(1500);
  await page.click('.tab[data-p="char"]');
  await page.waitForTimeout(4000);

  const R = await page.evaluate(() => {
    if (typeof BAKED === 'undefined' || !BAKED.layers || !BAKED.layers.S) return { err: 'no BAKED.layers.S' };
    /* the rig's painted FACE, per row */
    const rig = {};
    for (const i of (BAKED.layers.S['2'] || [])) {
      const x = i % BAKED.W, y = (i / BAKED.W) | 0;
      const a = rig[y] || (rig[y] = { a: 99, b: -1 });
      if (x < a.a) a.a = x; if (x > a.b) a.b = x;
    }
    /* the skin the game paints, hair removed so the body's own shape is visible */
    const stash = {};
    for (const k in PD.layers) if (k.indexOf('hair/') === 0) { stash[k] = PD.layers[k]; delete PD.layers[k]; }
    const PL = 112, cv = document.createElement('canvas'); cv.width = cv.height = PL;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    drawChar(cv, 'S', 'idle', 0);
    const D = cv.getContext('2d').getImageData(0, 0, PL, PL).data;
    for (const k in stash) PD.layers[k] = stash[k];
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}

    const SK = (typeof skinTone !== 'undefined' && skinTone[1]) ? skinTone[1] : [];
    /* see chin_law_gate: rig space -> render space is DERIVED, never assumed. A
       hard `* 2` reads at 224 on a 112 rig and returns null for every pixel, which
       reads as "the head has no edge" when the head is fine. */
    const _SC = PL / (BAKED.W || 56);
    const at = (x, y) => { const i = ((y * _SC) * PL + (x * _SC)) * 4; return D[i + 3] < 40 ? null : [D[i], D[i + 1], D[i + 2]]; };
    const isSkin = c => c && SK.some(r => Math.abs(c[0] - r[0]) + Math.abs(c[1] - r[1]) + Math.abs(c[2] - r[2]) < 40);
    const rows = [];
    let total = 0, worst = 0, worstY = -1;
    for (const ys of Object.keys(rig).map(Number).sort((a, b) => a - b)) {
      /* *** SCAN THE WHOLE CHARACTER. *** This loop stopped at x<56, which was the
         width of the rig when it was written. At a 112 rig the head sits around
         x=40..75, so the ruler walked off its own measurement halfway across his
         face and reported the skin as HALF as wide as the rig paints it -- 20 vs
         10, every row, which reads exactly like a catastrophic regression and is
         nothing but a tape measure that stops at 56. */
      let a = 99, b = -1;
      for (let x = 0; x < BAKED.W; x++) if (isSkin(at(x, ys))) { if (x < a) a = x; if (x > b) b = x; }
      if (b < 0) continue;
      const rw = rig[ys].b - rig[ys].a + 1, gw = b - a + 1, dv = Math.abs(gw - rw);
      rows.push({ y: ys, rig: rw, game: gw, d: dv });
      total += dv;
      if (dv > worst) { worst = dv; worstY = ys; }
    }
    /* THE EDGE ITSELF, because the width ruler above is BLIND TO IT. The fix was
       a TONE, not a geometry change: the head/face now takes the darker anatomy
       shade on its silhouette edge like every other body part, so his painted jaw
       finally draws. Both tones are skin, so a "how wide is the skin" ruler reads
       exactly the same before and after -- it did, and I nearly shipped believing
       nothing had happened. ASK FOR THE THING THAT CHANGED.
       Measured: on the rows his art puts the dark anatomy index on, is the EDGE
       pixel darker than the pixel beside it? */
    /* SKIN ONLY, and the first version of this was worthless because of it. It
       took the outermost NON-TRANSPARENT pixel, which is the sprite's own black
       outline -- obviously darker than anything -- so it passed with the fix
       ripped back out. Mutation-tested, caught, fixed. The question is whether the
       outermost SKIN pixel is darker than the SKIN pixel inside it. */
    let edged = 0, checked = 0;
    const lum = c => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
    for (const ys of Object.keys(rig).map(Number).sort((a, b) => a - b)) {
      const xs = [];
      for (let x = 0; x < BAKED.W; x++) if (isSkin(at(x, ys))) xs.push(x);   /* whole character, see above */
      if (xs.length < 4) continue;
      /* neighbour = one RIG pixel away; at 112 that is RIG_RS cells. Comparing
         adjacent CELLS compares two halves of the same painted pixel -- see the
         long note in chin_law_gate. */
      const _st = (typeof RIG_RS !== 'undefined') ? RIG_RS : 1;
      const a = xs[0], b = xs[xs.length - 1];
      for (const [e, inn] of [[a, a + _st], [b, b - _st]]) {
        const ce = at(e, ys), ci = at(inn, ys);
        if (!isSkin(ce) || !isSkin(ci)) continue;
        checked++;
        if (lum(ce) < lum(ci) - 4) edged++;
      }
    }
    return { rows: rows, total: total, worst: worst, worstY: worstY,
             rigRows: Object.keys(rig).length, edged: edged, checked: checked };
  });

  if (R.err) { console.log('  FAIL: ' + R.err); console.log('HEAD FOLLOWS RIG GATE: 0 passed, 1 failed'); await browser.close(); process.exit(1); }

  console.log('  row  rig  game');
  for (const r of R.rows) console.log('   y' + String(r.y).padStart(2) + String(r.rig).padStart(5) +
    String(r.game).padStart(6) + (r.d ? '   off by ' + r.d : ''));

  ok('his painted face is readable off the rig (' + R.rigRows + ' rows)', R.rigRows >= 8);
  ok('the head was measured against the rig at all (' + R.rows.length + ' comparable rows)', R.rows.length >= 8);
  ok('THE JAW DEBT ONLY SHRINKS: total deviation ' + R.total + ' (pinned at ' + PINNED_TOTAL +
     ') — nobody may make the head follow his rig LESS well than it does today',
     R.total <= PINNED_TOTAL);
  ok('THE WORST ROW ONLY SHRINKS: ' + R.worst + 'px at y' + R.worstY + ' (pinned at ' + PINNED_WORST +
     ') — this is the flat shelf under the mouth he circled', R.worst <= PINNED_WORST);
  if (R.total < PINNED_TOTAL || R.worst < PINNED_WORST)
    console.log('  *** THE HEAD FOLLOWS THE RIG BETTER THAN THE PIN. Lower PINNED_TOTAL to ' +
      R.total + ' and PINNED_WORST to ' + R.worst + ' in this file so it can never slide back. ***');

  /* THE JAW LINE EXISTS AT ALL. Before 8/11 the head was the ONE body part
     excluded from the border test (`if (g !== 0)`, and GROUP puts head and face in
     group 0), so every head pixel came out one flat tone and his painted jaw had
     nowhere to render -- measured, the columns he painted the dark anatomy index
     on came out 191,175,166, the same colour as the cheek beside them. */
  ok('THE HEAD HAS A JAW LINE: ' + R.edged + ' of ' + R.checked + ' head edge pixels read ' +
     'darker than the face beside them — the head used to be the ONE body part with no ' +
     'silhouette edge at all, which is why his painted jaw rendered as cheek',
     R.checked >= 10 && R.edged >= Math.round(R.checked * 0.6));

  console.log('HEAD FOLLOWS RIG GATE: ' + pass + ' passed, ' + fail + ' failed');
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
