/* BOHEMIA — THE ELDER STOOPS (9/23, ANIMATION, row [spine bend])
 *
 * PAOLO 9/21, on the ages he had just voted YES to: "the old person looks like
 * shit." CHARACTER measured why (e357361, 5c6aebb): young adult, adult and elder
 * land WITHIN 3% OF EACH OTHER. Three ages, one body.
 *
 * AND THE RIG'S OWN NOTE ALREADY SAID WHAT WAS MISSING -- "old age compresses
 * the spine, it does not narrow the shoulders" -- while nothing in the rig could
 * compress a spine. A NOTE THAT NAMES A MECHANISM NOBODY BUILT IS A PLAN, NOT A
 * FEATURE, and it sat there reading like one for as long as the elder existed.
 *
 * The bend is one point above the hips. What this holds:
 *   - the elder is the only age that stoops, and it really is shorter now
 *   - HIS LEGS DO NOT MOVE. That is the load-bearing claim: the pivot is above
 *     the hips, so a stoop that dragged the knees would be a torso tipping over,
 *     not a back rounding, and it would read as falling rather than as old.
 *   - the young adult is untouched, so this is an ELDER change and not a
 *     global one that happens to show up worst on the elder
 *   - and the drawn silhouette really differs, measured on pixels, because a
 *     skeleton that moved while the art did not would pass everything above
 *
 *   node gates/the_elder_stoops_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

const FLOOR_SHORTER = 8;     /* % shorter than the adult. Measured 11.6. */
const FLOOR_LEAN = 1.5;      /* px the head sits out over the hip. Measured 2.4. */

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  ok   ' + n + (note ? '  [' + note + ']' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  [' + note + ']' : ''))); };

(async () => {
  const src = fs.readFileSync(ALPHA, 'utf8');
  ok('only the elder stoops', (src.match(/stoop:\s*[0-9.]+/g) || []).length === 1,
     (src.match(/stoop:\s*[0-9.]+/g) || []).join(', ') || 'no stoop dial at all');

  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await br.newPage();
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(7000);

  const r = await pg.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const out = {};
    for (const age of ['youngadult', 'adult', 'elder']) {
      const pkg = BOH_AGE.apply(BAKED, age);
      const rows = [];
      for (const d of DIRS) {
        const P = pkg.pose[d];
        if (!P || !P.headTop || !P.waC || !P.footA) continue;
        const ground = Math.max(P.footA[1], P.footB ? P.footB[1] : P.footA[1]);
        rows.push({ d,
          height: ground - P.headTop[1],
          lean: Math.abs(P.headTop[0] - P.waC[0]),
          knA: P.knA ? P.knA[1] : null, knB: P.knB ? P.knB[1] : null,
          ftA: P.footA[1], ftB: P.footB ? P.footB[1] : null,
          waC: P.waC[1] });
      }
      out[age] = rows;
    }
    return out;
  });

  const avg = (rows, k) => rows.reduce((s, x) => s + x[k], 0) / rows.length;
  const A = r.adult, Y = r.youngadult, E = r.elder;
  ok('all eight facings were measured for all three ages',
     A.length === 8 && Y.length === 8 && E.length === 8,
     A.length + '/' + Y.length + '/' + E.length);

  const shorter = (avg(A, 'height') - avg(E, 'height')) / avg(A, 'height') * 100;
  const youngShorter = (avg(A, 'height') - avg(Y, 'height')) / avg(A, 'height') * 100;
  console.log('       adult ' + avg(A, 'height').toFixed(1) + 'px, young ' + avg(Y, 'height').toFixed(1)
    + 'px, elder ' + avg(E, 'height').toFixed(1) + 'px');
  ok('the old man is really shorter than the middle-aged one',
     shorter >= FLOOR_SHORTER, shorter.toFixed(1) + '% shorter (it was 3%, all three ages within it)');
  ok('and his head hangs out over his own hip',
     avg(E, 'lean') - avg(A, 'lean') >= FLOOR_LEAN,
     'elder ' + avg(E, 'lean').toFixed(2) + 'px against adult ' + avg(A, 'lean').toFixed(2) + 'px');

  /* THE LOAD-BEARING CLAIM. The pivot is ABOVE THE HIPS, so a stoop must not
     touch a knee or a foot. If it does, the torso is tipping over rather than
     the back rounding, and the body reads as falling, not as old.
     AND MUTATING IT TAUGHT SOMETHING ABOUT THE CODE. Adding the leg joints to
     the bend's own list is a NO-OP: the clamp `Math.max(0, piv - y)` makes a
     joint below the pivot score zero travel, so the legs are protected by
     construction rather than by a list somebody has to remember. The mutation
     that does move them takes the clamp OUT, and then this goes 0 to 32 joints,
     worst 10.7px. Both facts are worth knowing: the guard is structural, and
     this claim still catches the only edit that can defeat it. */
  let legMoved = 0, worstLeg = 0;
  for (let i = 0; i < E.length; i++) {
    const a = A[i], e = E[i];
    for (const j of ['knA', 'knB', 'ftA', 'ftB']) {
      if (a[j] == null || e[j] == null) continue;
      /* the elder is 0.97 of the adult's height, so a leg joint is expected to
         sit where that scale puts it and nowhere else */
      const ground = a.ftA;
      const want = ground + (a[j] - ground) * 0.97;
      const off = Math.abs(e[j] - want);
      if (off > 0.5) legMoved++;
      if (off > worstLeg) worstLeg = off;
    }
  }
  ok('HIS LEGS DO NOT MOVE: the bend is above the hips',
     legMoved === 0, legMoved + ' leg joints moved, worst ' + worstLeg.toFixed(2) + 'px');

  /* THE CONTROL. Without it a global change that merely shows up worst on the
     elder passes everything above. */
  let youngMoved = 0;
  for (let i = 0; i < Y.length; i++) if (Math.abs(Y[i].lean - A[i].lean) > 0.2) youngMoved++;
  ok('the young adult is untouched: this is an elder change, not a global one',
     youngMoved === 0 && youngShorter < 4,
     youngShorter.toFixed(1) + '% shorter, ' + youngMoved + ' facings lean');

  /* AND THE ART REALLY MOVED. A skeleton that changed while the drawn body did
     not would pass every claim above, and this lane has shipped exactly that
     class of green before. */
  const drawn = await pg.evaluate(() => {
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], out = {};
    for (const age of ['adult', 'elder']) {
      G.age = (age === 'adult') ? undefined : age;
      /* G.age ALONE DRAWS NOTHING NEW -- rebuildFromRig() is what turns a stage
         into a body package. The first cut of the bake set the field, rendered,
         got three identical bodies, and nearly reported the bend as not reading. */
      rebuildFromRig();
      FRAME_CACHE.map.clear(); HD_CACHE.map.clear();
      try { POSEHOLD_CACHE.clear(); } catch (e) {}
      try { ARMHOLD_CACHE.clear(); } catch (e) {}
      const per = {};
      for (const d of DIRS) {
        const { CW, CH, grid } = buildFrame(d, 'idle', 0);
        let top = CH, n = 0;
        const sig = [];
        for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++)
          if (grid[y * CW + x]) { if (y < top) top = y; n++; sig.push(y * CW + x); }
        per[d] = { top, n, sig: sig.join(',') };
      }
      out[age] = per;
    }
    G.age = undefined; rebuildFromRig();
    return out;
  });
  let differ = 0, crownDrop = [];
  for (const d in drawn.adult) {
    if (drawn.adult[d].sig !== drawn.elder[d].sig) differ++;
    crownDrop.push(drawn.elder[d].top - drawn.adult[d].top);
  }
  const meanDrop = crownDrop.reduce((s, x) => s + x, 0) / crownDrop.length;
  console.log('       the drawn crown sits ' + meanDrop.toFixed(1) + ' rows lower on the old man');
  ok('the DRAWN body differs on every facing, not just the skeleton',
     differ === 8, differ + ' of 8 facings draw differently');
  ok('and the drop is visible: his crown really is lower on screen',
     meanDrop >= 3, meanDrop.toFixed(1) + ' rows');

  ok('nothing threw anywhere in this sweep', errs.length === 0, errs.slice(0, 2).join(' | '));
  await br.close();
  done();
})().catch(e => { console.log('  FAIL the gate could not run — ' + String(e.message).slice(0, 200)); process.exit(1); });

function done() {
  console.log('\nTHE ELDER STOOPS GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
