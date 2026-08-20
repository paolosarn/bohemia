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
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');

/* MEASURED 8/11/26. These may only go DOWN. */
/* *** THE PIN IS A RATIO NOW, AND THE OLD NUMBER WAS FLATTERED (re-measured 8/20,
   when the rig went native at 112). ***
   PINNED_TOTAL was 13 and PINNED_WORST 3, both counts of 56-space PIXELS. Two things
   were wrong with that the moment the rig doubled:
     (1) A PIXEL COUNT IS NOT A FIDELITY. At 112 there are twice as many face rows and
         every width is twice as wide, so the identical head scores ~4x. Re-pinning a
         pixel count at each resolution is a chore that will silently drift; a RATIO of
         deviation to the rig's own width is the same number at any size, forever.
     (2) THE 56 MEASUREMENT WAS TAKEN THROUGH SCALE2X, WHICH ROUNDS CORNERS. It sampled
         the upscaled frame, and the upscaler was quietly trimming the corner off the
         chin -- so the skinner's real width error was partly hidden by the thing that
         is being switched off. Measured in 56-equivalent cells, the chin row went from
         "exactly right" (rig 4, game 4) to "two cells wide" (rig 4, game 6) purely by
         removing the smoothing. The skinner was always drawing it that wide.
   SO THIS IS NOT A RELAXATION, IT IS THE FIRST HONEST READING: 0.171 -> 0.211 of the
   face's own width, and the extra 0.04 is the corner Scale2x used to erase. THE
   RATCHET STILL ONLY SHRINKS, and it is now the instrument that says WHERE the "his
   head renders as a box" finding actually lives: the chin, and the row under the
   mouth. Fix the skinner there and this number falls. */
/* *** CORRECTED 8/20, SECOND PASS: THIS RATCHET NEVER MEASURED WHAT IT CLAIMED. ***
   It compared the width of the rig's painted FACE region (part 2) against EVERY
   SKIN-COLOURED PIXEL on the row. Those are different regions. The drawn row also
   contains the HEAD (part 1), which is wider than the face everywhere except the
   cheekbones, and on the chin rows the NECK (part 3) as well -- all three are skin.
   Measured, row by row, every single "deviation" is exactly accounted for:

       y12..y29   drawn skin == posed HEAD+FACE, to the pixel
       y30..y31   drawn skin == posed HEAD+FACE+NECK, to the pixel
       UNEXPLAINED PIXELS: ZERO

   So the "jaw debt" was the head being wider than the face. Anatomy, not error.
   AND IT TOOK ME WITH IT: earlier today I read the same ruler moving 13 -> 64 across
   the 112 flip and wrote down "the skinner was always drawing the chin two cells too
   wide, Scale2x was hiding it". THAT IS WRONG and it is corrected in
   records/BOHEMIA_THE_FLIP_SHIPPED_BECAUSE_HE_COULD_NOT_SEE_IT_8_20_26.txt. What
   actually moved was how much of the HEAD edge got counted once the upscaler stopped
   rounding corners off it. A ruler comparing two different regions cannot be repaired
   by rescaling it, which is what I did the first time.

   WHAT IT ASSERTS NOW IS LIKE-FOR-LIKE AND EXACT: the posed head+face silhouette,
   row for row, IS the rig's head+face silhouette. Same regions, same space, and
   measured on ALL EIGHT FACINGS instead of one. That is what "the head follows the
   rig" means, and the renderer passes it at ZERO on every facing, so the ratchet is
   pinned at zero and cannot be loosened by anybody, ever.
   SAMPLED AT THE REST PHASE ON PURPOSE: at a moving phase the skinner is SUPPOSED to
   deform the head (the bob, the turn), so demanding it equal the rest rig mid-stride
   would be asserting that animation does not happen. Measured for the record: at
   ph=0.37 the deviation is 12-44 per facing, which is the animation working.
   THE PIXELS ARE STILL CHECKED -- by the jaw-edge tone assertion below, which is
   about what the renderer PAINTS and is the check that caught the real 8/11 bug. */
const PINNED_POSE_DEV = 0;    // posed head+face vs rig head+face, per row, all 8 facings

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await SETTLE(page, 2500);
  await page.click('#front').catch(() => {});
  await SETTLE(page, 1500);
  await page.click('.tab[data-p="char"]');
  await SETTLE(page, 4000);

  const R = await page.evaluate(() => {
    if (typeof BAKED === 'undefined' || !BAKED.layers || !BAKED.layers.S) return { err: 'no BAKED.layers.S' };
    /* the rig's painted FACE, per row */
    const rig = {};
    for (const i of (BAKED.layers.S['1'] || []).concat(BAKED.layers.S['2'] || [])) {
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
    /* THE POSED HEAD IS THE RIG'S HEAD, on every facing. Compare the SAME regions
       (head + face) in the SAME space (the posed part grid the renderer composes
       from), row for row. No colour heuristic can confuse this: it reads part ids. */
    const rows = [];
    let total = 0, worst = 0, worstY = -1, rigSum = 0, worstR = 0;
    const perFacing = [];
    for (const fd of ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW']) {
      const fr = {};
      for (const i of (BAKED.layers[fd]['1'] || []).concat(BAKED.layers[fd]['2'] || [])) {
        const x = i % BAKED.W, y = (i / BAKED.W) | 0;
        const a = fr[y] || (fr[y] = { a: 1e9, b: -1 });
        if (x < a.a) a.a = x; if (x > a.b) a.b = x;
      }
      let ff = null; try { ff = buildFrame(fd, 'idle', 0); } catch (e) {}
      if (!ff) { perFacing.push({ d: fd, rows: 0, dev: -1 }); continue; }
      let dev = 0, n = 0;
      for (const ys of Object.keys(fr).map(Number).sort((a, b) => a - b)) {
        let a = 1e9, b = -1;
        for (let x = 0; x < ff.CW; x++) { const v = ff.grid[ys * ff.CW + x];
          if (v === 1 || v === 2) { if (x < a) a = x; if (x > b) b = x; } }
        if (b < a) continue;
        const rw = fr[ys].b - fr[ys].a + 1, gw = b - a + 1, dv = Math.abs(gw - rw);
        dev += dv; n++;
        if (fd === 'S') { rows.push({ y: ys, rig: rw, game: gw, d: dv });
          total += dv; rigSum += rw;
          if (dv > worst) { worst = dv; worstY = ys; } }
      }
      perFacing.push({ d: fd, rows: n, dev: dev });
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
             ratio: total / Math.max(1, rigSum), worstR: worstR, rigSum: rigSum,
             perFacing: perFacing, poseDev: perFacing.reduce((a, f) => a + Math.max(0, f.dev), 0),
             rigRows: Object.keys(rig).length, edged: edged, checked: checked };
  });

  if (R.err) { console.log('  FAIL: ' + R.err); console.log('HEAD FOLLOWS RIG GATE: 0 passed, 1 failed'); await browser.close(); process.exit(1); }

  console.log('  row  rig  game');
  for (const r of R.rows) console.log('   y' + String(r.y).padStart(2) + String(r.rig).padStart(5) +
    String(r.game).padStart(6) + (r.d ? '   off by ' + r.d : ''));

  ok('his painted face is readable off the rig (' + R.rigRows + ' rows)', R.rigRows >= 8);
  ok('the head was measured against the rig at all (' + R.rows.length + ' comparable rows)', R.rows.length >= 8);
  const badF = (R.perFacing || []).filter(f => f.dev !== 0);
  ok('*** THE POSED HEAD IS HIS RIG\'S HEAD, ROW FOR ROW, ON ALL EIGHT FACINGS *** (' +
     (R.perFacing || []).map(f => f.d + ':' + f.dev).join(' ') + ') — total deviation ' +
     R.poseDev + ', pinned at ' + PINNED_POSE_DEV + ' and it may never rise',
     R.poseDev <= PINNED_POSE_DEV);
  ok('every facing was actually compared, none silently skipped (' +
     (R.perFacing || []).map(f => f.rows).join('/') + ' rows)',
     (R.perFacing || []).length === 8 && (R.perFacing || []).every(f => f.rows >= 8));
  if (badF.length) console.log('  facings that drifted: ' + badF.map(f => f.d + ' by ' + f.dev).join(', '));

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
