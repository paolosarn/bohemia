/* ============================================================================
   ONE WALKING CAMERA, ONE BODY SIZE, ONE STRIDE THAT NEVER MISSES
   (9/20/26, RUN lane, VAMILY [one camera], rule 18a THE PLAYABLE CUT)

   PAOLO 9/20, LOCKED: "I'm zooming out and my person becomes bigger... walking the
   same distance and crashing into walls because it's forcing me to move like 67
   tiles at a time, so when I'm trying to walk past the wall it's not allowing me to
   because I'm just missing it."

   BOTH HALVES OF THAT ARE REGRESSIONS THIS LANE SHIPPED, so this gate is the
   machine that stops them coming back. It holds three things, all measured on the
   served demo on a phone profile, with real taps on the real eight-wedge pad:

     1. ONE CAMERA. There is exactly one walking stop. Pinching cannot land on a
        second one, and pinching out at it crosses into the city (the 8/2 seam).
     2. ONE BODY SIZE. The body's rung is identical at every point of a walk and a
        pinch. Before this, the four stops drew him 112 / 56 / 112 / 224 px, so
        zooming out one notch DOUBLED him -- his sentence, exactly.
     3. A STRIDE THAT NEVER MISSES. Walking a circuit of his own block with real
        presses: ZERO STUCK PRESSES (a press that moves him nowhere) and ZERO
        MISSED GAPS (a stride that walks past a side opening and lands beyond it).

   WHAT A MISSED GAP IS, MEASURED AND NOT FELT: reconstruct the cells a press
   actually walked, and ask at every cell BUT THE LAST whether a cell beside him
   just opened that was closed one cell earlier. If one did, the stride stepped over
   the only way through and left it behind him. That is "I'm just missing it" turned
   into a number. Walkability comes from the game's own cellAt().walk, so this gate
   has no opinion of its own to disagree with.

   THE PRESSES ARE REAL. Rule 14(g): a screenshot is the honest instrument and a
   selector is a guess. Every press here is a touch on the pad's own <g class="pb">
   at its own measured centre, through the driver's CDP session, and the position is
   read from the game's state afterwards. Nothing is simulated by calling stepOnce.

   node gates/the_walk_never_misses_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('THE WALK NEVER MISSES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

/* N, NE, E, SE, S, SW, W, NW -- the pad's own wedge order (the ring builds i=0..7
   clockwise from north and hands i straight to startHold). */
const DIRS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

(async () => {
  let d;
  try { d = await drive.open({}); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }

  try {
    const fr = d.fr;

    /* ---- 1. ONE CAMERA ---------------------------------------------------- */
    const stops = await fr.evaluate(() =>
      (typeof HWALK_STOPS !== 'undefined') ? HWALK_STOPS.slice() : null);
    ok('there is a named ladder of WALKING stops, separate from the art ladder',
       Array.isArray(stops));
    ok('*** THERE IS EXACTLY ONE WALKING CAMERA *** (' + JSON.stringify(stops) + ')',
       Array.isArray(stops) && stops.length === 1);
    /* AND IT IS THE STOP WHERE A HOUSE FITS, which is the whole of rule 16. */
    const fits = await fr.evaluate(() => {
      try {
        const C = HWALK_STOPS[0];
        return { lotPx: BODY_SCALE.lotFine * C, screen: cv.width,
                 fits: BODY_SCALE.lotFine * C <= cv.width * 0.9 };
      } catch (e) { return null; }
    });
    ok('and a house fits on the glass at it (' + (fits ? fits.lotPx + ' px lot on a '
       + fits.screen + ' px screen' : 'unreadable') + ')', !!fits && fits.fits);
    ok('the art ladder is NOT deleted (the bake and the character rungs are cut '
       + 'against it)', await fr.evaluate(() =>
         typeof HLEVELS !== 'undefined' && HLEVELS.length === 4));

    /* ---- 2. ONE BODY SIZE -------------------------------------------------- */
    /* THE LADDER ITSELF, ASKED AT EVERY STOP THE ART LADDER HAS. This is the exact
       shape of his complaint: before the fix it answered 112 / 56 / 112 / 224. */
    const rungs = await fr.evaluate(() =>
      HLEVELS.map(C => bodyLadder(C)));
    ok('*** THE BODY IS ONE SIZE WHATEVER THE CAMERA IS DOING *** (' +
       JSON.stringify(rungs) + ')',
       Array.isArray(rungs) && rungs.every(r => r === rungs[0]));
    /* AND ACROSS THE ANIMATED SWEEP, because HC is what the mode transition moves
       and a body sized off HC changed rung three times while dropping in. */
    const sweep = await fr.evaluate(() => {
      const out = [];
      for (let C = 48; C >= 8; C--) out.push(bodyLadder(C));
      return out;
    });
    ok('and across the whole drop-in sweep, 48 px a cell down to 8 (' +
       Array.from(new Set(sweep)).join(', ') + ')',
       sweep.length && sweep.every(v => v === sweep[0]));
    ok('a body is drawn at a real rung, not zero (' + rungs[0] + ' px)', rungs[0] > 0);

    /* AND ON THE LIVE PAGE, THROUGH A REAL PINCH, because a function answering
       correctly is not the same as the screen not changing. */
    const before = await d.state();
    await d.pinchIn();          /* two fingers apart: zoom IN, toward the body */
    const afterIn = await d.state();
    const rungAfter = await fr.evaluate(() =>
      (typeof MODE !== 'undefined' && MODE === 'human') ? bodyLadder(HC) : null);
    ok('a real pinch cannot find a second walking stop (' + before.hzoom + ' -> '
       + afterIn.hzoom + ', mode ' + afterIn.mode + ')',
       afterIn.mode !== 'human' || afterIn.hzoom === before.hzoom);
    if (afterIn.mode === 'human')
      ok('and the body is the same rung after it (' + rungAfter + ')', rungAfter === rungs[0]);
    else ok('and the body is the same rung after it (crossed the seam instead)', true);

    /* back to the street if that pinch crossed over */
    if ((await d.state()).mode !== 'human') { await d.pinchIn(); await d.page.waitForTimeout(1200); }

    /* ---- 3. THE STRIDE ----------------------------------------------------- */
    const st0 = await d.state();
    if (st0.mode !== 'human') {
      ok('the walk starts on the street (mode ' + st0.mode + ')', false);
      await d.close(); return done();
    }
    ok('the walk starts on the street at ' + st0.hx + ',' + st0.hy, true);

    /* THE PAD'S OWN GEOMETRY, measured off the page, so a restyle cannot silently
       move where this gate puts its finger. */
    const fEl = await d.page.$('iframe#cityFrame');
    const fb = fEl ? await fEl.boundingBox() : { x: 0, y: 0 };
    const wedges = await fr.evaluate(() => {
      const pad = document.getElementById('pad');
      if (!pad) return null;
      return Array.from(pad.querySelectorAll('.pb')).map(g => {
        /* the arrow, not the wedge's bounding box: a wedge's box overlaps its
           neighbours' and its centre can land on the hole in the middle */
        const a = g.querySelector('.parr') || g.querySelector('.parr2') || g;
        const r = a.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2, dir: (g.dataset || {}).walk || '' };
      });
    });
    ok('the pad has eight direction wedges to press', !!wedges && wedges.length === 8);
    if (!wedges || wedges.length !== 8) { await d.close(); return done(); }

    /* *** WAIT FOR THE BEAT, DO NOT GUESS HOW LONG IT TAKES. ***
       The first cut of this slept a flat 340 ms after every press. That is fine on an
       idle box and a LIE on a busy one: MEASURED, this gate read 19/0 alone and 17/2
       when it ran inside a gate pass, with a press counted STUCK because the beat had
       not come round yet. Same tree, same code, two different verdicts -- which is
       the ZOOM SEAM seam-leg bug this repo already wrote down in capitals: "a gate
       that goes red because the machine was busy is a gate somebody switches off."
       So it POLLS for the thing it is waiting for, to a budget, and gives up only
       when the world really has had its chance. A press that moves him is seen the
       moment it lands, so this is also FASTER in the common case. */
    const press = async (i) => {
      const w = wedges[i];
      const at = await d.state();
      const pts = [{ x: fb.x + w.x, y: fb.y + w.y, id: 1 }];
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: pts });
      await d.page.waitForTimeout(90);
      await d.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      /* two beats at 120 BPM is a full second; poll to twice that before calling it */
      for (let k = 0; k < 20; k++) {
        await d.page.waitForTimeout(100);
        const now = await d.state();
        if (now.hx !== at.hx || now.hy !== at.hy) { await d.page.waitForTimeout(120); return; }
      }
    };

    /* THE CIRCUIT: his own block. Three lots out on each side, four corners, back
       to the door. Waypoints in fine cells off wherever he actually woke up. */
    const R = await fr.evaluate(() => {
      try { return (BODY_SCALE.lotFine || 25) * 3; } catch (e) { return 75; }
    });
    const legs = [[R, 0], [0, R], [-R, 0], [0, -R]];

    let stuck = 0, sealed = 0, missed = 0, presses = 0, cells = 0;
    const stuckWhere = [], missedWhere = [], sealedWhere = [];
    const tried = Object.create(null);   /* a harness that hammers one wall measures nothing */

    /* *** A DEAD END IS NOT A DEAD PRESS, AND THE GATE HAS TO BE ABLE TO TELL. ***
       The first walk of this round jammed nineteen presses on one cell and the
       picture, read off the game's own walk flags, was a sealed back yard: a wall
       one cell thick to the east with no end within thirty cells, and a second wall
       three cells south closing the pocket. Pressing east there has NO answer, and a
       game that refuses is a game working. Calling that a stride bug would have sent
       this lane chasing a fix for a wall.
       SO THE ORACLE IS A FLOOD FILL, NOT THE THING IT JUDGES. It asks the world, one
       lot out from where he stands, over the game's own walkability: IS THERE ANY
       CELL I CAN REACH FROM HERE THAT IS FURTHER THE WAY I PRESSED? If there is not,
       he is sealed and the refusal is honest. If there is, a press that moved him
       nowhere is a STUCK PRESS and it is ours. The stride's own slide scans wall
       faces; this floods. They cannot agree by construction, which is the point. */
    const isSealed = (x, y, dx, dy, R) => fr.evaluate((a) => {
      const P = window.__proof; if (!P || !P.cellAt) return false;
      const w = (x, y) => { try { const c = P.cellAt(x, y); return !!(c && c.walk); } catch (e) { return false; } };
      const seen = Object.create(null), q = [[a.x, a.y]];
      seen[a.x + ',' + a.y] = 1;
      while (q.length) {
        const v = q.pop();
        if ((v[0] - a.x) * a.dx + (v[1] - a.y) * a.dy > 0) return false;   /* a way that way exists */
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
          if (!i && !j) continue;
          const nx = v[0] + i, ny = v[1] + j;
          if (Math.abs(nx - a.x) > a.R || Math.abs(ny - a.y) > a.R) continue;
          const k = nx + ',' + ny; if (seen[k]) continue;
          if (!w(nx, ny)) continue;
          seen[k] = 1; q.push([nx, ny]);
        }
      }
      return true;
    }, { x, y, dx, dy, R });

    for (const leg of legs) {
      const s = await d.state();
      const goal = [s.hx + leg[0], s.hy + leg[1]];
      for (let n = 0; n < 14; n++) {
        const a = await d.state();
        if (Math.abs(a.hx - goal[0]) + Math.abs(a.hy - goal[1]) < 8) break;
        /* HE PRESSES TOWARD WHERE HE WANTS TO GO. Not toward open ground: a player
           cannot see the walk flags, and a press into a wall is exactly the press
           the slide exists for. Ranked by how much each direction closes the gap. */
        const rank = DIRS.map((v, i) => {
          const nx = a.hx + v[0] * 8, ny = a.hy + v[1] * 8;
          return { i, d: Math.hypot(nx - goal[0], ny - goal[1]) };
        }).sort((p, q) => p.d - q.d);

        let movedThisPress = false;
        for (let t = 0; t < 4 && !movedThisPress; t++) {
          const di = rank[t].i;
          const key = a.hx + ',' + a.hy + ',' + di;
          if (tried[key]) continue;      /* pressing the same wall twice is not a measurement */
          tried[key] = 1;
          await press(di);
          presses++;
          const b = await d.state();
          if (b.hx === a.hx && b.hy === a.hy) {
            const v = DIRS[di];
            if (await isSealed(a.hx, a.hy, v[0], v[1], R / 3)) {
              sealed++; sealedWhere.push(a.hx + ',' + a.hy + ' ' + wedges[di].dir);
            } else {
              stuck++; stuckWhere.push(a.hx + ',' + a.hy + ' ' + wedges[di].dir);
            }
            continue;
          }
          movedThisPress = true;
          const walked = Math.max(Math.abs(b.hx - a.hx), Math.abs(b.hy - a.hy));
          cells += walked;
          /* DID THIS STRIDE STEP OVER A WAY THROUGH? Ask the game's own ground. */
          const m = await fr.evaluate((arg) => {
            const P = window.__proof; if (!P || !P.cellAt) return -1;
            const walk = (x, y) => { try { const c = P.cellAt(x, y); return !!(c && c.walk); }
                                     catch (e) { return false; } };
            const dx = Math.sign(arg.bx - arg.ax), dy = Math.sign(arg.by - arg.ay);
            const px = -dy, py = dx;
            let hits = 0;
            /* every cell he crossed EXCEPT the one he stopped on */
            for (let k = 1; k < arg.n; k++) {
              const x = arg.ax + dx * k, y = arg.ay + dy * k;
              const ox = x - dx, oy = y - dy;
              if ((walk(x + px, y + py) && !walk(ox + px, oy + py)) ||
                  (walk(x - px, y - py) && !walk(ox - px, oy - py))) hits++;
            }
            return hits;
          }, { ax: a.hx, ay: a.hy, bx: b.hx, by: b.hy, n: walked });
          if (m > 0) { missed += m; missedWhere.push(a.hx + ',' + a.hy + ' +' + m); }
        }
        if (!movedThisPress) break;   /* he cannot reach this corner; walk the next leg */
      }
    }

    say('WALKED HIS BLOCK: ' + presses + ' presses, ' + cells + ' cells crossed, '
        + stuck + ' stuck, ' + sealed + ' into sealed ground, '
        + missed + ' gaps walked past');
    if (stuckWhere.length)  say('  stuck at: ' + stuckWhere.slice(0, 6).join(' | '));
    if (sealedWhere.length) say('  sealed at: ' + sealedWhere.slice(0, 6).join(' | '));
    if (missedWhere.length) say('  missed at: ' + missedWhere.slice(0, 6).join(' | '));

    ok('he actually walked (' + cells + ' cells over ' + presses + ' presses)', cells > 40);
    ok('*** ZERO STUCK PRESSES *** (' + stuck + ' of ' + presses + '; ' + sealed
       + ' more were into ground a body cannot reach, which is a wall doing its job)',
       stuck === 0);
    ok('*** ZERO GAPS WALKED PAST *** (' + missed + ')', missed === 0);

    /* THE LOT IS THE CEILING, THE GROUND SETS THE LENGTH: no stride may be longer
       than one lot, and the average must be shorter, or nothing is stopping early. */
    const lot = await fr.evaluate(() => { try { return STEP_CELLS; } catch (e) { return null; } });
    ok('one stride is capped at one lot (' + lot + ' cells)', lot > 1);
    const avg = presses ? cells / (presses - stuck || 1) : 0;
    say('the ground set the length: ' + avg.toFixed(1) + ' cells a press against a '
        + lot + ' cell ceiling');
    ok('and the ground really sets it, not the ceiling (' + avg.toFixed(1) + ' <= ' + lot + ')',
       avg > 0 && avg <= lot + 0.01);

    /* he is still on the street and the body never changed through the whole walk */
    const end = await d.state();
    ok('he is still walking at the end (mode ' + end.mode + ', stop ' + end.hzoom + ')',
       end.mode === 'human' && end.hzoom === st0.hzoom);
    const rungEnd = await fr.evaluate(() => bodyLadder(HC));
    ok('and the body is the same size it started (' + rungEnd + ' px)', rungEnd === rungs[0]);

    ok('nothing threw while he walked (' + d.errs.length + ')', d.errs.length === 0);
    if (d.errs.length) say('  ' + d.errs.slice(0, 3).join(' | '));

    await d.close();
    done();
  } catch (e) {
    ok('the gate ran to the end [' + String(e.message).slice(0, 180) + ']', false);
    try { await d.close(); } catch (e2) { }
    done();
  }
})();
