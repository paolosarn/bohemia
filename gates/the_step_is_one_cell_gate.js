/* ==========================================================================
   THE STEP IS ONE CELL  (RUN, 9/27/26, VAMILY [two scales])

   PAOLO 9/27, rule 34: "your character stays tiny even as you zoom out and YOU MOVE
   ONE GRID AT A TIME, THAT WE HAD ORIGINALLY... one house doesn't equal one tile,
   it's all fucked up... the demo is still not playable from the very beginning."

   Rule 34(c) SUPERSEDES BY NAME the two laws this lane built: THE STEP IS A HOUSE
   (9/15) and A COMBAT TILE IS A HOUSE (9/4). Rule 34(f) puts a sentence into rule 18:
   THE FIRST SIXTY SECONDS ARE A GAME -- loading, then a press moves him one cell,
   every time.

   MEASURED ON THE GLASS BEFORE THE CHANGE:
       one cell drew          11 px
       one press carried      25 cells = 275 px
       the body drew         112 px, which is TEN CELLS wide
   A person ten cells across taking a twenty-five cell stride is the thing he called
   fucked up, and the stride was this lane's own number.

   AND THE HARNESS LOSES THE FIRST TOUCH, WHICH LOOKS EXACTLY LIKE A BROKEN STRIDE.
   Measured twice: at 320 ms spacing the run read [1,1,0,1,0,2,...] and at 700 ms it
   read [0,2,1,1,1,...] -- the lost press's movement arriving on the NEXT one. Total
   cells always equalled the presses that landed and no press ever carried more than
   one cell of its own. So this warms the pad with a throwaway press first, and a
   0-followed-by-2 is reported as the ruler rather than counted against the game.

   WHAT IS NOT IN HERE AND WHY: the one-cell BODY is CHARACTER's [small body] this
   same round, and the 32 px cell needs WORLD's [honest grid] block -- a house is 13
   cells today, so at 32 px it would draw 416 px on a 378 px screen and not fit. One
   system, one session; this gate holds the step and the seam, which are this lane's.

   node gates/the_step_is_one_cell_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('THE STEP IS ONE CELL: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

const PRESSES = 16;

(async () => {
  /* ONE NUMBER IN ONE PLACE. The law that died said so and this one still does: a
     second copy of the stride is how a dead law comes back under a new name. */
  const WORLD = fs.readFileSync(
    path.join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  ok('the stride is declared once and it is one cell',
     /strideFine:\s*1\b/.test(WORLD));
  ok('and nothing sets the stride from the lot any more (the superseded law)',
     !/strideFine\s*[:=]\s*(BODY_SCALE\.)?lotFine/.test(WORLD)
     && !/strideFine:\s*2[0-9]\b/.test(WORLD));

  let d;
  /* RE-AIMED 9/28 (RUN, rule 38b): one cell per press survives in the fight and the Strip;
     the demo no longer walks the city, so the street step is measured in the ALPHA, which
     keeps the walked street until [no city walk] excavates it. Not loosened. */
  try { d = await drive.open({ alpha: true, keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }

  try {
    const fr = d.fr;
    await d.page.waitForTimeout(1200);

    const c = await fr.evaluate(() => ({
      step: (typeof STEP_CELLS === 'number') ? STEP_CELLS : null,
      stride: (typeof BODY_SCALE !== 'undefined') ? BODY_SCALE.strideFine : null,
      cellPx: (typeof HC === 'number') ? HC : null }));
    say('  the game says: one press is ' + c.step + ' cell(s), one cell is ' + c.cellPx + ' px');
    ok('*** THE GAME ITSELF CARRIES ONE CELL PER PRESS *** (it was 25)',
       c.step === 1 && c.stride === 1);

    /* AND A FINGER AGREES, which is the only claim that matters. */
    const at = () => fr.evaluate(() => ({ x: hx, y: hy }));
    const east = await fr.evaluate(() => {
      const pad = document.getElementById('pad');
      const g = pad && pad.querySelectorAll('.pb')[2];
      const a = g && (g.querySelector('.parr') || g);
      if (!a) return null;
      const r = a.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    ok('the walk pad is on the screen to be pressed', !!east);
    if (!east) { await d.close(); return done(); }

    /* *** THE WARM-UP HAS TO PROVE IT WARMED UP. *** A single throwaway press was not
       enough: the throwaway ITSELF was the one the harness lost, so its movement landed
       on the first measured press and that press read 2. Excusing a 2 in the tally would
       have been excusing the game for the ruler's mistake in the other direction -- it
       could hide a real two-cell stride. So the warm-up presses until one of them really
       moves him, and only then does counting start. The artefact is removed at its
       source instead of forgiven in the numbers. */
    let warm = 0, moved = false;
    while (warm < 6 && !moved) {
      const a0 = await at();
      await d.tapAt(east.x, east.y);
      await d.page.waitForTimeout(700);
      const a1 = await at();
      moved = (a1.x !== a0.x || a1.y !== a0.y);
      warm++;
    }
    say('  the pad was warmed in ' + warm + ' press' + (warm === 1 ? '' : 'es')
        + ' (the harness loses the first touch)');
    ok('the pad answers a finger at all before anything is counted', moved === true);

    /* *** AND IT COUNTS THE GAME'S OWN STEPS, NOT MY DELIVERIES. *** (Second correction
       this round, and the first one was not enough.) Warming the pad stopped the lost
       touch at the START, and then a run came back [1,1,1,1,1,0,2,1,...] -- a touch
       dropped in the MIDDLE, its movement arriving on the next press. No warm-up can
       prevent that, and I had already thrown out the idea of forgiving a 2 in the tally
       because an exception for the ruler's bad night would also hide a real two-cell
       stride.
       SO THE MEASUREMENT MOVES OFF THE DELIVERY AND ONTO THE THING BEING MEASURED. The
       walk has one function that carries him, and it is wrapped here: every call records
       how far HE moved in THAT call. A dropped touch now means one fewer call, never a
       call worth two cells, so the plain rule can be asserted with nothing carved out of
       it. That is the difference between measuring the game and measuring my own hand. */
    await fr.evaluate(() => {
      window.__STEPS = [];
      const real = window.stepOnce;
      if (typeof real !== 'function') { window.__NOSTEP = true; return; }
      window.stepOnce = function () {
        const bx = hx, by = hy;
        const out = real.apply(this, arguments);
        window.__STEPS.push(Math.abs(hx - bx) + Math.abs(hy - by));
        return out;
      };
    });
    const noStep = await fr.evaluate(() => !!window.__NOSTEP);
    ok('the walk has one function that carries him, and it can be watched', noStep === false);

    for (let i = 0; i < PRESSES; i++) {
      await d.tapAt(east.x, east.y);
      await d.page.waitForTimeout(700);
    }
    const moves = await fr.evaluate(() => window.__STEPS.slice());
    const ones = moves.filter(m => m === 1).length;
    const over = moves.filter(m => m > 1).length;
    const dead = moves.filter(m => m === 0).length;
    const total = moves.reduce((a, b) => a + b, 0);
    say('  ' + PRESSES + ' presses produced ' + moves.length + ' steps in the game: '
        + JSON.stringify(moves));
    say('  one cell ' + ones + ' times, nothing ' + dead + ', more than one cell ' + over
        + ', ' + total + ' cells over ' + PRESSES + ' presses');

    /* NO PRESS MAY CARRY MORE THAN ONE CELL. This is the law, and the one exception
       that is the ruler's is named: a lost press whose movement lands on the next
       one shows up as a 0 immediately followed by a 2. */
    /* AND NOW IT IS THE PLAIN CLAIM, WITH NO EXCEPTION IN IT. A rule with a carve-out
       for the measurement's own bad night is a rule that cannot fail honestly. */
    ok('*** NO PRESS CARRIES MORE THAN ONE CELL ***', over === 0);
    ok('and he really walks: at least ' + (PRESSES - 2) + ' of ' + PRESSES
       + ' presses reached the walk (' + moves.length + ' steps, ' + total + ' cells)',
       moves.length >= PRESSES - 2);

    /* THE SEAM, AND THE HALF THE ROW NAMES: he comes back to the cell he left. */
    const before = await at();
    await d.pinchOut();
    const inCity = await fr.evaluate(() => MODE);
    await d.pinchIn();
    const back = await at();
    const mode = await fr.evaluate(() => MODE);
    say('  left the street at ' + before.x + ',' + before.y + ' -> ' + inCity
        + ' -> back at ' + back.x + ',' + back.y + ' (' + mode + ')');
    ok('one squeeze reaches the far scale', inCity === 'city');
    ok('and one spread brings him back to the street', mode === 'human');
    ok('*** AND HE LANDS ON THE CELL HE LEFT, not near it ***',
       back.x === before.x && back.y === before.y);

    await d.close();
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
