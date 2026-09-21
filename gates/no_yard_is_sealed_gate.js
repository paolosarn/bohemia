/* ============================================================================
   NO YARD IS SEALED (9/21/26, LIFE + CITY lane, row [sealed yards])
   Under PAOLO 9/20 rule 18 THE PLAYABLE CUT: this is WALKING, so it ships.

   *** A STRAIGHT WAY OUT IS NOT A WAY OUT. A BODY TURNS CORNERS. ***

   THE CLAIM, handed to this lane by RUN 930e2bf3 and written into the row:
     "45 doorsteps with 0 straight walkable ways out; the suburb generator seals
      yards behind one-cell walls."

   The suburb generator is this lane's, so: size it. The 45/0 number is a RAY cast
   in eight directions across 140 cells. A ray tells you whether the street is in
   LINE OF SIGHT. On a suburb block full of houses, it almost never is, and that is
   what a suburb IS -- not a defect. It says nothing about whether a yard is sealed.

   MEASURED ON THE CUT, both instruments side by side, from his own doorsteps:
       STRAIGHT ways out (the ray)           7 of 68
       WALKABLE ways out (a body walking)   68 of 68
       PROVED SEALED                         0
   and then the whole block he wakes on, every walkable cell that touches a cell a
   body cannot stand on, which is a superset of every real doorstep there is:
       doorstep-shaped cells on the block  1,857
       ones one flood out of his door misses   0
       PROVED SEALED                           0

   THE SUBURB GENERATOR DOES NOT SEAL YARDS. It is the fourth time this window that
   an instrument, not the world, was the thing that was broken:
       an instrument that cannot return "no" is not an instrument        (9/15)
       a straight line is not a body                                     (9/16)
       an instrument that assumes a step length measures its assumption  (9/20)
       an instrument that cannot say "I do not know" will say "no"       (9/21)

   AND A GATE THAT ONLY EVER SAYS ZERO IS NOT A GATE. Leg A seals a yard on purpose,
   in worlds with known answers, and this gate has to catch every one of them before
   its zero on the real block is allowed to mean anything.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAT = require(path.join(ROOT, 'engine/bohemia_lattice.js'));

let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}
console.log('='.repeat(74));
console.log('  NO YARD IS SEALED  ·  LIFE + CITY  ·  row [sealed yards]');
console.log('='.repeat(74));

/* ---- A. IT CATCHES A YARD THAT REALLY IS SEALED ------------------------- */
console.log('  A. a sealed yard on a world with a known answer');

/* A BACK YARD THAT IS REALLY SHUT: the house is its north side, fences are the
   other three, and the ONE cell of gap is a side gate at x=9 -- OFF the straight
   line to the road, which is where a real garden gate is. A hedge across y=30
   with its own gap at x=20 means no ray out of the yard can ever see the road,
   and a body walks out in two turns. Getting this world wrong the first time is
   the whole reason leg A exists: my first cut left the yard open at the top on
   both sides of the house, and the gate said SAME GROUND and was right. */
function suburb(gapOpen) {
  return {
    walk: function (x, y) {
      if (x < 0 || y < 0 || x > 60 || y > 60) return false;
      if (x >= 7 && x <= 23 && y >= 10 && y <= 16) return false;      /* the house */
      if (y === 24 && x >= 6 && x <= 24) return gapOpen && x === 9;   /* the back fence */
      if (x === 6 && y >= 10 && y <= 24) return false;                /* the side fences */
      if (x === 24 && y >= 10 && y <= 24) return false;
      if (y === 30) return x === 20;                                  /* the hedge, one gap */
      return true;
    }
  };
}
const YARD = [15, 20];          /* standing in the back yard */
const ROAD = [30, 40];          /* the road, outside the fence */

const shut = LAT.reaches(YARD[0], YARD[1], ROAD[0], ROAD[1], suburb(false), { box: 200, cap: 400000 });
ok('A1 a yard fenced all the way round is PROVED SEALED, not guessed ('
   + shut.why + ', ' + shut.explored + ' explored, from ' + shut.from + ')',
   shut.joined === false && shut.closed === true && shut.ranOut === false);
ok('A2 and it proves it by flooding the small side, in under 200 cells looked at',
   shut.explored < 200);

const open = LAT.reaches(YARD[0], YARD[1], ROAD[0], ROAD[1], suburb(true), { box: 200, cap: 400000 });
ok('A3 ONE cell of gap in that same fence and the yard walks out (' + open.why + ')',
   open.joined === true);

/* and the ray, on the very same two worlds, gets both of them wrong in the way
   the claim was made: it cannot see the road from the yard either way. */
function ray(ctx, sx, sy, isRoad) {
  const D = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  for (let i = 0; i < 8; i++)
    for (let k = 1; k <= 140; k++) {
      if (!ctx.walk(sx + D[i][0] * k, sy + D[i][1] * k)) break;
      if (isRoad(sx + D[i][0] * k, sy + D[i][1] * k)) return true;
    }
  return false;
}
const isRoad = (x, y) => (y >= 38 && y <= 42);
ok('A4 *** and a RAY calls the yard with the gap sealed too ***, which is how the '
   + 'claim was made', ray(suburb(true), YARD[0], YARD[1], isRoad) === false);
ok('A5 so the two instruments disagree on a world where the answer is known, and the '
   + 'walk is the one that is right', open.joined === true);

/* a yard whose only way out is a diagonal squeeze: a body takes it */
const squeeze = {
  walk: function (x, y) {
    if (x < 0 || y < 0 || x > 60 || y > 60) return false;
    if (x >= 7 && x <= 23 && y >= 10 && y <= 16) return false;
    if (x === 6 && y >= 10 && y <= 24) return false;
    if (x === 24 && y >= 10 && y <= 24) return false;
    if (y === 24 && x >= 6 && x <= 24) return x === 9;   /* the one gap */
    if (y === 25) return x === 10;   /* straight on from the gap is shut, diagonal is not */
    if (y === 30) return x === 20;
    return true;
  }
};
ok('A6 a way out that is only a diagonal squeeze is still a way out',
   LAT.reaches(YARD[0], YARD[1], ROAD[0], ROAD[1], squeeze, { box: 200, cap: 400000 }).joined === true);

/* an endless empty world must never come back SEALED: UNKNOWN is the honest answer */
const endless = { walk: function (x, y) { return y !== 24; } };
const e = LAT.reaches(15, 20, 30, 40, endless, { box: 40, cap: 20000 });
ok('A7 an endless wall in an endless world comes back UNKNOWN, never SEALED ('
   + e.why + ')', e.joined === false && !(e.closed === true && e.ranOut === false));

/* ---- B. THE BLOCK HE ACTUALLY WAKES ON --------------------------------- */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const m = await d.fr.evaluate(() => {
      const P = window.__proof;
      if (!P || !P.lattice || !P.lattice.reaches) return { err: 'the walked city carries no reaches' };
      const L = P.lattice, ctx = P.latCtx(), p = P.getPos(), FNv = P.FN;
      const isRoad = (qx, qy) => {
        try {
          const t = P.om.at(Math.floor(qx / FNv), Math.floor(qy / FNv));
          return !!(t && /arterial|freeway|beltway|strip|interchange|road/.test(String(t.district)));
        } catch (e) { return false; }
      };
      /* the nearest road cell a body has actually walked to, not a district tag */
      let road = null;
      {
        const q = [[p.hx, p.hy]], seen = {}; seen[p.hx + ',' + p.hy] = 1; let n = 0;
        while (q.length && n < 200000 && !road) {
          const v = q.shift(); n++;
          if (isRoad(v[0], v[1])) { road = v; break; }
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = v[0] + dx, ny = v[1] + dy, kk = nx + ',' + ny;
            if (seen[kk]) continue;
            const c = P.cellAt(nx, ny);
            if (!c || !c.walk) continue;
            seen[kk] = 1; q.push([nx, ny]);
          }
        }
      }
      if (!road) return { err: 'no road cell anywhere he can walk' };

      /* HIS OWN HOUSE, the doorstep ring the cut's own homeDoorstep() walks */
      const h = (typeof homeFind === 'function') ? homeFind() : null;
      if (!h) return { err: 'the cut has no homeFind()' };
      const ring = [], seenr = {}, steps = [];
      if (h.door) ring.push([h.door[0], h.door[1] + 1], [h.door[0], h.door[1] - 1],
                            [h.door[0] - 1, h.door[1]], [h.door[0] + 1, h.door[1]]);
      for (let x = h.x - 1; x <= h.x + h.w; x++) { ring.push([x, h.y + h.h]); ring.push([x, h.y - 1]); }
      for (let y = h.y - 1; y <= h.y + h.h; y++) { ring.push([h.x - 1, y]); ring.push([h.x + h.w, y]); }
      for (const t of ring) {
        const k = t[0] + ',' + t[1];
        if (seenr[k]) continue; seenr[k] = 1;
        const c = P.cellAt(t[0], t[1]);
        if (c && c.walk) steps.push(t);
      }
      const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      let rays = 0; const houseV = [];
      for (const s of steps) {
        let r = false;
        for (let i = 0; i < 8 && !r; i++)
          for (let k = 1; k <= 140; k++) {
            const c = P.cellAt(s[0] + DIRS[i][0] * k, s[1] + DIRS[i][1] * k);
            if (!c || !c.walk) break;
            if (isRoad(s[0] + DIRS[i][0] * k, s[1] + DIRS[i][1] * k)) { r = true; break; }
          }
        if (r) rays++;
        const a = L.reaches(s[0], s[1], road[0], road[1], ctx, { box: 400, cap: 800000 });
        houseV.push({ at: s, joined: a.joined, closed: a.closed, ranOut: a.ranOut });
      }

      /* THE WHOLE BLOCK: every walkable cell touching one a body cannot stand on.
         ONE FLOOD FIRST, then the three-state test on only what it missed -- the
         expensive honest instrument runs where it matters, not 16,384 times. */
      const bx0 = Math.floor(p.hx / FNv) * FNv, by0 = Math.floor(p.hy / FNv) * FNv, B = FNv;
      const bw = new Uint8Array(B * B);
      for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) {
        const c = P.cellAt(bx0 + i, by0 + j);
        bw[j * B + i] = (c && c.walk) ? 1 : 0;
      }
      const doors = [];
      for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) {
        if (!bw[j * B + i]) continue;
        let t = false;
        for (let dy = -1; dy <= 1 && !t; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = i + dx, ny = j + dy;
          const w = (nx < 0 || ny < 0 || nx >= B || ny >= B) ? 1 : bw[ny * B + nx];
          if (!w) { t = true; break; }
        }
        if (t) doors.push([bx0 + i, by0 + j]);
      }
      const reach = {};
      {
        const q = [[p.hx, p.hy]]; reach[p.hx + ',' + p.hy] = 1;
        while (q.length) {
          const v = q.pop();
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = v[0] + dx, ny = v[1] + dy, kk = nx + ',' + ny;
            if (reach[kk]) continue;
            if (nx < bx0 - 8 || ny < by0 - 8 || nx > bx0 + B + 8 || ny > by0 + B + 8) continue;
            const c = P.cellAt(nx, ny);
            if (!c || !c.walk) continue;
            reach[kk] = 1; q.push([nx, ny]);
          }
        }
      }
      const missed = doors.filter(t => !reach[t[0] + ',' + t[1]]);
      const blockV = missed.map(t => {
        const a = L.reaches(t[0], t[1], road[0], road[1], ctx, { box: 400, cap: 800000 });
        return { at: t, joined: a.joined, closed: a.closed, ranOut: a.ranOut,
                 why: a.why, explored: a.explored };
      });
      return { pos: [p.hx, p.hy], house: [h.x, h.y, h.w, h.h], road: road,
               steps: steps.length, rays: rays, houseV: houseV,
               block: [bx0, by0, B], doors: doors.length, missed: missed.length,
               blockV: blockV };
    });

    console.log('  B. the block he wakes on, measured on the cut');
    if (m.err) ok('B0 ' + m.err, false);
    else {
      const hj = m.houseV.filter(v => v.joined).length;
      const hs = m.houseV.filter(v => !v.joined && v.closed && !v.ranOut).length;
      const bj = m.blockV.filter(v => v.joined).length;
      const bs = m.blockV.filter(v => !v.joined && v.closed && !v.ranOut);
      const bu = m.blockV.filter(v => !v.joined && v.ranOut).length;
      console.log('    he wakes at ' + m.pos.join(',') + ', his house '
        + m.house.join(',') + ', nearest road he can walk to ' + m.road.join(','));
      console.log('    HIS OWN HOUSE');
      console.log('      walkable doorsteps                : ' + m.steps);
      console.log('      STRAIGHT ways out (the ray)       : ' + m.rays + ' of ' + m.steps);
      console.log('      WALKABLE ways out (a body)        : ' + hj + ' of ' + m.steps);
      console.log('      PROVED SEALED                     : ' + hs);
      console.log('    THE WHOLE BLOCK (' + m.block[2] + ' cells a side, from '
        + m.block[0] + ',' + m.block[1] + ')');
      console.log('      doorstep-shaped cells             : ' + m.doors);
      console.log('      ones one flood did not reach      : ' + m.missed);
      console.log('      of those, walk to the road anyway : ' + bj);
      console.log('      PROVED SEALED                     : ' + bs.length);
      console.log('      UNKNOWN                           : ' + bu);
      for (const v of bs.slice(0, 12))
        console.log('        ' + v.at.join(',') + '  ' + v.why + ' (' + v.explored + ' explored)');

      ok('B1 there are doorsteps to test at all (' + m.steps + ')', m.steps >= 8);
      ok('B2 *** EVERY DOORSTEP OF HIS HOUSE WALKS TO THE ROAD *** (' + hj + ' of '
         + m.steps + ')', hj === m.steps && m.steps > 0);
      ok('B3 *** AND NO DOORSTEP ON THE WHOLE BLOCK IS SEALED *** (' + bs.length
         + ' of ' + m.doors + ')', bs.length === 0);
      ok('B4 and none of them came back UNKNOWN, so the zero is measured and not a '
         + 'shrug (' + bu + ')', bu === 0);
      ok('B5 the ray disagrees, which is the finding: it sees a way out from only '
         + m.rays + ' of ' + m.steps + ' doorsteps', m.rays < m.steps);
      ok('B6 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('B harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  NO YARD IS SEALED: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
