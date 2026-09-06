/* ============================================================================
   THE ROADS ARE FAST GATE (9/5/26, WORLD lane) — BB-ROADS-ARE-FAST.

   The row, quoting his reference game: "ROADS ARE FAST. Everybody, player
   included, moves at high speed along a road."

   MEASURED ON THE WALKED SURFACE BEFORE ANYTHING WAS WRITTEN: 29 paved cells cost
   2 minutes and 29 cells of broken ground cost 2 minutes. IDENTICAL. Every street
   in this valley was mechanically scenery, and we have more street than almost
   anything else in the project.

   WHY A ROAD IS THE RIGHT LEVER AND NOT A SPEED SETTING: a fast road does not
   flatten the valley, it gives it a GRAIN -- places near in time and far in metres.
   The friction stays and the shape changes, which is the structure von Thunen says
   organises everything.

   *** THE BASELINE DOES NOT MOVE, AND CHECK 1 IS THERE TO KEEP IT THAT WAY. ***
   0.084 minutes a cell is about nine metres a minute, so a 16-hour day walks about
   8.6 km across a 9.2 km valley, and the row calls that a GOOD NUMBER rather than a
   bug. Broken ground still costs exactly what it cost; only pavement got cheaper.

   THE SURFACE COMES FROM __surfaceOf, THE CLASSIFIER THE FOOTSTEPS ALREADY USE, so
   the ground that SOUNDS like asphalt is the ground that WALKS like asphalt and
   there is no second opinion about what a tile is. That function had its own
   9/5 near-miss (it read two fields a city cell does not have and returned 'dirt'
   for all 6,561 cells around the spawn), which is exactly why this leans on it
   rather than writing a third answer.

   node gates/roads_are_fast_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('ROADS ARE FAST GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (pavement is twice the speed - broken ground is untouched'
            + ' - the director is paid the time really spent)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the shape of it, in the source --------------------------------- */
{
  const city = fs.readFileSync(CITY, 'utf8');
  ok('the walked step charges a COST rather than a constant',
     /advance\(_mc\)/.test(city) && /var _mc=stepCost\(c\)/.test(city));
  ok('THE BASELINE IS STILL 0.084 A CELL -- 8.6 km in a 16 hour day, which the row'
     + ' calls a good number', /var MIN_PER_CELL = 0\.084;/.test(city));
  ok('and the number carries its ruling and tuned:false, like every other number'
     + ' this lane has shipped', /PAVED_SPEED = \{ factor: [\d.]+, ruling: '[^']+', tuned: false \}/.test(city));
  /* THE DIRECTOR IS PAID THE TIME THAT WAS REALLY SPENT. The old call handed it a
     hard-coded 5.04 seconds, which was right while every cell cost the same and
     would have doubled his approved ~90-second gap on pavement. Pacing changed by
     a movement fix is nobody's ruling. */
  ok('THE ENCOUNTER DIRECTOR IS HANDED THE REAL SECONDS, not one baseline cell\'s',
     /walkInterrupt\(_mc\*60\)/.test(city) && !/walkInterrupt\(5\.04\)/.test(city));
  /* INDOORS IS NOT A HIGHWAY. The interior step has its own advance(). */
  ok('the indoor step is untouched -- a corridor is not a highway',
     /This is the indoor one[\s\S]{0,900}?advance\(0\.084\); return true;/.test(city));
  /* AND THE OUTDOOR STEP IS THE ONLY ONE THAT MOVED. If a second walked advance()
     ever appears with the raw constant, the grain stops applying to half the map
     and nothing would say so. */
  ok('and the outdoor walk has exactly one cost site',
     (city.match(/advance\(_mc\)/g) || []).length === 1);
}

/* ---- 2. on the surface he walks, driven through the game's own step ----- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const r = await pg.evaluate(() => {
    const R = {};
    /* WHAT THE GROUND AROUND HIM IS ACTUALLY MADE OF. If the valley were all dirt
       this row would be a no-op dressed as a feature, so it is measured. */
    const seen = {};
    for (let gy = hy - 200; gy < hy + 200; gy += 7) for (let gx = hx - 200; gx < hx + 200; gx += 7) {
      const c = realizeCell(gx, gy); if (!c || !c.walk) continue;
      const s = __surfaceOf(c); seen[s] = (seen[s] || 0) + 1;
    }
    R.surfaces = seen;
    const tot = Object.values(seen).reduce((a, b) => a + b, 0);
    R.pavedShare = +(((seen.asphalt || 0) + (seen.concrete || 0)) / tot).toFixed(3);

    /* THE COST FUNCTION ITSELF, on real cells off the real map. */
    R.costs = {};
    for (const s of ['asphalt', 'concrete', 'gravel', 'dirt', 'sand']) {
      outer:
      for (let gy = hy - 300; gy < hy + 300; gy += 3)
        for (let gx = hx - 300; gx < hx + 300; gx++) {
          const c = realizeCell(gx, gy);
          if (c && c.walk && __surfaceOf(c) === s) { R.costs[s] = stepCost(c); break outer; }
        }
    }

    /* AND WALKED FOR REAL, THROUGH stepOnce -- not by calling the cost function.
       A cost table that agrees with itself proves nothing about the body. */
    MODE = 'human';
    function walkRun(pred, label) {
      for (let gy = hy - 400; gy < hy + 400; gy += 3) {
        let run = [];
        for (let gx = hx - 400; gx < hx + 400; gx++) {
          const c = realizeCell(gx, gy);
          if (c && c.walk && pred(__surfaceOf(c))) run.push(gx); else run = [];
          if (run.length >= 40) {
            hx = run[0]; hy = gy;
            const t0 = T.min, d0 = T.day;
            let steps = 0;
            for (let k = 0; k < 39; k++) { const before = hx; stepOnce(2); if (hx === before) break; steps++; }
            const mins = (T.day - d0) * 1440 + (T.min - t0);
            return { label, steps, mins: +mins.toFixed(3) };
          }
        }
      }
      return { label, steps: 0, mins: null };
    }
    R.pavedWalk = walkRun(s => s === 'asphalt' || s === 'concrete', 'paved');
    R.roughWalk = walkRun(s => s !== 'asphalt' && s !== 'concrete', 'rough');

    /* THE CARD SAYS HOW FAR HE GOT, because a step count cannot show what this
       row changed -- 412 steps reads the same on a highway and across a wash. */
    advance(20 * 60);
    R.card = (document.getElementById('daycardIn') || {}).textContent || '';
    return R;
  });
  await b.close();

  ok('there is real pavement to walk on -- ' + Math.round(r.pavedShare * 100)
     + '% of the walkable ground near where the game opens', r.pavedShare > 0.15);
  ok('a roadway costs half the baseline', r.costs.asphalt === 0.042);
  ok('and a sidewalk does too -- a person on foot is not slower on the walk than'
     + ' on the tarmac', r.costs.concrete === 0.042);
  ok('BROKEN GROUND IS EXACTLY WHAT IT WAS: dirt still costs the baseline',
     r.costs.dirt === 0.084);
  ok('and so does gravel -- a shoulder is not a road, and the row did not ask for'
     + ' a ladder of surfaces', r.costs.gravel === undefined || r.costs.gravel === 0.084);

  ok('he really walked the pavement', r.pavedWalk.steps >= 30);
  ok('he really walked the broken ground', r.roughWalk.steps >= 30);
  /* THE CLOCK REPORTS WHOLE MINUTES, so this asserts the ORDER and a clear
     margin rather than an exact ratio -- a test that demands 2.000x off a clock
     that rounds is a test about the clock. */
  ok('*** THE SAME DISTANCE COSTS LESS ON A ROAD *** -- ' + r.pavedWalk.steps
     + ' paved cells in ' + r.pavedWalk.mins + ' min against ' + r.roughWalk.steps
     + ' rough cells in ' + r.roughWalk.mins + ' min',
     r.pavedWalk.mins < r.roughWalk.mins);
  ok('and it is a real difference, not a rounding one (paved at most 60% of rough)',
     r.pavedWalk.mins <= r.roughWalk.mins * 0.6);

  ok('THE CARD SAYS HOW FAR HE GOT, not just how many steps he took',
     /\d+ steps · [\d.]+ (m|km)/.test(r.card));
  ok('no page error across a walk on both surfaces' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);
  done();
})();
