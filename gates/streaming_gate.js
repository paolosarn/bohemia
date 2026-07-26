/* STREAMING GATE (7/26/26, WORLD lane) — the valley has to be walkable on a phone,
   not just correct on a workstation.

   THE PROBLEM THIS FIXES. bohemia_world.js cached every plot it ever built in a plain
   object that only grew. A plot measures ~190 KB, so a body walking across the valley
   climbed toward ~1.8 GB and the phone died long before the far side. The mobile render
   contract has a memory clause; this was the thing that would have broken it.

   Proves, headlessly:
     1. BOUNDED. Touch far more cells than the cap and the cache still holds at most the
        cap. This is the one that would have caught the original leak.
     2. EVICTION IS FREE, BECAUSE THE WORLD IS DETERMINISTIC. A cell evicted and then
        regenerated is byte-identical. If that ever stopped being true, streaming would
        be a corruption bug instead of an optimisation, so it is checked directly.
     3. THE STREAM WARMS AHEAD. stream() builds the ring around a position and no-ops
        when the hot set has not moved.
     4. NO HITCH AT THE BOUNDARY. Walking a real route across two cell boundaries, the
        steps that actually CROSS are not the expensive ones, because the ground was
        warmed while the body was still in the previous cell. Measured on the real walk
        surface, not asserted.
     5. THE WALK STAYS BOUNDED. Over that whole walk the cache never exceeds the cap.

   HONEST RESIDUAL, recorded rather than hidden: the first touch of a fresh cell still
   costs ~40 ms on this machine, and it happens on whatever step triggers the warm. That
   is one spike per cell entered (roughly one per 128 steps), off the crossing itself.
   Getting it off the critical path entirely means generating in an idle callback or a
   worker, which is a SURFACE concern (the run/city renderers own their frame loop), not
   a world-model one. The gate bounds it rather than pretending it is zero.

   Run: node gates/streaming_gate.js
   Registered in gates/bohemia_gates.py as STREAMING. */
'use strict';
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');
const Loop = require('../engine/bohemia_loop.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const w = World.world(E.WorldGen.hashSeed('bohemia'));
const T = w.TILE_PER_CELL;

// ---- 1. bounded -------------------------------------------------------------
{
  ok('the world reports its cache', typeof w.cacheStats === 'function');
  const cap = w.cacheStats().cap;
  ok('there is a real cap (' + cap + ' cells)', cap > 8 && cap < 4096);
  for (let i = 0; i < cap * 3; i++) w.plot(10 + (i % 30), 20 + Math.floor(i / 30));
  const st = w.cacheStats();
  ok('touching ' + (cap * 3) + ' cells holds at most the cap (' + st.held + '/' + cap + ')',
     st.held <= cap);
  ok('and it really did evict (' + st.evictions + ')', st.evictions > 0);
}

// ---- 2. eviction is free because the world is deterministic ------------------
{
  const before = JSON.stringify(w.plot(41, 41).block.grid);
  for (let i = 0; i < w.cacheStats().cap * 2; i++) w.plot(60 + (i % 20), 60 + Math.floor(i / 20));
  const after = JSON.stringify(w.plot(41, 41).block.grid);
  ok('an evicted cell regenerates byte-identical', before === after);
}

// ---- 3. the stream warms ahead ----------------------------------------------
{
  const first = w.stream(50 * T + 64, 50 * T + 64, { radius: 1 });
  ok('stream warms the ring around a position', first.warmed > 0 || first.held > 0);
  const again = w.stream(50 * T + 70, 50 * T + 70, { radius: 1 });
  ok('and no-ops while the hot set has not moved', again.moved === false && again.warmed === 0);
  const moved = w.stream(53 * T + 64, 50 * T + 64, { radius: 1 });
  ok('and warms again once it has', moved.moved === true);
}

// ---- 4 + 5. no hitch at the boundary, on the real walk surface ---------------
{
  const ctx = Loop.boot({ seed: 'bohemia' });
  const rw = ctx.worldMap.real;
  let trip = null;
  for (let y = 1; y < rw.n - 2 && !trip; y++) for (let x = 1; x < rw.n - 1; x++) {
    const a = rw.at(x, y), b = rw.at(x, y + 1), c = rw.at(x, y + 2);
    if (a && b && c && World.isAutoDistrict(a.district) && b.district === 'arterial' &&
        World.isAutoDistrict(c.district)) { trip = [x, y]; break; }
  }
  ok('found a real route to walk', !!trip);
  const walk = Loop.makeWalkSurface(ctx, { gx: trip[0] * T + 64, gy: trip[1] * T + 110 });
  const r = walk.routeTo(trip[0] * T + 64, (trip[1] + 2) * T + 16, { maxNodes: 250000 });
  ok('the route crosses cells', !!r && r.cells.length >= 3);

  const cost = [], crossingCost = [];
  let worstHeld = 0;
  for (let i = 1; i < r.path.length; i++) {
    const dx = r.path[i][0] - walk.player.tile.x, dy = r.path[i][1] - walk.player.tile.y;
    const t0 = process.hrtime.bigint();
    const res = walk.commit(dx, dy);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    cost.push(ms);
    if (res.crossed) crossingCost.push(ms);
    worstHeld = Math.max(worstHeld, rw.cacheStats().held);
  }
  const sorted = cost.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const worst = sorted[sorted.length - 1];
  const worstCrossing = crossingCost.length ? Math.max.apply(null, crossingCost) : 0;

  ok('the walk actually crossed boundaries (' + crossingCost.length + ')', crossingCost.length >= 2);
  ok('a crossing step is cheap: it was warmed in advance (' + worstCrossing.toFixed(2) + ' ms)',
     worstCrossing < 5);
  ok('the median step is effectively free (' + median.toFixed(3) + ' ms)', median < 1);
  /* The bound, not a pretence of zero: one cell-warm spike is allowed, and it is
     recorded in the gate's own header so nobody mistakes it for solved. */
  ok('the worst single step stays inside one cell-warm (' + worst.toFixed(1) + ' ms)', worst < 120);
  ok('the cache stayed bounded for the whole walk (' + worstHeld + '/' + rw.cacheStats().cap + ')',
     worstHeld <= rw.cacheStats().cap);
  console.log('  walked ' + (r.path.length - 1) + ' steps: median ' + median.toFixed(3) +
              ' ms, worst ' + worst.toFixed(1) + ' ms, crossings ' +
              crossingCost.map(c => c.toFixed(2)).join('/') + ' ms');
}

console.log('STREAMING GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
