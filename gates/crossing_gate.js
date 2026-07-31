/* CROSSING GATE (7/26/26, WORLD lane) — engine support the RUN lane asked for:
   "the run's block becomes a real cell of the generated valley so walking off it
   lands in a real neighbouring district."

   THE MISSING RUNG. bohemia_world.js could address a CELL and a PLOT, but there was
   no way to say "the tile at valley position X,Y", so nothing could walk from one
   cell into the next: every surface moved a body inside one plot and stopped at the
   edge. This gate covers the new rung — tile / solidAt / step / walk / route — and
   the property that matters: THE GROUND CONNECTS.

   Proves, headlessly:
     1. ONE IMPLEMENTATION. tile(gx,gy) agrees with plot(cell).tileInfo(tx,ty) for the
        same ground. The valley tile is a view onto the plot, never a second opinion.
     2. THE EDGE OF THE WORLD. Off-valley coordinates return null and read as solid,
        so nothing walks off the map.
     3. STEP REPORTS CROSSINGS. Stepping over a cell boundary reports which cell and
        which district it entered; stepping inside a cell reports none.
     4. THE CROSSING ITSELF. For real district / arterial / district sandwiches taken
        from the live valley, a body can walk from inside the first district, across
        the street, into the second, on non-solid ground the whole way. This is the
        one that failed the first time it ran: the arterial's tract wall was sealing
        the city out of its own streets, and the access breaks exist because this
        refused to pass without them.
     5. WALLS STILL BLOCK. Access is a break in the wall, not the loss of the wall:
        the block wall is still mostly wall, and mountain bedrock is still solid.
     6. DETERMINISM. Same route asked twice is the same path.

   Run: node gates/crossing_gate.js
   Registered in gates/bohemia_gates.py as CROSSING. */
'use strict';
const World = require('../engine/bohemia_world.js');
const E = require('../engine/bohemia_engine.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const w = World.world(E.WorldGen.hashSeed('bohemia'));
const T = w.TILE_PER_CELL;

// ---- 1. one implementation --------------------------------------------------
{
  let agree = 0, checked = 0;
  for (const [cx, cy] of [[33, 4], [33, 5], [12, 12], [40, 40]]) {
    const p = w.plot(cx, cy);
    if (!p || !p.tileInfo) continue;
    for (const [tx, ty] of [[0, 0], [64, 64], [127, 127], [10, 90]]) {
      checked++;
      const a = p.tileInfo(tx, ty), b = w.tile(cx * T + tx, cy * T + ty);
      if (b && a.code === b.code && a.solid === b.solid && a.layer === b.layer) agree++;
    }
  }
  ok('the valley tile is a view onto the plot, not a second opinion (' + agree + '/' + checked + ')',
     checked > 0 && agree === checked);
}

// ---- 2. the edge of the world ----------------------------------------------
ok('off-valley is null', w.tile(-1, 10) === null && w.tile(10, w.tiles) === null);
ok('off-valley reads as solid', w.solidAt(-1, 10) === true && w.solidAt(w.tiles, 0) === true);
ok('the valley is n*128 tiles square', w.tiles === w.n * T);

// ---- 3. step reports crossings ---------------------------------------------
{
  /* FIND WALKABLE GROUND, DO NOT ASSUME A COORDINATE (7/31).
     This hardcoded (33*T+64, 4*T+60) and assumed it was standing room. It was, on
     the suburb layout of the day it was written. Paolo's 7/31 rulings moved the
     furniture -- the sidewalk is laid before the houses now and driveways are 4x5 --
     and that exact tile became the inside of a GARAGE, so the probe stepped into a
     wall and this gate went red on its fixture rather than on crossing logic.
     The assertion is unchanged: a step that stays inside one cell must report no
     crossing. Only the search for a tile to stand on is now honest. */
  const gx = 33 * T + 64;
  let probeY = null;
  for (let ty = 20; ty < T - 20 && probeY === null; ty++) {
    const a = w.tile(gx, 4 * T + ty), b = w.tile(gx, 4 * T + ty + 1);
    if (a && b && !a.solid && !b.solid) probeY = 4 * T + ty;
  }
  ok('the probe found walkable ground inside cell 33,4', probeY !== null);
  const inside = w.step(gx, probeY, 0, 1);
  ok('a step inside a cell reports no crossing', inside.ok && !inside.crossed);
  // walk down the cell boundary from inside cell (33,4) into (33,5)
  let cur = { gx: gx, gy: 4 * T + 100 }, crossing = null;
  for (let i = 0; i < 60 && !crossing; i++) {
    const r = w.step(cur.gx, cur.gy, 0, 1);
    if (!r.ok) { cur.gy++; continue; }               // step over anything solid for this probe
    cur = { gx: r.gx, gy: r.gy };
    if (r.crossed) crossing = r.crossed;
  }
  ok('a step over the boundary names both cells and both districts',
     !!crossing && crossing.fromCell[1] + 1 === crossing.toCell[1] && !!crossing.toDistrict);
}

// ---- 4. THE CROSSING -------------------------------------------------------
function nearestOpen(gx, gy) {
  for (let r = 0; r < 50; r++) {
    for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
      const t = w.tile(gx + dx, gy + dy);
      if (t && !t.solid) return [gx + dx, gy + dy];
    }
  }
  return null;
}
{
  // real sandwiches out of the live valley: district / arterial / district
  const trips = [];
  for (let y = 1; y < w.n - 2 && trips.length < 4; y++) {
    for (let x = 1; x < w.n - 1 && trips.length < 4; x++) {
      const a = w.at(x, y), b = w.at(x, y + 1), c = w.at(x, y + 2);
      if (!a || !b || !c) continue;
      if (World.isAutoDistrict(a.district) && b.district === 'arterial' &&
          World.isAutoDistrict(c.district)) {
        if (trips.some(t => Math.abs(t[0] - x) < 6 && Math.abs(t[1] - y) < 6)) continue;
        trips.push([x, y, a.district, c.district]);
      }
    }
  }
  ok('the valley really has district / street / district sandwiches to test', trips.length >= 3);
  let crossed = 0;
  for (const [x, y, d0, d2] of trips) {
    const from = nearestOpen(x * T + 64, y * T + 118);
    const to = nearestOpen(x * T + 64, (y + 2) * T + 12);
    if (!from || !to) continue;
    const r = w.route(from[0], from[1], to[0], to[1], { maxNodes: 250000 });
    if (r && r.cells.length >= 3) crossed++;
    else console.log('    no walk from ' + d0 + ' (' + x + ',' + y + ') to ' + d2 +
                     ' across the street' + (r ? ' (route stayed in ' + r.cells.length + ' cells)' : ''));
  }
  ok('a body can walk district -> street -> district on real ground (' +
     crossed + '/' + trips.length + ')', crossed === trips.length);
}

// ---- 5. walls still block ---------------------------------------------------
{
  const ART = require('../engine/bohemia_arterial.js');
  const sealed = ART.generate(5, { links: ['N', 'S'], access: [] });
  const opened = ART.generate(5, { links: ['N', 'S'], access: ['E', 'W'] });
  const wallOf = g => { let n = 0; g.forEach(r => r.forEach(v => { if (v === 8) n++; })); return n; };
  const sealedWall = wallOf(sealed.g), openedWall = wallOf(opened.g);
  ok('access cuts a break in the wall (' + sealedWall + ' -> ' + openedWall + ')',
     openedWall < sealedWall);
  ok('and it is a break, not the loss of the wall', openedWall > sealedWall * 0.6);
  // the mountain is still the edge of the world
  let rock = null;
  for (let y = 0; y < w.n && !rock; y++) for (let x = 0; x < w.n; x++) {
    const c = w.at(x, y);
    if (c && c.district === 'mountain') {
      const t = w.tile(x * T + 64, y * T + 64);
      if (t && t.solid) { rock = t; break; }
    }
  }
  ok('mountain bedrock is still solid ground nobody walks through', !!rock);
}

// ---- 6. determinism ---------------------------------------------------------
{
  const a = w.route(33 * T + 64, 4 * T + 118, 33 * T + 64, 5 * T + 60, { maxNodes: 120000 });
  const b = w.route(33 * T + 64, 4 * T + 118, 33 * T + 64, 5 * T + 60, { maxNodes: 120000 });
  ok('the same route asked twice is the same path',
     JSON.stringify(a && a.path) === JSON.stringify(b && b.path));
}

// ---- 7. THE WALK SURFACE: the player the RUN lane asked for -----------------
/* Engine support request 2 of 2. The run had no player in a loop scheduler, so its
   walking was the block sim's clock and not the game's turn. This proves the whole
   chain end to end: boot the real loop, stand a player on real ground, ask the world
   for a route, and walk it one committed turn per step, across two cell boundaries. */
{
  const Loop = require('../engine/bohemia_loop.js');
  const ctx = Loop.boot({ seed: 'bohemia' });
  ok('a booted context carries a walk surface', !!ctx.walk && !!ctx.walk.player);
  ok('the player never starts inside a wall', !w.solidAt(ctx.walk.player.tile.x, ctx.walk.player.tile.y));

  let trip = null;
  for (let y = 1; y < w.n - 2 && !trip; y++) for (let x = 1; x < w.n - 1; x++) {
    const a = w.at(x, y), b = w.at(x, y + 1), c = w.at(x, y + 2);
    if (a && b && c && World.isAutoDistrict(a.district) && b.district === 'arterial' &&
        World.isAutoDistrict(c.district)) { trip = [x, y]; break; }
  }
  const walk = Loop.makeWalkSurface(ctx, { gx: trip[0] * T + 64, gy: trip[1] * T + 110 });
  ok('a walk surface can be stood anywhere in the valley', !!walk && !!walk.where());

  const before = walk.scheduler.turn;
  const waited = walk.commit(0, 0);
  ok('a wait banks a turn and moves nobody', !waited.moved && walk.scheduler.turn === before + 1);

  const r = walk.routeTo(trip[0] * T + 64, (trip[1] + 2) * T + 16, { maxNodes: 250000 });
  ok('the surface can route from where it stands', !!r && r.cells.length >= 3);
  if (r) {
    const f = walk.follow(r.path);
    ok('it walks the route one committed turn per step (' + f.steps + ' steps)',
       f.steps === r.path.length - 1 && !f.stoppedAt);
    ok('the world turn advanced once per step', walk.scheduler.turn === before + 1 + f.steps);
    const names = f.crossings.map(c => c.fromDistrict + '->' + c.toDistrict);
    ok('and it crossed two real boundaries on the way (' + names.join(', ') + ')',
       f.crossings.length >= 2);
    ok('it ended up where the route said it would',
       walk.where().cellX === trip[0] && walk.where().cellY === trip[1] + 2);
  }
  ok('the cell-space scheduler is untouched by the walk surface',
     ctx.scheduler !== walk.scheduler && !ctx.scheduler.actors.some(a => a === walk.player));
}

console.log('CROSSING GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
