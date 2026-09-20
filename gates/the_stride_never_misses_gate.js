/* ============================================================================
   THE STRIDE NEVER MISSES (9/20/26, LIFE + CITY lane)
   PAOLO 9/20, LOCKED, rule 18 THE PLAYABLE CUT, for RUN [one camera].
   laws/BOHEMIA_ADDENDUM_THE_PLAYABLE_CUT_9_20_26.md

   "I'm zooming out and my person becomes bigger... walking the same distance and
    crashing into walls because it's forcing me to move like 67 tiles at a time, so
    when I'm trying to walk past the wall it's not allowing me to because I'm just
    missing it."

   RUN [one camera] asks this lane for the landing rule by name: "a press moves him to
   the next standable place toward the press using LIFE+CITY's landing rule, never past
   a gap, never into a wall, a press toward a wall slides along it, any gap a body fits
   through is walkable; the lot is the CEILING of a stride, the ground sets its length."
   This is that rule and this is the number on it.

   MEASURED ON THE DEMO, 80 PRESSES AROUND THE BLOCK HE WAKES ON. The live stride today
   is a fixed 25 cells, which is one cell MORE than a whole lot:

                        stuck   moved   cells   slid   at a gap   places
     what ships today      46      34     804      0          0       23
     the landing rule       0      80    1625     27          8       69

   FORTY-SIX OF EIGHTY PRESSES DO NOTHING TODAY. That is his sentence with a number on
   it, and it is more than half of them. Under the landing rule none of them do nothing,
   which is RUN's own ship test for the row.

   THE PART THAT ANSWERS "I'M JUST MISSING IT" IS THE SLIDE, AND IT TOOK THREE GOES:
     one tier of 45 degrees      -- useless against a straight wall: press east at a
                                    north-south wall and NE and SE are just as blocked.
     two tiers, longest run wins -- slides a WHOLE LOT sideways, which is his complaint
                                    again in a different coat: it carries him past the
                                    doorway he was aiming at.
     stop at the gap             -- a slide ends the moment the direction he PRESSED
                                    opens up again, so he finishes lined up with the way
                                    through and the next press takes it.
   Leg B is that behaviour on a world with a known answer, so it cannot rot quietly.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAT = require(path.join(ROOT, 'engine/bohemia_lattice.js'));
const F = LAT.LOT_FINE;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('THE STRIDE NEVER MISSES — one press, the ground sets its length');
console.log('='.repeat(74));

/* ---- A. THE RULE IS THERE AND IT IS ONE RULE ---------------------------- */
ok('A1 the lattice carries a stride', typeof LAT.stride === 'function');
ok('A2 it refuses to guess at walkability', (() => {
  try { LAT.stride(0, 0, 2, {}); return false; } catch (e) { return /ctx\.walk/.test(e.message); }
})());

/* ---- B. A WORLD WITH A KNOWN ANSWER ------------------------------------- */
const E = 2, S = 4, N = 0;
const wallNS = { walk: (x, y) => !(x === 10 && y !== 0) };   /* wall at x=10, doorway at y=0 */
const solid = { walk: (x) => x !== 10 };                      /* the same wall, no doorway */
const openAll = { walk: () => true };
const oneCell = { walk: (x, y) => x === 0 && y === 0 };
const box = { walk: (x, y) => x >= 0 && y >= 0 && x < 3 && y < 3 };

let r = LAT.stride(0, 0, E, openAll);
ok('B1 open ground: a press runs exactly one lot and says so (' + r.cells + ')',
   r.cells === F && r.why === 'LOT');
r = LAT.stride(0, 3, E, wallNS);
ok('B2 *** it stops at the last standable cell, never in the wall *** (' + r.cells + ')',
   r.cells === 9 && r.to[0] === 9 && r.why === 'GROUND');
r = LAT.stride(9, 0, E, wallNS);
ok('B3 a one-cell doorway is a doorway: it walks straight through (' + r.cells + ')',
   r.cells === F && r.why === 'LOT');
r = LAT.stride(9, 3, E, wallNS);
ok('B4 *** pressed at the wall, it slides to the gap and stops there *** ('
   + r.cells + ' cells, ' + r.why + ')',
   r.why === 'SLID_TO_THE_GAP' && r.to[0] === 9 && r.to[1] === 0 && r.cells === 3);
r = LAT.stride(9, 20, E, wallNS);
ok('B5 and from further away it still stops at that gap, not past it',
   r.why === 'SLID_TO_THE_GAP' && r.to[1] === 0);
r = LAT.stride(9, 3, E, solid);
ok('B6 a wall with no gap: it makes its way along and does not pretend to be stuck',
   r.why === 'SLID_ALONG' && r.cells === F);
r = LAT.stride(0, 0, E, oneCell);
ok('B7 nowhere to go: it says STUCK rather than inventing a cell',
   r.cells === 0 && r.why === 'STUCK' && r.to[0] === 0 && r.to[1] === 0);
r = LAT.stride(2, 1, E, box);
ok('B8 boxed in: it still finds the one cell it can use', r.cells === 1);
/* the same press must always do the same thing */
ok('B9 one press, one answer, every time',
   JSON.stringify(LAT.stride(9, 3, E, wallNS)) === JSON.stringify(LAT.stride(9, 3, E, wallNS)));
/* a slide must never be the direction he pressed */
r = LAT.stride(3, 9, S, { walk: (x, y) => y !== 10 });
ok('B10 a press into an east-west wall slides along it, not through it',
   r.cells > 0 && r.dir !== S);

/* ---- C. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const P = window.__proof;
      if (!P || !P.lattice || !P.lattice.stride) return { err: 'the walked city carries no stride' };
      const L = P.lattice, ctx = P.latCtx(), p = P.getPos();
      const walk = (x, y) => { const c = P.cellAt(x, y); return !!(c && c.walk); };
      const STEP = (typeof STEP_CELLS !== 'undefined') ? STEP_CELLS : null;
      const script = [];
      for (let r2 = 0; r2 < 2; r2++) for (const i of [2, 4, 6, 0]) for (let k = 0; k < 10; k++) script.push(i);
      function today(x, y, i) {
        const dd = L.DIRS[i]; let n = 0, cx = x, cy = y;
        for (let k = 0; k < (STEP || 5); k++) {
          const nx = cx + dd[0], ny = cy + dd[1];
          if (!walk(nx, ny)) break;
          cx = nx; cy = ny; n++;
        }
        return { x: cx, y: cy, n: n };
      }
      /* NEITHER WALK MOVES THE PLAYER. Both run on a copy of his position, so this
         measures the rule and never the game's own step. */
      function go(mode) {
        let x = p.hx, y = p.hy, stuck = 0, cells = 0, slid = 0, lined = 0,
            intoAWall = 0, overALot = 0; const seen = {};
        for (const i of script) {
          let nx, ny, n, why;
          if (mode === 'today') { const t = today(x, y, i); nx = t.x; ny = t.y; n = t.n; why = t.n ? 'GROUND' : 'STUCK'; }
          else { const s = L.stride(x, y, i, ctx); nx = s.to[0]; ny = s.to[1]; n = s.cells; why = s.why; }
          if (n === 0) stuck++; else cells += n;
          if (/^SLID/.test(why)) slid++;
          if (why === 'SLID_TO_THE_GAP') lined++;
          if (n > 0 && !walk(nx, ny)) intoAWall++;
          if (n > L.LOT_FINE) overALot++;
          x = nx; y = ny; seen[x + ',' + y] = 1;
        }
        return { presses: script.length, stuck, cells, slid, lined, intoAWall, overALot,
                 places: Object.keys(seen).length };
      }
      return { start: [p.hx, p.hy], STEP, LOT_FINE: L.LOT_FINE,
               today: go('today'), rule: go('stride') };
    });

    if (m.err) ok('C0 ' + m.err, false);
    else {
      console.log('  MEASURED ON THE DEMO, 80 PRESSES AROUND THE BLOCK HE WAKES ON:');
      console.log('    he wakes at ' + m.start.join(',') + ', today a press is '
        + m.STEP + ' cells, the lot ceiling is ' + m.LOT_FINE);
      const row = (n, o) => '    ' + n.padEnd(20) + String(o.stuck).padStart(6)
        + String(o.cells).padStart(9) + String(o.slid).padStart(7)
        + String(o.lined).padStart(10) + String(o.places).padStart(9);
      console.log('    ' + 'walk'.padEnd(20) + ' stuck    cells   slid   at a gap   places');
      console.log(row('what ships today', m.today));
      console.log(row('the landing rule', m.rule));
      ok('C1 *** not one press of eighty does nothing *** (' + m.rule.stuck + ' stuck)',
         m.rule.stuck === 0);
      ok('C2 *** no stride ever lands in a wall *** (' + m.rule.intoAWall + ')',
         m.rule.intoAWall === 0);
      ok('C3 and none is longer than a lot (' + m.rule.overALot + ')', m.rule.overALot === 0);
      ok('C4 he actually gets around (' + m.rule.places + ' places, today ' + m.today.places + ')',
         m.rule.places > m.today.places);
      ok('C5 the walked city carries the same rule this gate tested',
         m.LOT_FINE === LAT.LOT_FINE);
      ok('C6 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('C harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  THE STRIDE NEVER MISSES: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
