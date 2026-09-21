/* BOHEMIA SEALED YARDS PROBE (9/21/26, LIFE + CITY, row [sealed yards]).

   THE CLAIM, handed over by RUN 930e2bf3 and carried in the row:
     "45 doorsteps with 0 straight walkable ways out; the suburb generator seals
      yards behind one-cell walls."

   THE SHIP TEST ON THE ROW: every doorstep on his block has a walkable way to
   the road, measured on the cut.

   A STRAIGHT WAY OUT IS NOT A WAY OUT. A body turns corners. The 45/0 number is
   a RAY cast in eight directions (gates/first_minute_gate.js), and a ray says
   nothing about whether a yard is sealed -- it says the street is not in line of
   sight, which on a suburb block full of houses is the normal case, not a defect.
   This lane has hit that same shape three times now:
       an instrument that cannot return "no" is not an instrument    (9/15)
       A STRAIGHT LINE IS NOT A BODY                                 (9/16)
       an instrument that cannot say "I do not know" will say "no"   (9/21)

   So this measures BOTH, side by side, on the surface he plays: the ray the claim
   was made with, and the walk a body actually takes (BOH_LATTICE.reaches, which
   answers in three states and can say I DO NOT KNOW).

   Run from repo root:  node tools/bohemia_sealed_yards_probe.js
*/
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

(async () => {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open();
  const m = await d.fr.evaluate(() => {
    const P = window.__proof;
    if (!P || !P.lattice || !P.lattice.reaches) return { err: 'no reaches on the cut' };
    const L = P.lattice, ctx = P.latCtx(), p = P.getPos();
    const FNv = P.FN;
    const isRoad = (qx, qy) => {
      try {
        const t = P.om.at(Math.floor(qx / FNv), Math.floor(qy / FNv));
        return !!(t && /arterial|freeway|beltway|strip|interchange|road/.test(String(t.district)));
      } catch (e) { return false; }
    };
    /* THE DOORSTEP RING, built the way the cut's own homeDoorstep() builds it:
       the band of cells one step outside the house footprint. */
    const h = (typeof homeFind === 'function') ? homeFind() : null;
    if (!h) return { err: 'the cut has no homeFind()' };
    const ring = [];
    if (h.door) ring.push([h.door[0], h.door[1] + 1], [h.door[0], h.door[1] - 1],
                          [h.door[0] - 1, h.door[1]], [h.door[0] + 1, h.door[1]]);
    for (let x = h.x - 1; x <= h.x + h.w; x++) { ring.push([x, h.y + h.h]); ring.push([x, h.y - 1]); }
    for (let y = h.y - 1; y <= h.y + h.h; y++) { ring.push([h.x - 1, y]); ring.push([h.x + h.w, y]); }
    const seen = {}, steps = [];
    for (const t of ring) {
      const k = t[0] + ',' + t[1];
      if (seen[k]) continue; seen[k] = 1;
      const c = P.cellAt(t[0], t[1]);
      if (c && c.walk) steps.push(t);
    }
    /* THE NEAREST ROAD CELL, found by a real flood out of his own position, so the
       target is somewhere a body has actually stood, not a guess off a district tag. */
    let road = null;
    (function () {
      const q = [[p.hx, p.hy]], seenq = { }; seenq[p.hx + ',' + p.hy] = 1; let n = 0;
      while (q.length && n < 200000) {
        const v = q.shift(); n++;
        if (isRoad(v[0], v[1])) { road = v; return; }
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = v[0] + dx, ny = v[1] + dy, kk = nx + ',' + ny;
          if (seenq[kk]) continue;
          const c = P.cellAt(nx, ny);
          if (!c || !c.walk) continue;
          seenq[kk] = 1; q.push([nx, ny]);
        }
      }
    })();
    if (!road) return { err: 'no road cell anywhere he can walk' };

    const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    const out = [];
    for (const s of steps) {
      /* THE RAY the claim was made with: a straight walkable line to a road, 140 cells */
      let ray = false;
      for (let i = 0; i < 8 && !ray; i++) {
        for (let k = 1; k <= 140; k++) {
          const c = P.cellAt(s[0] + DIRS[i][0] * k, s[1] + DIRS[i][1] * k);
          if (!c || !c.walk) break;
          if (isRoad(s[0] + DIRS[i][0] * k, s[1] + DIRS[i][1] * k)) { ray = true; break; }
        }
      }
      /* THE WALK a body takes */
      const a = L.reaches(s[0], s[1], road[0], road[1], ctx, { box: 400, cap: 800000 });
      out.push({ at: s, ray: ray, joined: a.joined, closed: a.closed, ranOut: a.ranOut,
                 why: a.why, explored: a.explored });
    }
    /* ---- AND THE WHOLE BLOCK, not just his own house ----------------------
       The row says "every doorstep on HIS BLOCK". A block is one overmap cell,
       128 fine cells on a side. A doorstep is any walkable cell touching a cell
       a body cannot stand on -- that is a superset of every real doorstep on the
       block and it needs nothing out of the generator's insides.
       ONE FLOOD FIRST, THEN THE THREE-STATE TEST ON WHAT IT MISSED: flooding
       once out of the road is what tells you which cells even need asking, and
       only those get the unbounded reaches(), so the expensive honest instrument
       runs where it matters instead of 16,384 times. */
    const bx0 = Math.floor(p.hx / FNv) * FNv, by0 = Math.floor(p.hy / FNv) * FNv;
    const B = FNv;
    const bw = new Uint8Array(B * B);
    for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) {
      const c = P.cellAt(bx0 + i, by0 + j);
      bw[j * B + i] = (c && c.walk) ? 1 : 0;
    }
    const doors = [];
    for (let j = 0; j < B; j++) for (let i = 0; i < B; i++) {
      if (!bw[j * B + i]) continue;
      let touchesWall = false;
      for (let dy = -1; dy <= 1 && !touchesWall; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = i + dx, ny = j + dy;
        const w = (nx < 0 || ny < 0 || nx >= B || ny >= B) ? 1 : bw[ny * B + nx];
        if (!w) { touchesWall = true; break; }
      }
      if (touchesWall) doors.push([bx0 + i, by0 + j]);
    }
    /* the one flood, out of HIS OWN position, unbounded in the block */
    const reach = {}; {
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
    /* THE THREE-STATE TEST, unbounded, on every doorstep the flood did not touch */
    const blockVerdicts = missed.map(t => {
      const a = L.reaches(t[0], t[1], road[0], road[1], ctx, { box: 400, cap: 800000 });
      return { at: t, joined: a.joined, closed: a.closed, ranOut: a.ranOut,
               why: a.why, explored: a.explored, from: a.from };
    });

    return { pos: [p.hx, p.hy], house: [h.x, h.y, h.w, h.h], road: road, steps: out,
             block: [bx0, by0, B], blockDoors: doors.length,
             blockMissed: missed.length, blockVerdicts: blockVerdicts };
  });
  await d.close();
  if (m.err) { console.log('PROBE: ' + m.err); process.exit(1); }

  const n = m.steps.length;
  const rays = m.steps.filter(s => s.ray).length;
  const walks = m.steps.filter(s => s.joined).length;
  const unknown = m.steps.filter(s => !s.joined && s.ranOut).length;
  const sealed = m.steps.filter(s => !s.joined && s.closed && !s.ranOut);
  console.log('SEALED YARDS, MEASURED ON THE CUT');
  console.log('  he wakes at                         : ' + m.pos.join(','));
  console.log('  his house                           : ' + m.house.join(',') + ' (x,y,w,h)');
  console.log('  the nearest road he can walk to     : ' + m.road.join(','));
  console.log('  walkable doorsteps round the house  : ' + n);
  console.log('  ---- the two instruments ----');
  console.log('  STRAIGHT ways out (a ray, 140 cells): ' + rays + ' of ' + n);
  console.log('  WALKABLE ways out (a body walking)  : ' + walks + ' of ' + n);
  console.log('  UNKNOWN (ran out of budget)         : ' + unknown);
  console.log('  PROVED SEALED                       : ' + sealed.length);
  for (const s of sealed.slice(0, 8))
    console.log('      ' + s.at.join(',') + '  ' + s.why + ' (' + s.explored + ' explored)');
  const ex = m.steps.find(s => s.joined && !s.ray);
  if (ex) console.log('  an example of the difference        : ' + ex.at.join(',')
    + ' has NO straight way out and walks to the road anyway');

  console.log('  ---- AND THE WHOLE BLOCK (one overmap cell, ' + m.block[2] + ' cells a side) ----');
  console.log('  block origin                        : ' + m.block[0] + ',' + m.block[1]);
  console.log('  doorstep-shaped cells on the block  : ' + m.blockDoors);
  console.log('  ones one flood did not reach        : ' + m.blockMissed);
  const bj = m.blockVerdicts.filter(v => v.joined).length;
  const bs = m.blockVerdicts.filter(v => !v.joined && v.closed && !v.ranOut);
  const bu = m.blockVerdicts.filter(v => !v.joined && v.ranOut).length;
  console.log('    of those, walk to the road anyway : ' + bj);
  console.log('    PROVED SEALED                     : ' + bs.length);
  console.log('    UNKNOWN                           : ' + bu);
  for (const v of bs.slice(0, 12))
    console.log('      ' + v.at.join(',') + '  ' + v.why + ' (' + v.explored
      + ' explored, from ' + v.from + ')');
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
