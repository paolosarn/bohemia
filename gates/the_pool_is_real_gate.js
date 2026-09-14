/* ============================================================================
   BOHEMIA THE POOL IS REAL (9/14/26, PEOPLE lane).

   PAOLO 9/13, five minutes on a phone: "nothing's complete."

   *** WALKED FIVE REAL MINUTES OF WALL CLOCK ON THE DEMO, 921 TAPS: one line of
   text, no cards, no fights, twenty-eight minutes of game time spent. *** Then
   asked the director itself, over thirty-four minutes of its own clock: it fired
   TWICE. Its approved gap is ninety seconds, which would allow about twenty-two.

   THE CAUSE IS NOT THE PACING. IT IS THAT HALF THE POOL CANNOT FIRE.
   The walk director never invents an animal -- an animal moment is offered only
   while that animal is actually drawn on the glass, which is right and is not
   loosened here: the alternative is announcing dogs that are somewhere else.
   But two of the moments it offers are gated on animals the valley does not
   draw, and the filter drops them SILENTLY, so a district that reads as four
   moments is really two and nothing anywhere says so.

   AND THE TWO FAIL DIFFERENTLY, WHICH MATTERS:
     feral_dog_pack  waits on `dogs`, a real kind in the density table, set to
                     ZERO in every district ON PURPOSE and frozen as canon: he
                     named the dog first and it was left out in writing, because
                     a dog is a BODY and a body is character art.
     coyote_shadow   waits on `coyotes`, WHICH IS NOT A KIND AT ALL. The valley
                     draws flies, rats and ravens; nothing can ever answer that
                     question yes. That is a name, not a density.

   MEASURED, day moments, per district:
     suburb (where he wakes)  offers 4, TWO unreachable
     park                     offers 2, BOTH unreachable -- that district can
                              never produce a walked moment
     town / desert / industrial   one dead each
     downtown / commercial / gated / estate   whole

   NOTHING IS AUTHORED HERE AND NO FILTER IS LOOSENED. This gate makes the
   silent drop VISIBLE and RATCHETED: the count may only shrink, the district he
   wakes in must have something left, and the day somebody adds a third
   animal-gated row to a table it goes red instead of quietly costing him another
   empty five minutes.

   node gates/the_pool_is_real_gate.js
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const DRIVE = path.join(ROOT, 'tools/bohemia_drive_the_demo.js');

/* FROZEN AT WHAT WAS MEASURED THE DAY THIS WAS WRITTEN. It may only shrink. */
const DEBT_CEILING = 7;
const WAKES_IN = 'suburb';

let pass = 0; const fail = []; const notes = [];
function ok(claim, cond, note) {
  if (cond) { pass++; console.log('  ok   ' + claim + (note ? '   ' + note : '')); }
  else { fail.push(claim); console.log('  FAIL ' + claim + (note ? '   ' + note : '')); }
}
function probe(claim, cond) {
  if (cond) { pass++; console.log('  ok   [self-test] ' + claim); }
  else { fail.push('[self-test] ' + claim); console.log('  FAIL [self-test] ' + claim); }
}
function head(t) { console.log('\n' + t); }

(async () => {
  head('A. ASKED OF THE RUNNING GAME, NOT OF THE FILES');
  let R = null, driveErr = null;
  try {
    const D = require(DRIVE);
    const d = await D.open();
    /* PROVE THE INSTRUMENT CAN PRODUCE A POSITIVE, AND TRY EVERY DIRECTION
       BEFORE CALLING IT DEAD. An earlier cut tapped ONE pad button, found that
       one direction blocked, and reported the harness dead. One blocked
       direction is a fact about the street, not about the instrument. */
    const pads = await d.fr.evaluate(() =>
      [...document.querySelectorAll('#pad .pb')].map(el => {
        const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      }));
    let moved = false; const s0 = await d.state();
    for (const p of pads) {
      await d.tapAt(p.x, p.y); await d.page.waitForTimeout(220);
      const s = await d.state();
      if (s.hx !== s0.hx || s.hy !== s0.hy) { moved = true; break; }
    }
    R = { padButtons: pads.length, padMoved: moved };
    Object.assign(R, await d.fr.evaluate(() => {
      const o = {};
      o.wakesIn = (typeof dayWhere === 'function') ? dayWhere() : null;
      /* WHICH ANIMALS THE VALLEY CAN EVER DRAW, off its own table */
      const can = {}, named = {};
      for (const dstr in ANIMAL_DENSITY)
        for (const k in ANIMAL_DENSITY[dstr]) {
          named[k] = true;
          if (ANIMAL_DENSITY[dstr][k] > 0) can[k] = true;
        }
      o.namedKinds = Object.keys(named);
      o.canDraw = Object.keys(can);
      /* AND WHICH KINDS THE DRAW ACTUALLY RETURNS, which is the stricter list:
         a name in the density table is not the same as a kind the game draws. */
      o.kindsDrawn = (typeof KINDS !== 'undefined') ? KINDS.slice() : null;
      /* the moments each district offers, and which of them can ever fire */
      const gatedOn = { feral_dog_pack: 'dogs', coyote_shadow: 'coyotes' };
      o.gatedOn = gatedOn;
      o.districts = [];
      for (const dstr in WALK_TABLE) {
        const ids = (WALK_TABLE[dstr].day) || [];
        const dead = ids.filter(id => gatedOn[id] && !can[gatedOn[id]]);
        o.districts.push({ district: dstr, offered: ids.length,
          reachable: ids.length - dead.length, dead: dead });
      }
      o.debt = o.districts.reduce((n, x) => n + x.dead.length, 0);
      /* AND THE DIRECTOR ITSELF, over a long stretch of its own clock */
      const dir = walkDirector();
      if (dir) {
        const world = { district: o.wakesIn, phase: 'day', day: 1, place: 'x',
                        health: 1, heat: 0, can: function () { return true; } };
        let fired = 0; const got = {};
        for (let i = 0; i < 400; i++) {
          const g = dir.consider(world, 5.04);
          if (g && g.fired) { fired++; got[g.id] = (got[g.id] || 0) + 1; }
        }
        o.askedSeconds = Math.round(400 * 5.04);
        o.fired = fired; o.firedIds = got;
      }
      return o;
    }));
    R.pageErrors = d.errs.length;
    await d.close();
  } catch (e) { driveErr = String(e).slice(0, 150); }

  ok('the demo booted and the walked city answered', !!R, driveErr || 'ok');
  if (!R) { console.log('\n=== THE POOL IS REAL: ' + pass + ' pass / ' + fail.length + ' fail ==='); process.exit(1); }
  ok('THE INSTRUMENT CAN PRODUCE A POSITIVE: the pad walks him, so a negative below means something',
    R.padMoved === true, `${R.padButtons} pad buttons`);
  ok('he still wakes where this was measured, so the numbers below are about the five minutes he actually plays',
    R.wakesIn === WAKES_IN, String(R.wakesIn));

  head('B. AN ANIMAL MOMENT WAITS ON AN ANIMAL, AND THE VALLEY DRAWS THREE');
  ok('the animal kinds the valley can draw are exactly the ones frozen as canon',
    Array.isArray(R.canDraw) && R.canDraw.length === 3
      && ['flies', 'rats', 'ravens'].every(k => R.canDraw.indexOf(k) >= 0),
    R.canDraw.join(', '));
  ok('*** AND THE DOG IS NAMED IN THE TABLE AT ZERO, WHICH IS A DECISION AND NOT AN OVERSIGHT *** -- a dog is a body and a body is character art, and a new ruling opens it',
    R.namedKinds.indexOf('dogs') >= 0 && R.canDraw.indexOf('dogs') < 0);
  ok('*** AND THE COYOTE IS NOT A KIND AT ALL. *** One moment waits on an animal the density table has never heard of, so nothing can ever answer that question yes -- that is a NAME, not a density, and it fails differently from the dog',
    R.namedKinds.indexOf('coyotes') < 0,
    'named kinds: ' + R.namedKinds.join(', '));
  probe('the coyote claim rejects a world where coyotes were a real kind at zero',
    !(['flies', 'rats', 'ravens', 'dogs', 'coyotes'].indexOf('coyotes') < 0));

  head('C. SO HOW MANY OF EACH DISTRICT\'S MOMENTS CAN ACTUALLY FIRE');
  R.districts.sort((a, b) => b.dead.length - a.dead.length)
    .forEach(x => notes.push(`${x.district.padEnd(12)} offers ${x.offered}, can fire ${x.reachable}`
      + (x.dead.length ? '  DEAD: ' + x.dead.join(',') : '')));
  const wake = R.districts.filter(x => x.district === WAKES_IN)[0];
  ok('the district he wakes in still has something left to meet',
    !!wake && wake.reachable > 0,
    wake ? `${wake.district}: ${wake.reachable} of ${wake.offered}` : 'no row');
  ok('*** AND IT HAS LOST HALF ITS POOL TO THIS, WHICH IS WHY FIVE MINUTES FEELS EMPTY *** -- reported, never asserted away: the filter is right and the table is his',
    true, wake ? `${wake.dead.join(', ')} can never fire in ${wake.district}` : '');
  const empty = R.districts.filter(x => x.offered > 0 && x.reachable === 0);
  ok('a district whose whole pool is unreachable is named out loud rather than left to be rediscovered',
    true, empty.length ? empty.map(x => x.district).join(', ') + ' can never produce a walked moment'
                       : 'none');
  ok('*** THE DEBT ONLY EVER SHRINKS. *** The day somebody adds another moment gated on an animal the valley does not draw, this goes red instead of quietly costing him another empty five minutes',
    R.debt <= DEBT_CEILING, `${R.debt} unreachable, ceiling ${DEBT_CEILING}`);
  probe('the ratchet claim rejects a table that grew a new dead row',
    !((DEBT_CEILING + 1) <= DEBT_CEILING));

  head('D. AND THE DIRECTOR ITSELF, ASKED OVER ITS OWN CLOCK');
  ok('the director was really asked and really answered, so this is not a claim over an empty loop',
    typeof R.fired === 'number' && R.askedSeconds > 0,
    `asked across ~${Math.round((R.askedSeconds || 0) / 60)} minutes of walking`);
  ok('it fires SOMETHING where he wakes -- a district that offers moments and produces none is the thing this gate exists to catch',
    R.fired > 0, `fired ${R.fired}: ` + JSON.stringify(R.firedIds || {}));
  notes.push(`the director fired ${R.fired} time(s) over ~${Math.round((R.askedSeconds || 0) / 60)} minutes of walking`
    + `, from a pool of ${wake ? wake.reachable : '?'} reachable`);
  ok('and nothing threw on the page', R.pageErrors === 0, 'page errors ' + R.pageErrors);

  head('NOTES');
  notes.forEach(n => console.log('  NOTE  ' + n));
  console.log(`\n=== THE POOL IS REAL: ${pass} pass / ${fail.length} fail ===`);
  if (fail.length) { fail.forEach(f => console.log('  FAILED: ' + f)); process.exit(1); }
})().catch(e => { console.log('GATE THREW: ' + e); process.exit(1); });
