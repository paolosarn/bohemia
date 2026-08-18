#!/usr/bin/env node
/* RETREAT GATE (8/18/26, WORLD lane) — a room you cannot back out of has no fight in it.
 *
 * laws/BOHEMIA_ADDENDUM_THE_RF4_LIFT_8_17_26.md §6, quoting his synthesis:
 *
 *   "if your combat loop requires retreat, your level generator has a HARD OBLIGATION to
 *    guarantee retreat is possible... combat design and map generation are the same system
 *    wearing two hats. A CRAMPED ROOM DELETES THE ENTIRE CORE VERB."
 *
 * That is an obligation on WORLD, and it is exactly the kind that never announces itself
 * breaking: every room generates, every existing gate stays green, and the fight is quietly
 * worse everywhere forever for a reason nobody can point at. This is the thing that points.
 *
 * WHAT RETREAT MEANS HERE, WHICH IS NOT WHAT IT MEANS IN RF4. §3 C4 of the same law: RF4's
 * retreat works because enemies must CLOSE, so distance is safety. WITH GUNS ON BOTH SIDES
 * DISTANCE IS NOT SAFETY, LINE OF SIGHT IS — running twelve tiles down an open hall is a
 * longer shot, not an escape. So the question asked from every floor cell is the gun-native
 * one: CAN I REACH SOMEWHERE THEY CANNOT SEE ME? Binary, no invented radius.
 *
 * WHAT IT FOUND ON ITS FIRST RUN, and it is a clean break rather than a smear:
 *
 *     6x6, 8x8, 10x10   ONE ROOM, every time, 94% of the floor with nowhere to hide
 *     12x10             1.3 rooms, two thirds of plans still strand somebody
 *     16x14             3.6 rooms, 6 of 54 plans strand somebody
 *     20x16 and up      EVERY CELL of EVERY plan in EVERY zone has a retreat
 *
 * THE SMALL PLATES ARE A REAL FAILURE AND THE FIX IS NOT MORE WALLS. A 6x6 plate is 4.5 m
 * square — a shed. Partitioning a shed to satisfy a gate would be inventing architecture
 * that does not exist to win a number, and REALISM FIRST says no. Cover in a small room
 * comes from what is IN it — a counter, shelving, a pallet stack, a vehicle — which is
 * `meta.pending: "furniture per role"`, sitting in the floorplan generator as a TODO string
 * since July. This gate is what turns that string into a load-bearing combat requirement
 * with a number attached.
 *
 * SO THE OBLIGATION IS ASSERTED WHERE THE ARCHITECTURE CAN CARRY IT AND RATCHETED WHERE IT
 * CANNOT. Above the break point it is absolute and may never regress. The break point
 * itself is a ratchet: it may only ever come DOWN. A gate that demanded the impossible
 * today would be switched off by the next session that hit it.
 *
 *   node gates/retreat_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}

const FP = require(path.join(ROOT, 'engine/bohemia_floorplan.js'));
const R = require(path.join(ROOT, 'engine/bohemia_retreat.js'));
const ZONES = Object.keys(FP.ZONES);
const SEEDS = [1, 2, 3, 4, 5, 6];

console.log('RETREAT GATE — "a cramped room deletes the entire core verb"\n');

/* ── 0. THE READER MATCHES THE WRITER ──────────────────────────────────────────
   The first version of the measure invented a cell field the generator does not have and
   reported NINE ZONES AT ZERO CELLS — a clean sweep of total failure, stated with perfect
   confidence, that was entirely the reader's fault. A measurement of nothing is not a
   result, so the shape check comes before every number below. */
console.log('THE READER MATCHES THE WRITER');
{
  const p = FP.plate(12345, 16, 14, { zone: 'office' });
  let floors = 0, walls = 0, doors = 0;
  p.grid.forEach(row => row.forEach(c => {
    if (R.walkable(c)) floors++;
    if (R.opaque(c)) walls++;
    if (c.door) doors++;
  }));
  ok('the measure finds real floor in a real plate (' + floors + ' cells)', floors > 50);
  ok('and real wall (' + walls + ' cells)', walls > 10);
  ok('a DOOR is a wall cell with door:true, and it is walkable and NOT opaque — you walk ' +
     'through a doorway and you can be shot through one (' + doors + ' doors)',
     doors > 0 && p.grid.some(row => row.some(c => c.door && R.walkable(c) && !R.opaque(c))));
}

/* ── 1. THE MEASURE ITSELF, ON GROUND TRUTH ────────────────────────────────────
   Hand-built fixtures where the right answer is not in question. A measure nobody has
   pointed at a known shape is a measure nobody has checked. */
console.log('\nTHE MEASURE, AGAINST SHAPES WHOSE ANSWER IS NOT IN QUESTION');
function box(w, h, holes) {
  const g = [];
  for (let y = 0; y < h; y++) { const row = [];
    for (let x = 0; x < w; x++) row.push({ g: 'floor', door: false });
    g.push(row); }
  (holes || []).forEach(([x, y]) => { g[y][x] = { g: 'wall', door: false }; });
  return { grid: g };
}
{
  const empty = R.measure(box(9, 9));
  ok('AN EMPTY BOX HAS NO RETREAT ANYWHERE — every cell sees every cell, which is the ' +
     'exact failure his sentence names', empty.ok === false && empty.breaks === 0);
  ok('and an empty box has no dead ends either, so a pinch count alone would have called ' +
     'it healthy', empty.pinches === 0);
  const pillar = R.measure(box(9, 9, [[4, 4]]));
  ok('ONE PILLAR in the middle of the same box and cells start having somewhere to be ' +
     '(' + pillar.breaks + ' of ' + pillar.cells + ')', pillar.breaks > 0);
  const wall = R.measure(box(9, 9, [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6]]));
  ok('A STUB WALL leaves every cell a retreat — walk around the end of it',
     wall.ok === true);
  ok('a box has zero loops; the walkable graph of an open plate is a mesh, so this counts ' +
     'cycles honestly (edges - nodes + components)', R.measure(box(3, 3)).loops === 4);
  const corridor = R.measure(box(9, 1));
  ok('a ONE-TILE CORRIDOR is a tree: no loops, and both ends are dead ends',
     corridor.loops === 0 && corridor.pinches === 2);
}

/* ── 2. THE LADDER, MEASURED ACROSS EVERY ZONE ─────────────────────────────────
   Nine zones x six seeds at each footprint. Reported in full, because the SHAPE of this
   table is the finding — a clean break, not a smear. */
console.log('\nTHE LADDER — every zone, every seed, at each footprint');
const SIZES = [[6, 6], [8, 8], [10, 10], [12, 10], [16, 14], [20, 16], [24, 18],
               [10, 30], [40, 28]];
const ladder = [];
for (const [W, H] of SIZES) {
  let plans = 0, bad = 0, stranded = 0, cells = 0, rooms = 0, loops = 0, worst = 0;
  for (const z of ZONES) for (const s of SEEDS) {
    const p = FP.plate(s * 7919 + W * 31 + H, W, H, { zone: z });
    const m = R.measure(p);
    plans++; cells += m.cells; stranded += m.noBreak.length; rooms += p.rooms.length;
    loops += m.loops; if (m.worst > worst) worst = m.worst;
    if (!m.ok) bad++;
  }
  ladder.push({ W, H, plans, bad, stranded, cells, rooms: rooms / plans, loops, worst });
  console.log('       ' + (W + 'x' + H).padEnd(7) + ' plans ' + String(plans).padStart(3) +
              '   no-retreat plans ' + String(bad).padStart(3) +
              '   stranded cells ' + String(stranded).padStart(5) + ' / ' +
              String(cells).padStart(6) +
              '   avg rooms ' + (rooms / plans).toFixed(1) +
              '   worst cost ' + worst);
}

/* THE BREAK POINT: the smallest tested footprint from which every larger one is clean.
   DERIVED from the table, never typed — the number in the ratchet below has to be a
   reading of the build rather than a memory of it. */
let breakAt = null;
for (let i = 0; i < ladder.length; i++) {
  const rest = ladder.slice(i).filter(r => r.W * r.H >= ladder[i].W * ladder[i].H);
  if (rest.every(r => r.bad === 0)) { breakAt = ladder[i]; break; }
}
const AREA_RATCHET = 320;      /* 20x16 = 320 tiles, measured 8/18. MAY ONLY COME DOWN. */
console.log('');
ok('there IS a footprint from which the obligation holds absolutely — if there were not, ' +
   'no interior in the game could carry a fight', !!breakAt);
if (breakAt) {
  const area = breakAt.W * breakAt.H;
  console.log('       break point: ' + breakAt.W + 'x' + breakAt.H + ' (' + area + ' tiles)');
  ok('THE OBLIGATION HOLDS ABSOLUTELY at ' + breakAt.W + 'x' + breakAt.H + ' and above: ' +
     'every cell of every plan in every zone can reach somewhere it cannot be seen',
     breakAt.bad === 0);
  ok('and the break point is a RATCHET — ' + area + ' tiles today, and it may only ever ' +
     'come DOWN (' + AREA_RATCHET + ' is the 8/18 measurement)', area <= AREA_RATCHET);
}

/* ── 3. LOOPS, CORNERS, PILLARS — NEVER BOXES ──────────────────────────────────
   His prescription, and the reason the tree case matters: a tree-shaped interior can
   always be cornered at a leaf, because every retreat in it is a dead end by construction
   — you can only ever go back the way they are coming. */
console.log('\nLOOPS, CORNERS AND PILLARS — NEVER BOXES');
{
  /* AN ASSERTION I WROTE AND THEN CAUGHT MYSELF: the first version of this counted cycles
     on the CELL grid and asserted there were some. It passed 54 of 54 and it could not
     have done anything else — any floor wider than one tile is a mesh, so a cell-graph
     cycle count is huge and positive however the rooms connect, INCLUDING in a strictly
     tree-shaped building. A measurement that cannot fail is not a measurement, and a green
     from it is worth nothing. The question he actually asked is about the PLAN: can you
     leave a room one way and come back another. That is the DOOR graph. */
  let treeish = 0, checked = 0, loops = 0, multi = 0;
  for (const z of ZONES) for (const s of SEEDS) {
    const p = FP.plate(s * 104729, 24, 18, { zone: z });
    const g = R.roomGraph(p);
    checked++; loops += g.loops;
    if (g.rooms >= 4) { multi++; if (g.loops <= 0) treeish++; }
  }
  console.log('       24x18: ' + checked + ' plans, ' + multi + ' with 4+ rooms, ' +
              treeish + ' of those are TREE-SHAPED (no way round), ' + loops +
              ' loop doors in total');
  ok('the room graph is measured on DOORS, and a strict tree is detectable — the cell-mesh ' +
     'version of this check could never have failed', R.roomGraph(
       FP.plate(104729, 24, 18, { zone: 'warehouse' })).loops === 0);
  ok('loop doors DO survive into fight-sized plans (' + loops + ' across ' + checked + ')',
     loops > 0);
  /* AND IT IS REPORTED RATHER THAN ASSERTED, because of a genuine tension worth naming:
     his prescription is "loops, corners and pillars, never boxes", and REAL commercial
     floorplans are mostly TREES — rooms hanging off a corridor, with a ring only in big
     buildings. REALISM FIRST leads and the HARD obligation in his law is the other one
     ("retreat is possible"), which is asserted absolutely above. Forcing every plan to
     loop would be sacrificing realism to a prescription rather than to fun, and that
     trade is his to make, not mine. The number is here so he can make it by looking. */
  const big = R.measure(FP.plate(555, 40, 28, { zone: 'warehouse' }));
  ok('the biggest open zone in the game still gives every cell a way out of sight ' +
     '(warehouse 40x28, worst retreat ' + big.worst + ' steps)', big.ok === true);
}

/* ── 4. THE KNOWN GAP, NAMED AND SIZED ─────────────────────────────────────────
   Reported, not asserted, and the reason is a ruling rather than a shrug: a 6x6 plate is
   4.5 m square. Partitioning a shed to win a number would be inventing architecture that
   does not exist, and REALISM FIRST forbids it. */
console.log('\nTHE KNOWN GAP — small plates, and why the fix is NOT more walls');
{
  const small = ladder.filter(r => r.W * r.H < (breakAt ? breakAt.W * breakAt.H : 320));
  const strandedTotal = small.reduce((a, r) => a + r.stranded, 0);
  const cellsTotal = small.reduce((a, r) => a + r.cells, 0);
  console.log('       below the break point: ' + strandedTotal + ' of ' + cellsTotal +
              ' floor cells (' + (100 * strandedTotal / cellsTotal).toFixed(1) +
              '%) have nowhere to hide');
  ok('every plate below the break point is ONE ROOM or close to it — this is a GRAMMAR ' +
     'result, not a seed accident, which is why no amount of re-rolling fixes it',
     small.filter(r => r.W * r.H <= 100).every(r => r.rooms < 1.2));
  ok('and the generator itself already names the fix: `furniture per role` has been sitting ' +
     'in meta.pending since July, which is where cover in a 4.5 m room actually comes from',
     (FP.plate(1, 8, 8, { zone: 'retail' }).meta.pending || []).indexOf('furniture per role') >= 0);
}

/* ── 5. HIS DIALS ARE STILL HIS ────────────────────────────────────────────────
   How far a retreat may be before it stops counting as one is FEEL. The measure reports
   the distance and asserts nothing about it. */
console.log('\nWHAT IS HIS IS STILL EMPTY');
ok('no limit on how far a retreat may be — that is feel, and feel is his',
   Object.keys(R.LIMITS).length === 0 && R.limitFor('cost') === R.NO_RULING);

console.log('\nRETREAT GATE: ' + pass + ' passed, ' + fail + ' failed  (every interior big ' +
            'enough to hold a fight guarantees a way out of sight; the boxes are named, ' +
            'sized, and their fix is cover rather than walls)');
process.exit(fail ? 1 : 0);
