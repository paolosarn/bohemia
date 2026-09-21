/* ============================================================================
   THE WINDOW IS NOT A WALL (9/21/26, LIFE + CITY lane)
   Under PAOLO 9/20 rule 18 THE PLAYABLE CUT: a held lane measures its part of the
   three. This is WALKING, and it is the instrument every lane has been judging the
   ground with.

   *** AN INSTRUMENT THAT CANNOT SAY "I DO NOT KNOW" WILL SAY "NO". ***

   RUN [one camera] shipped the stride and closed its round with: "FOUND AND NOT
   FIXED, NOT MINE: five presses on his own block go into ground a body cannot reach
   (6270,6268 and 6270,6270)... the suburb generator seals yards."

   I went to size that, and my own first pass agreed and then was wrong in exactly the
   same shape. A flood in a 384-cell window around his door reported 6,094 walkable
   cells he cannot reach, in three islands -- one of them 5,690 cells with 1,652 cells
   of ROADWAY inside it, which reads like a whole street nobody can get to.

   RE-RUN WITHOUT THE WINDOW: 6,081 OF THOSE 6,094 ARE HIS OWN GROUND. The honest
   number is THIRTEEN cells, one 5x5 patch behind a chapel. A flood needs a limit or
   it runs for ever, and A LIMIT LOOKS EXACTLY LIKE A WALL FROM THE INSIDE.

   And the two cells RUN named measure as HIS OWN GROUND here, by a four-way flood and
   by an eight-way flood, so diagonals are not the difference either. Said as a
   measurement and not as a verdict on another lane's gate: if a flood is bounded, this
   is the shape that produces that sentence.

   SO THE LATTICE CARRIES THE TEST NOW, AND IT ANSWERS IN THREE STATES:
     joined            the same ground, and the walk found it
     closed            it ran out of GROUND, and never pressed the box edge: separate
     ranOut            it ran out of BUDGET, or closed against the box: UNKNOWN
   There is no bare false to misread. Leg B is those states on worlds with known
   answers, including the one that matters most: an endless wall in an endless world
   must come back UNKNOWN, never SEALED.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAT = require(path.join(ROOT, 'engine/bohemia_lattice.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('THE WINDOW IS NOT A WALL — a bounded flood calls its own edge a seal');
console.log('='.repeat(74));

/* ---- A. THE API CANNOT BE MISREAD -------------------------------------- */
ok('A1 the lattice carries the test', typeof LAT.reaches === 'function');
ok('A2 it refuses to guess at walkability', (() => {
  try { LAT.reaches(0, 0, 1, 1, {}); return false; } catch (e) { return /ctx\.walk/.test(e.message); }
})());

/* ---- B. WORLDS WITH KNOWN ANSWERS -------------------------------------- */
const open = { walk: () => true };
const wall = { walk: (x) => x !== 5 };                       /* endless wall, endless world */
const twoBoxes = { walk: (x, y) => (x >= 0 && y >= 0 && x < 4 && y < 4) || (x >= 20 && y >= 0 && x < 24 && y < 4) };

let r = LAT.reaches(0, 0, 10, 10, open, { box: 50 });
ok('B1 same ground, and it says so', r.joined === true && r.ranOut === false);
r = LAT.reaches(1, 1, 21, 1, twoBoxes, { box: 30 });
ok('B2 *** two sealed boxes: PROVED SEPARATE, because it never pressed the edge ***',
   r.joined === false && r.closed === true && r.ranOut === false && r.pressedEdge === 0);
r = LAT.reaches(0, 0, 10, 0, wall, { box: 20, cap: 100000 });
ok('B3 *** an endless wall in an endless world comes back UNKNOWN, never SEALED *** ('
   + r.why + ')', r.joined === false && r.closed === false && r.ranOut === true);
r = LAT.reaches(0, 0, 300, 300, open, { box: 400, cap: 50 });
ok('B4 out of budget is UNKNOWN too, and names itself',
   r.ranOut === true && r.closed === false && /BUDGET/.test(r.why));
r = LAT.reaches(0, 0, 5, 0, wall, { box: 20 });
ok('B5 a target that is not standable is answered, not flooded toward',
   r.closed === true && r.explored === 0 && /TARGET/.test(r.why));
r = LAT.reaches(5, 0, 0, 0, wall, { box: 20 });
ok('B6 and so is a start that is not standable', r.closed === true && /START/.test(r.why));
ok('B7 every answer carries the window it was taken in',
   Array.isArray(LAT.reaches(0, 0, 1, 1, open, { box: 9 }).box));
/* *** TO PROVE TWO THINGS ARE SEPARATE, FLOOD THE SMALL ONE. *** The first working
   version only flooded from the first point, so the answer depended on which end you
   named: out of his own street it presses the box edge thousands of times and can never
   close, and a thirteen-cell pocket came back UNKNOWN. Out of the pocket it closes in
   thirteen. Separation is symmetric, so the test tries the other end too. */
const pocket = { walk: (x, y) => (x >= 100 && x < 105 && y >= 100 && y < 105)
  ? true : !(x >= 99 && x <= 105 && y >= 99 && y <= 105) };
r = LAT.reaches(0, 0, 102, 102, pocket, { box: 400, cap: 300000 });
ok('B8 *** a tiny sealed pocket in a huge open world is PROVED, from the small end *** ('
   + r.from + ', ' + r.explored + ' explored)',
   r.closed === true && r.joined === false && r.from === 'TARGET' && r.explored < 100);
ok('B9 and it never turns an unknown into a yes',
   LAT.reaches(0, 0, 10, 0, wall, { box: 20, cap: 100000 }).joined === false);

/* ---- C. THE REAL SURFACE ----------------------------------------------- */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const P = window.__proof;
      if (!P || !P.lattice || !P.lattice.reaches) return { err: 'the walked city carries no reaches' };
      const L = P.lattice, ctx = P.latCtx(), p = P.getPos();
      /* THE BOUNDED FLOOD, the one that was wrong: a 384-cell window round his door */
      const W = 384, x0 = p.hx - (W >> 1), y0 = p.hy - (W >> 1);
      const walk = new Uint8Array(W * W);
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
        const c = P.cellAt(x0 + i, y0 + j);
        walk[j * W + i] = (c && c.walk) ? 1 : 0;
      }
      const comp = new Int32Array(W * W).fill(-1); const cells = []; let nc = 0;
      for (let s = 0; s < W * W; s++) {
        if (!walk[s] || comp[s] >= 0) continue;
        const q = [s]; comp[s] = nc; const mine = [];
        while (q.length) {
          const v = q.pop(); mine.push(v);
          const vx = v % W, vy = (v / W) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = vx + dx, ny = vy + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= W) continue;
            const w = ny * W + nx;
            if (walk[w] && comp[w] < 0) { comp[w] = nc; q.push(w); }
          }
        }
        cells.push(mine); nc++;
      }
      const his = comp[(W >> 1) * W + (W >> 1)];
      let boundedUnreachable = 0;
      const verdicts = [];
      for (let k = 0; k < nc; k++) {
        if (k === his) continue;
        boundedUnreachable += cells[k].length;
        if (cells[k].length < 5) continue;
        const v0 = cells[k][0], sx = x0 + (v0 % W), sy = y0 + ((v0 / W) | 0);
        const a = L.reaches(p.hx, p.hy, sx, sy, ctx, { box: 400, cap: 800000 });
        verdicts.push({ cells: cells[k].length, at: [sx, sy],
          joined: a.joined, closed: a.closed, ranOut: a.ranOut, why: a.why, explored: a.explored });
      }
      let provedSeparate = 0;
      for (const v of verdicts) if (v.closed && !v.joined) provedSeparate += v.cells;
      return { pos: [p.hx, p.hy], boundedUnreachable, verdicts, provedSeparate,
        /* the two cells RUN named, both floods */
        named: [[6270, 6268], [6270, 6270]].map(([x, y]) => {
          const c = P.cellAt(x, y);
          return { at: [x, y], walkable: !!(c && c.walk),
            same: (c && c.walk) ? L.reaches(p.hx, p.hy, x, y, ctx, { box: 400, cap: 800000 }).joined : null };
        }) };
    });

    if (m.err) ok('C0 ' + m.err, false);
    else {
      console.log('  MEASURED ON THE DEMO, AROUND THE BLOCK HE WAKES ON:');
      console.log('    a 384-cell window says he cannot reach : ' + m.boundedUnreachable + ' cells');
      for (const v of m.verdicts)
        console.log('      ' + String(v.cells).padStart(5) + ' cells at ' + v.at.join(',')
          + '  ->  ' + v.why + (v.joined ? '' : '   (' + v.explored + ' explored)'));
      console.log('    PROVED separate, unbounded            : ' + m.provedSeparate + ' cells');
      for (const n of m.named)
        console.log('    the cell RUN named ' + n.at.join(',') + ' : walkable ' + n.walkable
          + ', same ground as him ' + n.same);
      ok('C1 every island the window called sealed got a definite answer',
         m.verdicts.every(v => v.joined === true || (v.closed === true && v.ranOut === false)));
      ok('C2 *** and most of what the window called sealed is his own ground *** ('
         + m.provedSeparate + ' of ' + m.boundedUnreachable + ')',
         m.provedSeparate < m.boundedUnreachable);
      ok('C3 the cells RUN named are standable and are his own ground',
         m.named.every(n => n.walkable === true && n.same === true));
      ok('C4 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('C harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  THE WINDOW IS NOT A WALL: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
