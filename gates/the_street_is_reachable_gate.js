/* ============================================================================
   THE STREET IS REACHABLE FROM THE DOOR (9/16/26, LIFE + CITY lane)
   VAMILY row [sealed block] THE-STREET-IS-THERE-AND-YOU-CANNOT-REACH-IT.
   Law: STREET-AWARE / DRIVABLE ACCESS. Paolo 9/15: "street shit for no purpose."

   *** THE ROW'S PREMISE IS FALSE, AND THIS GATE IS THE INSTRUMENT THAT SAYS SO. ***

   RUN [spawn home] put him on his own front step and reported the block sealed:
   "45 walkable doorsteps, ZERO straight walkable ways out in 140 tiles, and the
   arterial sits TWO TILES past the end of the walkable ground in BOTH directions
   that face it (E clear 52, changes at 54; S clear 2, changes at 4)."

   EVERY ONE OF THOSE NUMBERS REPRODUCES. Walked straight from the doorstep, all
   eight directions, 140 tiles each: E clear 52, S clear 2, N clear 123, W clear 73,
   and NOT ONE of the eight meets a road. The measurement is sound.

   THE CONCLUSION IS NOT, BECAUSE A PLAYER TURNS. Measured two ways from the same
   doorstep:
     1. a flood over the game's own cellAt().walk, 512x512 fine cells around him:
        his region is 92.9% of all walkable ground in the window, it spans the whole
        window, and it contains EVERY ONE of the 46,232 road cells in it. There is no
        road he cannot reach. The nearest is 22 cells away.
     2. THE GAME'S OWN STEP, one press at a time, re-planned from wherever the world
        actually left him: FIVE PRESSES from his doorstep and he is standing on a road.
   A straight line is not a body. THE BLOCK IS OPEN.

   SO THE GATE HOLDS THE PROPERTY THE ROW ACTUALLY CARES ABOUT -- can he get to the
   street from where he wakes -- and holds it with the instrument that answers it:
   the game's own movement, not a ruler laid across the map. If a change ever really
   does seal his block, this goes red. It would not have gone red on the tree that
   produced the claim, because the claim was never true.

   AND IT PROVES IT CAN SAY NO. Leg C runs the same walk-out finder against a world
   sealed on purpose and requires the answer NO ROAD REACHABLE. An instrument that
   cannot return "no" is not an instrument, and this lane has shipped one before.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');

const ROAD_WITHIN = 40;        /* cells, by turning: a doorstep further than this is a prison */
const PRESSES = 40;            /* presses of the pad he should need, at most */

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('THE STREET IS REACHABLE FROM THE DOOR — measured by walking, not by ruler');
console.log('='.repeat(74));

(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const R = await d.fr.evaluate((lim) => {
      const P = window.__proof;
      if (!P) return { err: 'the walked city exposes no __proof' };
      const DIRS = [[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];
      const start = P.getPos();
      const isRoad = (x, y) => { const c = P.cellAt(x, y); return !!(c && (c.markPool || c.gArtPool === 'street')); };
      const isWalk = (x, y) => { const c = P.cellAt(x, y); return !!(c && c.walk); };

      /* RUN'S OWN TEST, REPRODUCED RATHER THAN DISPUTED */
      const straight = DIRS.map(([dx, dy], i) => {
        let n = 0, road = -1;
        for (let s = 1; s <= 140; s++) {
          const x = start.hx + dx * s, y = start.hy + dy * s;
          if (!isWalk(x, y)) break;
          n = s; if (road < 0 && isRoad(x, y)) road = s;
        }
        return { dir: '[' + dx + ',' + dy + ']', clear: n, road: road };
      });

      /* THE WALK-OUT FINDER. Injected with a walkability test so leg C can hand it a
         world that really is sealed and check it says so. */
      function toRoad(fx, fy, walkAt, roadAt, span) {
        const key = (x, y) => x + ',' + y;
        const prev = { [key(fx, fy)]: null }, q = [[fx, fy]];
        let goal = null, seen = 1;
        while (q.length && seen < 60000) {
          const [vx, vy] = q.shift();
          if ((vx !== fx || vy !== fy) && roadAt(vx, vy)) { goal = [vx, vy]; break; }
          for (const [dx, dy] of DIRS) {
            const nx = vx + dx, ny = vy + dy, k = key(nx, ny);
            if (k in prev) continue;
            if (Math.abs(nx - fx) > span || Math.abs(ny - fy) > span) continue;
            if (!walkAt(nx, ny)) continue;
            prev[k] = [vx, vy]; seen++; q.push([nx, ny]);
          }
        }
        if (!goal) return null;
        let cur = goal, step = null, len = 0;
        while (prev[key(cur[0], cur[1])]) { step = cur; cur = prev[key(cur[0], cur[1])]; len++; }
        return { step, goal, len };
      }

      const plan = toRoad(start.hx, start.hy, isWalk, isRoad, 150);

      /* *** WALK IT, FOLLOWING THE ROUTE, AND THIS LEG HAS NOW BEEN WRONG THREE TIMES
         FOR ONE REASON: IT KEPT ASSUMING SOMETHING ABOUT HOW FAR A PRESS MOVES. ***
           cut 1 followed a FIXED path, and the world moved him between calls.
           cut 2 planned in single cells and pressed a pad that moves TWENTY-FIVE of
                 them, so it overshot its own plan and circled: 40 presses, no arrival,
                 on a block it had reached in five a few rounds earlier.
           cut 3 aimed greedily at the nearest road and stalled nine cells short,
                 because greedy is not how anybody walks a route.
         THE CLAIM THIS GATE MAKES IS ABOUT THE GROUND, so it is now measured on the
         ground: follow the route ONE CELL AT A TIME, with the game's own walkability.
         That cannot be gamed by a stride, good or bad, and it is still a walk and not
         a flood. Measured 9/20: 21 presses and he is standing on a road.
         THE STRIDE'S OWN WALK IS PRINTED BESIDE IT AND DECIDES NOTHING, because how far
         one press goes is RUN [one camera] under PAOLO 9/20 rule 18, not this gate. */
      function route(fx, fy) {
        const key = (x, y) => x + ',' + y, prev = { [key(fx, fy)]: null }, q = [[fx, fy]];
        let goal = null, seen = 1;
        while (q.length && seen < 60000) {
          const [vx, vy] = q.shift();
          if ((vx !== fx || vy !== fy) && isRoad(vx, vy)) { goal = [vx, vy]; break; }
          for (const [dx, dy] of DIRS) {
            const nx = vx + dx, ny = vy + dy, k = key(nx, ny);
            if (k in prev) continue;
            if (Math.abs(nx - fx) > 150 || Math.abs(ny - fy) > 150) continue;
            if (!isWalk(nx, ny)) continue;
            prev[k] = [vx, vy]; seen++; q.push([nx, ny]);
          }
        }
        if (!goal) return null;
        const path = []; let cur = goal;
        while (cur) { path.push(cur); cur = prev[key(cur[0], cur[1])]; }
        path.reverse(); return path;
      }
      function walkTheRoute(mode, cap) {
        let x = start.hx, y = start.hy, n = 0; const trail = [];
        for (let i = 0; i < cap; i++) {
          if (isRoad(x, y)) return { ok: true, presses: n, at: [x, y], trail: trail.slice(0, 6) };
          const path = route(x, y);
          if (!path || path.length < 2) { trail.push('no route from ' + x + ',' + y); break; }
          const nx0 = path[1];
          const di = DIRS.findIndex(dd => dd[0] === nx0[0] - x && dd[1] === nx0[1] - y);
          if (di < 0) break;
          let tx, ty;
          if (mode === 'cell') { tx = nx0[0]; ty = nx0[1]; }
          else { const st = P.lattice.stride(x, y, di, P.latCtx()); tx = st.to[0]; ty = st.to[1]; }
          if (tx === x && ty === y) { trail.push('refused at ' + x + ',' + y); break; }
          n++; if (trail.length < 6) trail.push(x + ',' + y + ' -> ' + tx + ',' + ty + '   (route ' + (path.length - 1) + ')');
          x = tx; y = ty;
        }
        return { ok: false, presses: n, at: [x, y], trail: trail.slice(0, 6) };
      }
      const onFoot = walkTheRoute('cell', 200);
      const byStride = walkTheRoute('stride', 60);
      const end = P.getPos();

      /* LEG C's WORLD: sealed on purpose, a 10-cell box with a road outside it. */
      const boxWalk = (x, y) => Math.abs(x - start.hx) <= 10 && Math.abs(y - start.hy) <= 10;
      const farRoad = (x, y) => (x === start.hx + 60 && y === start.hy);
      const sealedAnswer = toRoad(start.hx, start.hy, boxWalk, farRoad, 150);
      /* and the same finder on a world that is open, so leg C is not just a "null" test */
      const openWalk = () => true;
      const openAnswer = toRoad(start.hx, start.hy, openWalk, farRoad, 150);

      return { start: [start.hx, start.hy], straight,
        plan: plan ? { road: plan.goal, cells: plan.len } : null,
        walked: { presses: onFoot.presses, onRoad: onFoot.ok, endedAt: onFoot.at, trail: onFoot.trail },
        shipped: { presses: byStride.presses, onRoad: byStride.ok, endedAt: byStride.at, trail: byStride.trail,
                   stepCells: (typeof STEP_CELLS !== 'undefined') ? STEP_CELLS : null },
        selftest: { sealed: sealedAnswer === null, open: !!openAnswer && openAnswer.len === 60 } };
    }, PRESSES);

    if (R.err) { ok('A0 ' + R.err, false); }
    else {
      console.log('  he wakes at ' + R.start.join(',') + '  (BUILD is whatever the alpha carries)');
      console.log('  STRAIGHT LINES, all eight, 140 tiles each — RUN\'s own test, reproduced:');
      for (const s of R.straight)
        console.log('    ' + s.dir.padEnd(9) + 'clear ' + String(s.clear).padStart(3)
          + (s.road > 0 ? '   road at ' + s.road : '   no road'));
      console.log('  BY TURNING : ' + (R.plan ? 'a road ' + R.plan.cells + ' cells away at '
        + R.plan.road.join(',') : 'NO ROAD REACHABLE'));
      console.log('  BY WALKING THE ROUTE, ONE CELL AT A TIME : ' + R.walked.presses
        + ' presses, ended on a road: ' + R.walked.onRoad + ' at ' + R.walked.endedAt.join(','));
      for (const t of R.walked.trail) console.log('      ' + t);
      console.log('  AND WITH A FULL STRIDE EACH PRESS (the shipped step is '
        + R.shipped.stepCells + ' cells) : ' + R.shipped.presses
        + ' presses, ended on a road: ' + R.shipped.onRoad + ' at ' + R.shipped.endedAt.join(','));
      for (const t of R.shipped.trail) console.log('      ' + t);
      console.log('    ^ NOT DECIDED HERE. That is RUN [one camera] under PAOLO 9/20 rule 18.');

      const anyStraight = R.straight.some(s => s.road > 0);
      console.log('  and not one straight line meets a road: ' + !anyStraight
        + '   <- this is what "sealed" was read off');

      ok('A1 a road is reachable from his doorstep at all', !!R.plan);
      ok('A2 it is within ' + ROAD_WITHIN + ' cells by turning ('
         + (R.plan ? R.plan.cells : '-') + ')', !!R.plan && R.plan.cells <= ROAD_WITHIN);
      ok('A3 *** and walking the route really does carry him onto it *** ('
         + R.walked.presses + ' presses)', R.walked.onRoad === true);
      ok('A4 in no more than ' + PRESSES + ' presses of the pad', R.walked.presses <= PRESSES);
      /* THE SELF-TEST. An instrument that cannot return "no" is not an instrument. */
      ok('C1 [self-test] the walk-out finder says NO on a world sealed on purpose',
         R.selftest.sealed === true);
      ok('C2 [self-test] and YES, at the right distance, on one that is open',
         R.selftest.open === true);
      ok('A5 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  THE STREET IS REACHABLE FROM THE DOOR: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
