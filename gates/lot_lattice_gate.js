/* ============================================================================
   WHERE A STEP MAY LAND (9/15/26, LIFE + CITY lane)
   VAMILY row [lot lattice], under PAOLO 9/15 rule 16 THE STEP IS A HOUSE
   (laws/BOHEMIA_ADDENDUM_THE_STEP_IS_A_HOUSE_9_15_26.md).

   "however long it takes right now to walk the length of a house, that would be
    done in one step."

   THE LAW'S SECTION 3 ENDS: "ONE NUMBER IN ONE PLACE. The scale... lives in one
   constant that the street, the fight, the bodies, the zoom seam and the reach
   module all read. NOTHING IS BAKED ONCE. A SECOND COPY ANYWHERE IS THE BUG."
   A law without a machine gate is not enforced, so leg A is that sentence as a
   checker: the number in engine/bohemia_lattice.js must equal the lot stride the
   suburb generator actually packs houses on, and if it ever stops matching, this
   goes red and names both numbers.

   WHY THAT BIND AND NOT A HARDCODED 24. The row this gate answers said "a lot is
   FN=32 fine cells" and so did RUN's copy of it. FN is 128, and the 7/6 VALLEY
   SCALE LAW calls one FN cell A NEIGHBOURHOOD, NOT A LOT, in those words. The real
   lot was already in the repo, in the thing that draws houses: widest model plus
   gap. Pinning 24 here would freeze a number nobody could check. Reading the
   generator means the day somebody widens a house model, this fails and says so.

   AND LEG C IS THE PART THAT WOULD ROT QUIETLY. The lattice is only honest if a
   coarser step does not cut the world into islands a body cannot walk between. That
   is a property of the ground the generator makes, so it is measured on the demo,
   driven like a player, with the game's own walkability test -- never asserted from
   the source. Measured 9/15 at the door: fine-scale island 83.5%, lot-scale island
   94.1%, and the lot lattice came out MORE connected in every district measured,
   because a lot step crosses a one-cell fence gap a fine step has to walk around.
   The floor below is set under the worst of those, not over the best.

   THE SLOW HALF IS THE POINT. tools/bohemia_lot_lattice_probe.js is the same
   measurement with a report; this is the floor under it.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const LAT = require(path.join(ROOT, 'engine/bohemia_lattice.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('WHERE A STEP MAY LAND — one step is one lot, and the world stays whole');
console.log('='.repeat(74));

/* ---- A. THE ONE NUMBER -------------------------------------------------- */
const SUB = fs.readFileSync(path.join(ROOT, 'engine/bohemia_suburb.js'), 'utf8');
const mTile = SUB.match(/TILE\s*=\s*([0-9.]+)/);
const mGap = SUB.match(/GAP\s*=\s*(\d+)/);
const mModels = SUB.match(/var\s+MODELS\s*=\s*\[([\s\S]*?)\]\s*;/);
/* AN INSTRUMENT THAT CANNOT RETURN "NO" IS NOT AN INSTRUMENT. If any of the three
   reads comes back empty, this leg FAILS rather than skipping: a silent skip is how
   a gate goes green over a file it never actually read. */
ok('A1 the suburb generator still declares TILE, GAP and MODELS',
   !!(mTile && mGap && mModels));
if (mTile && mGap && mModels) {
  const widths = [...mModels[1].matchAll(/w\s*:\s*M\(\s*([0-9.]+)\s*\)/g)].map(m => +m[1]);
  ok('A2 the model table still has widths (found ' + widths.length + ')', widths.length > 0);
  const tile = +mTile[1];
  const maxW = Math.max(...widths.map(w => Math.round(w / tile)));
  const lotw = maxW + (+mGap[1]);
  console.log('  the suburb packs houses every ' + lotw + ' fine cells ('
    + (lotw * tile).toFixed(1) + ' m): widest model ' + maxW + ' + gap ' + mGap[1]);
  console.log('  the lattice says one step is ' + LAT.LOT_FINE + ' fine cells ('
    + LAT.LOT_M + ' m)');
  ok('A3 LOT_FINE is the suburb\'s own lot stride (' + LAT.LOT_FINE + ' vs ' + lotw + ')',
     LAT.LOT_FINE === lotw);
  ok('A4 the metre per cell matches the overmap (' + LAT.CELL_M + ' vs ' + tile + ')',
     LAT.CELL_M === tile);
}

/* ---- B. NO SECOND COPY -------------------------------------------------- */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const ENG = fs.readFileSync(path.join(ROOT, 'engine/bohemia_lattice.js'), 'utf8');
/* THE NEEDLE IS BUILT, NOT WRITTEN. gates/bohemia_sync_gate.py finds a module's
   carriers by looking for that exact string, so spelling it in one piece here made
   this checker look like a third carrier of the lattice and put the ENGINE SYNC LAW
   in violation on the run that added it. A checker must not be findable as the thing
   it checks. */
const NEEDLE = 'const ' + 'BOH_' + 'LATTICE=';
function grabBody(src) {
  const i = src.indexOf(NEEDLE);
  if (i < 0) return null;
  let d = 0, started = false;
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (c === '{') { d++; started = true; }
    else if (c === '}') { d--; if (started && d === 0) return src.slice(i, k + 1); }
  }
  return null;
}
const eBody = grabBody(ENG), cBody = grabBody(CITY);
ok('B1 the engine carries the lattice', !!eBody);
ok('B2 the walked city carries it too', !!cBody);
ok('B3 exactly one body in the walked city',
   CITY.split(NEEDLE).length - 1 === 1);
ok('B4 the two bodies are the same body (ENGINE SYNC LAW)', !!eBody && eBody === cBody);
/* the constant is DEFINED once and nowhere else in the repo */
const defs = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    if (f === '.git' || f === 'node_modules' || f === '__pycache__' || f === 'archive') continue;
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    /* A DEFINITION, NOT A READ. `const LOT_FINE = require(...).LOT_FINE` is a tool
       reading the one number, which is the whole point of having one; only a literal
       is a second copy. The first cut of this leg failed on its own probe tool. */
    else if (/\.(js|html)$/.test(f) && /const\s+LOT_FINE\s*=\s*[0-9]/.test(fs.readFileSync(p, 'utf8')))
      defs.push(path.relative(ROOT, p));
  }
})(ROOT);
ok('B5 LOT_FINE is defined in the lattice and its carriers only -> ' + defs.join(', '),
   defs.length > 0 && defs.every(p => /bohemia_lattice\.js$/.test(p) || /^slices\//.test(p)));

/* ---- C. THE RULES, ON A WORLD WITH A KNOWN ANSWER ----------------------- */
const F = LAT.LOT_FINE;
/* a 3x3 lot world: lot (1,1) is a solid building; one road line runs through lot row 1 */
const mk = () => ({
  walk: (x, y) => {
    if (x < 0 || y < 0 || x >= 3 * F || y >= 3 * F) return false;
    return !(Math.floor(x / F) === 1 && Math.floor(y / F) === 1);
  },
  road: (x, y) => y === F + (F >> 1),
  cache: {}
});
const ctx = mk();
ok('C1 a lot that is solid has no landing', LAT.landing(1, 1, ctx) === null);
ok('C2 a landing on the road line, not the lot centre',
   JSON.stringify(LAT.landing(0, 1, ctx)) === JSON.stringify([F >> 1, F + (F >> 1)]));
ok('C3 with no road in the lot, the landing is nearest the centre',
   JSON.stringify(LAT.landing(0, 0, ctx)) === JSON.stringify([F >> 1, F >> 1]));
ok('C4 a step into a solid lot is refused', LAT.stepLegal(0, 1, 1, 1, ctx) === false);
ok('C5 a step to a lot that does not touch is refused', LAT.stepLegal(0, 1, 2, 1, ctx) === false);
ok('C6 a step across open ground is offered', LAT.stepLegal(0, 0, 0, 1, ctx) === true);
ok('C7 the ways out of a corner lot are the open ones only',
   JSON.stringify(LAT.stepsFrom(0, 0, ctx)) === JSON.stringify([[1, 0], [0, 1]]));
ok('C8 a tap inside a building arrives on the nearest lot that has a landing',
   !!LAT.arrive(F + 5, F + 5, ctx));
/* A WALL BETWEEN TWO LOTS IS NOT A STEP. Two lots, open ground, one solid column on the
   shared edge: the landings are both fine and the step must still be refused. */
const walled = {
  walk: (x, y) => {
    if (x < 0 || y < 0 || x >= 2 * F || y >= F) return false;
    return x !== F && x !== F - 1;                       /* a two-cell wall on the seam */
  },
  cache: {}
};
ok('C9 two open lots with a wall on the seam: both have landings',
   !!LAT.landing(0, 0, walled) && !!LAT.landing(1, 0, walled));
ok('C10 and the step between them is refused', LAT.stepLegal(0, 0, 1, 0, walled) === false);
/* NOTHING WALKABLE ANYWHERE: arrive must say no rather than invent a doorstep */
const dead = { walk: () => false, cache: {} };
ok('C11 a world with no ground anywhere hands back null, it does not guess',
   LAT.arrive(10, 10, dead, 3) === null);
/* THE CLOCK IS DERIVED, NEVER TYPED */
ok('C12 the clock per step is the lot over the walking speed',
   LAT.minutesPerStep(9) === LAT.LOT_M / 9);
ok('C13 no speed, no answer', LAT.minutesPerStep(0) === null && LAT.minutesPerStep('x') === null);
ok('C14 travel gets faster by the multiple', LAT.stepMultiple(1) === F);
ok('C15 the body is half a lot tall by default', LAT.bodyPx(48) === 24 && LAT.BODY_LOTS === 0.5);
ok('C16 standing on the landing is standing on the lattice',
   LAT.onLattice(F >> 1, F >> 1, ctx) === true && LAT.onLattice((F >> 1) + 1, F >> 1, ctx) === false);
/* DETERMINISM: a fresh context must answer the same cell, or the street and the fight
   would each land him somewhere else in the same lot. */
ok('C17 a fresh context answers the same landing',
   JSON.stringify(LAT.landing(2, 2, mk())) === JSON.stringify(LAT.landing(2, 2, mk())));

/* ---- D. THE WALKED CITY ACTUALLY READS IT ------------------------------- */
ok('D1 the walked city builds the lattice one context and only one',
   (CITY.match(/function latCtx\(\)/g) || []).length === 1);
ok('D2 the city tap arrives through the lattice',
   /BOH_LATTICE\.arrive\(/.test(CITY));
ok('D3 the lattice is published where other lanes can read it',
   /__proof=\{om,cellAt,lattice:BOH_LATTICE,latCtx,/.test(CITY));

/* ---- E. THE REAL SURFACE ------------------------------------------------ */
(async () => {
  let d = null;
  try {
    const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
    d = await D.open();
    const m = await d.fr.evaluate((L) => {
      const P = window.__proof;
      if (!P || !P.lattice) return { err: 'the walked city publishes no lattice' };
      const LA = P.lattice, ctx = P.latCtx(), p = P.getPos();
      const W = L * 16, n = 16, x0 = p.hx - (W >> 1), y0 = p.hy - (W >> 1);
      const walk = new Uint8Array(W * W);
      for (let j = 0; j < W; j++) for (let i = 0; i < W; i++) {
        let c = null; try { c = P.cellAt(x0 + i, y0 + j); } catch (e) {}
        walk[j * W + i] = (c && c.walk) ? 1 : 0;
      }
      let fineBig = 0; const fs2 = new Uint8Array(W * W);
      for (let s = 0; s < W * W; s++) {
        if (!walk[s] || fs2[s]) continue;
        const q = [s]; fs2[s] = 1; let sz = 0;
        while (q.length) { const v = q.pop(); sz++; const vx = v % W, vy = (v / W) | 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue;
            const nx = vx + dx, ny = vy + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= W) continue;
            const w2 = ny * W + nx; if (walk[w2] && !fs2[w2]) { fs2[w2] = 1; q.push(w2); } } }
        if (sz > fineBig) fineBig = sz;
      }
      const l0 = LA.lotOf(x0, y0);
      const adj = []; for (let i = 0; i < n * n; i++) adj.push([]);
      let stand = 0;
      for (let ly = 0; ly < n; ly++) for (let lx = 0; lx < n; lx++)
        if (LA.landing(l0[0] + lx, l0[1] + ly, ctx)) stand++;
      for (let ly = 0; ly < n; ly++) for (let lx = 0; lx < n; lx++) {
        const a = ly * n + lx;
        for (const s of LA.stepsFrom(l0[0] + lx, l0[1] + ly, ctx)) {
          const mx = s[0] - l0[0], my = s[1] - l0[1];
          if (mx < 0 || my < 0 || mx >= n || my >= n) continue;
          adj[a].push(my * n + mx);
        }
      }
      const ls = new Uint8Array(n * n); let lotBig = 0;
      for (let s = 0; s < n * n; s++) {
        if (ls[s] || !LA.landing(l0[0] + (s % n), l0[1] + ((s / n) | 0), ctx)) continue;
        const q = [s]; ls[s] = 1; let sz = 0;
        while (q.length) { const v = q.pop(); sz++; for (const w of adj[v]) if (!ls[w]) { ls[w] = 1; q.push(w); } }
        if (sz > lotBig) lotBig = sz;
      }
      const arr = LA.arrive(p.hx, p.hy, ctx);
      const ac = arr ? P.cellAt(arr[0], arr[1]) : null;
      return { LOT_FINE: LA.LOT_FINE, onLattice: LA.onLattice(p.hx, p.hy, ctx),
        arriveWalkable: !!(arr && ac && ac.walk),
        arrivals: window.__LATTICE_ARRIVALS || 0,
        waysOut: LA.stepsFrom(LA.lotOf(p.hx, p.hy)[0], LA.lotOf(p.hx, p.hy)[1], ctx).length,
        finePct: +(100 * fineBig / (W * W)).toFixed(1),
        standPct: +(100 * stand / (n * n)).toFixed(1),
        lotPct: +(100 * lotBig / (n * n)).toFixed(1) };
    }, LAT.LOT_FINE);
    if (m.err) ok('E0 ' + m.err, false);
    else {
      console.log('  MEASURED ON THE DEMO, DRIVEN LIKE A PLAYER, AT THE DOOR:');
      console.log('    one step            : ' + m.LOT_FINE + ' fine cells');
      console.log('    he stands on a node : ' + m.onLattice + '  (the door is RUN\'s, so this may be false)');
      console.log('    lattice arrivals    : ' + m.arrivals + '  (0 at the door is correct)');
      console.log('    arrive() answers    : ' + m.arriveWalkable);
      console.log('    ways out of his lot : ' + m.waysOut + ' of 8');
      console.log('    biggest island fine : ' + m.finePct + '%');
      console.log('    lots standable      : ' + m.standPct + '%');
      console.log('    biggest island lots : ' + m.lotPct + '%');
      /* E1 IS THE OPPOSITE OF WHAT IT SAID ON THE FIRST CUT, AND THE MEASUREMENT IS WHY.
         Snapping the drop-in also ran once at boot, moved his spawn eight cells, and
         reddened three of this lane's own checkers on the screen he wakes to (903 of
         903 cells drawing bank art fell to 892; walks meeting a crowd fell 13 of 16 to
         8). Rule 14: the first five minutes is the only measure. And the door is RUN's
         anyway -- [spawn home] is claimed right now. So the check is that the lattice
         LEAVES THE DOOR ALONE, and a lane that later starts snapping it goes red here. */
      ok('E1 the lattice does not move the door (' + m.arrivals + ' arrivals at boot)',
         m.arrivals === 0);
      ok('E2 the lattice can answer from where he wakes', m.arriveWalkable === true);
      ok('E3 he can step somewhere from where he wakes (' + m.waysOut + ')', m.waysOut >= 2);
      ok('E3b the lot he wakes on is standable at all', m.standPct > 50);
      /* THE FLOOR, set under the 9/15 measurement (94.1% lot against 83.5% fine), not
         over it. Two ways to go red: the lattice fragments (absolute floor), or it
         fragments RELATIVE to the fine world, which catches a world that got worse
         while the ratio looked fine. */
      ok('E4 the lot lattice is one island, not islands (' + m.lotPct + '% >= 70%)', m.lotPct >= 70);
      ok('E5 and it is no worse than walking it one cell at a time ('
         + m.lotPct + '% vs ' + m.finePct + '%)', m.lotPct >= m.finePct - 5);
      ok('E6 nothing threw' + (d.errs.length ? ' -> ' + d.errs[0] : ''), d.errs.length === 0);
    }
  } catch (e) {
    ok('E harness ran: ' + e.message, false);
  }
  if (d) await d.close();
  console.log('='.repeat(74));
  console.log('  WHERE A STEP MAY LAND: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
