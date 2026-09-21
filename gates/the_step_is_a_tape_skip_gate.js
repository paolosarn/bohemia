/* BOHEMIA — THE STEP IS A TAPE SKIP GATE (9/21/26, ANIMATION lane, row [tape skip])
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.
 *
 * WHAT THIS EXISTS FOR, and it is not the feel. It is the defect under the feel:
 *
 *   THE GLIDE HAD A HANDWRITTEN CEILING OF FOUR CELLS AND A STEP IS NOW
 *   TWENTY-FIVE, SO EVERY GLIDE DIED ON ITS FIRST FRAME.
 *
 * The ceiling was written on 8/23, when a step was one cell and the bike's four
 * was the biggest thing a beat could move; its own comment says so. Rule 16
 * (9/15) made one step a whole lot. Nothing connected the two numbers, so since
 * then the chip in the drawer has said SLIDE, the source has said SLIDE, and what
 * the player actually walks is GRID: the entire world jumping 275 px in ONE
 * frame, twice a second. Measured on the walked city before the fix:
 * gliding() true on 0 of 60 samples across a press. After: true again.
 *
 * A NUMBER TYPED INTO A GUARD IS A NUMBER THAT EXPIRES, and it expires silently,
 * because a guard that refuses everything looks exactly like a feature nobody
 * turned on. So the ceiling is DERIVED from the step now, and this gate asks the
 * code for it rather than restating it -- the restating is the bug this lane has
 * now paid for seven times.
 *
 * WHAT IT HOLDS:
 *   1. the three feels exist and TAPE is the default
 *   2. there is ONE copy of the curve, so no second ruler can drift from it
 *   3. the ceiling clears a walk step, a run and a bike, and still refuses a teleport
 *   4. the curves are what they claim: GRID one position, SLIDE a ramp, TAPE a
 *      staircase of the stations, measured through the game's own seam
 *   5. the stations are ordered, start held, and land ON the beat, never before
 *   6. the chip names whichever feel is live, all three of them
 *
 *   node gates/the_step_is_a_tape_skip_gate.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => { c ? (pass++, console.log('  ok   ' + n + (note ? '  [' + note + ']' : '')))
                               : (fail++, console.log('  FAIL ' + n + (note ? '  [' + note + ']' : ''))); };

(async () => {
  const src = fs.readFileSync(CITY, 'utf8');

  /* ---- 2. ONE COPY OF THE CURVE -------------------------------------------
     Read in the source rather than in the browser on purpose: a second copy
     that nothing calls yet is still a second copy, and it is the one that gets
     called next round. */
  const eases = (src.match(/1-Math\.pow\(-2\*k\+2,2\)\/2/g) || []).length;
  ok('the walk curve is written once and only once', eases === 1, eases + ' copies');

  const ceilRefs = (src.match(/glideCeil\(\)/g) || []).length;
  ok('the teleport ceiling is a named derivation, not a number typed in a guard',
     ceilRefs >= 2 && !/Math\.abs\(dx\)>4\|\|Math\.abs\(dy\)>4/.test(src),
     ceilRefs + ' references');

  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await br.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + CITY, { waitUntil: 'load' });
  await pg.waitForTimeout(4000);

  const seam = await pg.evaluate(() => {
    const W = window.__WALKFEEL;
    if (!W) return null;
    return { feels: W.feels(), mode: W.mode(), stations: W.stations(),
             ceil: W.ceil(), step: W.step() };
  });
  if (!seam) { ok('the city exposes its walk seam', false); await br.close(); return done(); }

  /* ---- 1. THE THREE FEELS -------------------------------------------------- */
  ok('there are three walk feels', seam.feels.length === 3 && seam.feels.indexOf('TAPE') >= 0,
     seam.feels.join(', '));
  ok('a fresh phone walks on TAPE', seam.mode === 'TAPE', seam.mode);

  /* ---- 3. THE CEILING ------------------------------------------------------
     THE CLAIM THAT CAUGHT THE BUG, stated as the thing that must be true rather
     than as the arithmetic that makes it true: A WALK STEP MUST GLIDE. */
  ok('the ceiling clears one walk step', seam.ceil > seam.step, 'step ' + seam.step + ', ceiling ' + seam.ceil);
  ok('the ceiling clears a run, which is two walk steps in one beat', seam.ceil >= 2 * seam.step);
  ok('the ceiling clears a bike step, which is four lots', seam.ceil >= 4 * seam.step);
  ok('and it still refuses a teleport', seam.ceil < 10 * seam.step, 'ceiling ' + seam.ceil);

  /* ---- 5. THE STATIONS ----------------------------------------------------- */
  const st = seam.stations;
  ok('the tape has two dropped frames between the lots', st.length === 3, st.length + ' stations');
  ok('it holds on the lot he left', st[0][0] === 0 && st[0][1] === 0);
  let ordered = true;
  for (let i = 1; i < st.length; i++) if (st[i][0] <= st[i - 1][0] || st[i][1] <= st[i - 1][1]) ordered = false;
  ok('the stations only ever go forward', ordered, JSON.stringify(st));
  ok('none of them lands him early: the landing is the beat',
     st.every(s => s[1] < 1), 'furthest station ' + st[st.length - 1][1]);
  ok('the stillness is long, as the horror law asks: over half the beat is a held frame',
     st[1][0] >= 0.5, 'first drop at ' + st[1][0] + ' of the beat');

  /* ---- 4. THE CURVES ARE WHAT THEY CLAIM ----------------------------------
     Asked of the game's own curve at 1 ms resolution across one beat, and turned
     into whole screen pixels at the live camera, because the camera rounds and a
     move under a pixel is not a move he can see. FRAME-RATE FREE ON PURPOSE:
     this box's headless page clamps every timer and rAF to about twenty a
     second, fewer than a beat contains, so counting drawn frames here would
     measure the box. */
  const curves = await pg.evaluate(() => {
    const W = window.__WALKFEEL;
    const LOT = (typeof STEP_CELLS === 'number' ? STEP_CELLS : 25) * (typeof HC === 'number' ? HC : 11);
    const out = {};
    for (const f of W.feels()) {
      const seen = new Set(); let prev = null, moves = 0, big = 0, mono = true;
      for (let ms = 0; ms <= 500; ms++) {
        const v = Math.round(W.curve(f, ms / 500) * LOT);
        seen.add(v);
        if (prev !== null) { if (v < prev) mono = false;
          if (v !== prev) { moves++; big = Math.max(big, v - prev); } }
        prev = v;
      }
      out[f] = { positions: seen.size, moves, big, mono, lot: LOT };
    }
    return out;
  });
  const G = curves.GRID, S = curves.SLIDE, T = curves.TAPE;
  console.log('       one lot is ' + T.lot + 'px on screen at the walk camera');
  console.log('       GRID  ' + G.positions + ' ground positions a beat, ' + G.moves + ' moves, biggest ' + G.big + 'px');
  console.log('       SLIDE ' + S.positions + ' ground positions a beat, ' + S.moves + ' moves, biggest ' + S.big + 'px');
  console.log('       TAPE  ' + T.positions + ' ground positions a beat, ' + T.moves + ' moves, biggest ' + T.big + 'px');

  ok('GRID holds one position and lands the whole lot on the beat',
     G.moves === 1 && G.big >= T.lot - 2, G.moves + ' move of ' + G.big + 'px');
  ok('SLIDE moves the ground on effectively every frame a phone could draw',
     S.moves > 100, S.moves + ' moves');
  ok('TAPE moves it once per station and never between them',
     T.moves === st.length, T.moves + ' moves, ' + st.length + ' stations');
  /* THE CONTROL. Without this the TAPE claim passes on any curve with three
     steps in it, including a SLIDE quantised by accident. The three must be
     TELLABLE APART by the same ruler, in the right order. */
  ok('the three feels are three different things by the same ruler',
     G.positions < T.positions && T.positions < S.positions / 10,
     G.positions + ' < ' + T.positions + ' << ' + S.positions);
  ok('no feel ever moves the ground backwards', G.mono && S.mono && T.mono);
  ok('the tape never jumps more than half a lot at once',
     T.big <= T.lot / 2, T.big + 'px of ' + T.lot);

  /* ---- 6. THE CHIP --------------------------------------------------------
     THE 8/12 CHIP IS HOW HE FLIPS IT HIMSELF. It used to be a two-way ternary,
     which would have printed GRID for TAPE -- a control that lies about which
     state it is in is worse than no control. */
  const chip = await pg.evaluate(() => {
    const W = window.__WALKFEEL, out = {};
    for (const f of W.feels()) { W.set(f);
      const b = document.getElementById('walkfeel');
      out[f] = b ? b.textContent.trim() : '(no chip on this surface)'; }
    W.set('TAPE');
    return out;
  });
  const chipVals = Object.values(chip);
  const noChip = chipVals.every(v => v.indexOf('no chip') >= 0);
  ok('the chip names whichever feel is live, all three of them',
     noChip || Object.keys(chip).every(f => chip[f].indexOf(f) >= 0),
     noChip ? 'the chip lives in the alpha drawer, not on this page' : JSON.stringify(chip));

  /* ---- AND THE WALK STILL WALKS ------------------------------------------- */
  const walked = await pg.evaluate(async () => {
    try { document.getElementById('daycard').classList.remove('on'); } catch (e) {}
    /* *** THE CLAIM THAT TOOK THREE CUTS, AND THE MUTATION CAUGHT EVERY WRONG ONE. ***
       Cut 1 read gliding(), which is a flag the step SETS and only a draw clears,
       so a glide that every frame killed still read as on.
       Cut 2 asked how far along the line from where he started, and two steps fall
       inside one sample window, so a camera sitting exactly on the middle lot
       scored 0.5 and read as in-flight while it was teleporting lot to lot.
       Cut 3 asked the right question -- is the ground drawn off the cell he is
       standing on -- and STILL passed the mutant, which taught the real fact:
       A BLOCKED PRESS MOVES ONE OR TWO CELLS, WHICH FITS UNDER THE OLD CEILING
       AND GLIDES FINE. So the expired ceiling did not break the walk evenly: it
       glided the short steps and teleported the full ones, and the walk changed
       character depending on whether a wall happened to shorten it.
       SO THE CLAIM IS SCORED ON FULL-LOT STEPS ONLY, and it carries a vacuous-pass
       guard: if no full step was seen, that is a FAIL, not a pass, because this
       lane has shipped a green over an empty measurement before. */
    const presses = [];
    for (let i = 0; i < 12; i++) {
      const x0 = hx, y0 = hy;
      let offLot = 0;
      const iv = setInterval(() => {
        const c = window.__WALKFEEL.cam();
        if (Math.abs(c[0] - hx) > 0.01 || Math.abs(c[1] - hy) > 0.01) offLot++;
      }, 8);
      startHold(i % 4 === 0 ? 4 : (i % 4 === 1 ? 2 : (i % 4 === 2 ? 0 : 6)));
      endHold();
      await new Promise(r => setTimeout(r, 760));
      clearInterval(iv);
      presses.push({ cells: Math.hypot(hx - x0, hy - y0), offLot });
    }
    const step = window.__WALKFEEL.step();
    const full = presses.filter(p => p.cells >= step - 1);
    return { moved: presses.filter(p => p.cells > 0.5).length, n: presses.length,
             fullSteps: full.length, fullGlided: full.filter(p => p.offLot > 0).length,
             shortSteps: presses.filter(p => p.cells > 0.5 && p.cells < step - 1).length };
  });
  ok('he still walks', walked.moved >= 6, walked.moved + ' of ' + walked.n + ' presses moved him');
  /* THE VACUOUS-PASS GUARD: no full step seen means the ruler measured nothing. */
  ok('the sweep actually contained full-lot steps to judge',
     walked.fullSteps >= 2, walked.fullSteps + ' full, ' + walked.shortSteps + ' shortened by something in the way');
  /* THE ONE THAT CATCHES THE ORIGINAL BUG ON THE REAL SURFACE. With the expired
     ceiling this is 0 of the full steps while every other claim stays green. */
  ok('a FULL-lot step draws the ground off his own lot, instead of teleporting',
     walked.fullSteps >= 2 && walked.fullGlided === walked.fullSteps,
     walked.fullGlided + ' of ' + walked.fullSteps + ' full steps were drawn in flight');

  ok('nothing threw anywhere in this sweep', errs.length === 0, errs.slice(0, 2).join(' | '));
  await br.close();
  done();
})().catch(e => { console.log('  FAIL the gate could not run — ' + String(e.message).slice(0, 200)); process.exit(1); });

function done() {
  console.log('\nTHE STEP IS A TAPE SKIP GATE: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}
