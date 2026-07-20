// LIFE GATE (7/19/26, LIFE session) — the people factory must always produce
// legal people. FACTORY LAW: bohemia_agents ships with this gate or it does
// not ship. Proves, on the REAL world model (not a mock):
//   1. every agent is HOMED: a real building on a real residential plot, with
//      a bed room that exists in that building's floorplan
//   2. every schedule covers all 1440 minutes: no gaps, no overlaps, whole-
//      minute boundaries (120 BPM law: everything quantizes to the turn)
//   3. faction is null and FACTION_ASSIGN is EMPTY (contents are Paolo's)
//   4. generation is deterministic (same world, same plot, same people)
//   5. the SIM obeys OCCUPANCY (one body per exterior cell, player included)
//      and moves are 1-step (nobody teleports)
//   6. the day has shape: at 03:00 everyone is home; by late morning the
//      block has people OUT living (workers gone to sites, scavengers on
//      the streets)
const W = require('../engine/bohemia_world.js');
const A = require('../engine/bohemia_agents.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const world = W.world(12345);

// find residential plots with buildings AND at least one job district near
const plots = [];
outer:
for (let y = 10; y < 60 && plots.length < 3; y++) for (let x = 10; x < 60; x++) {
  const c = world.at(x, y);
  if (!c || c.district !== 'suburb') continue;
  if (!A.jobsNear(world, x, y, 3).length) continue;
  const p = world.plot(x, y);
  if (p && p.buildings && p.buildings.length > 5) { plots.push([x, y]); if (plots.length >= 3) break outer; }
}
ok('world model yields residential plots with job districts in range', plots.length === 3);

let homed = true, schedFull = true, factionEmpty = Object.keys(A.FACTION_ASSIGN).length === 0;
let deterministic = true, quantized = true, someEmployed = false, someScav = false;
for (const [x, y] of plots) {
  const agents = A.agentsForPlot(world, x, y);
  ok('plot ' + x + ',' + y + ' is populated (' + agents.length + ' agents)', agents.length > 0);
  const plot = world.plot(x, y);
  for (const a of agents) {
    const b = plot.building(a.home.building);
    if (!b) { homed = false; continue; }
    const fp = b.floorplan();
    if (!fp || a.home.bedRoom < 0 || a.home.bedRoom >= fp.rooms.length) homed = false;
    if (a.faction !== null) factionEmpty = false;
    if (a.job.kind === 'site') someEmployed = true;
    if (a.job.kind === 'scav') someScav = true;
    // schedule: sorted, contiguous 0..1440, integer bounds
    let t = 0;
    for (const blk of a.sched) {
      if (blk.t0 !== Math.round(blk.t0) || blk.t1 !== Math.round(blk.t1)) quantized = false;
      if (blk.t0 !== t) schedFull = false;
      t = blk.t1;
    }
    if (t !== A.DAY_TURNS) schedFull = false;
  }
  const again = A.agentsForPlot(world, x, y);
  if (JSON.stringify(agents) !== JSON.stringify(again)) deterministic = false;
}
ok('every agent homed: real building + bed room in its real floorplan', homed);
ok('every schedule covers all 1440 minutes, no gaps/overlap', schedFull);
ok('schedules quantize to whole world-turns (120 BPM law)', quantized);
ok('faction is null + FACTION_ASSIGN table EMPTY (contents-Paolo\'s)', factionEmpty);
ok('population is deterministic per plot', deterministic);
ok('both job kinds occur (site work + subsistence scavenge)', someEmployed && someScav);

// ---- SIM: run a block through a day and a half -----------------------------
const SEED = 7;
const res = SUB.generate(SEED, 'ring', 1, 1);
const feet = SUB.homeFootprints(res);
const fpOf = i => FP.generate((SEED ^ ((i + 1) * 0x9E3779B1)) >>> 0, feet[i].w, feet[i].h, { zone: 'residential', entrance: 'S' });
// front doors like the walk slice: house cell adjacent to driveway/road/ground
const doorOf = {};
const G = res.g, WD = res.W, HT = res.H;
const pref = (x, y, want) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => {
  const ax = x + dx, ay = y + dy;
  return ax >= 0 && ay >= 0 && ax < WD && ay < HT && G[ay][ax] === want;
});
feet.forEach((f, i) => {
  let pick = null;
  for (const want of [3, 1, 0]) {
    for (let y = f.y; y < f.y + f.h && !pick; y++) for (let x = f.x; x < f.x + f.w; x++)
      if (G[y][x] === 2 && pref(x, y, want)) { pick = [x, y]; break; }
    if (pick) break;
  }
  if (pick) doorOf[pick[0] + ',' + pick[1]] = i;
});
const JOBS = [{ district: 'commercial', dir: 'E', dist: 1 }];
const agents = A.agentsForBlock(SEED, feet, JOBS, fpOf);

// ---- VACANCY (Paolo 7/19: the suburb must reflect the die-off) -------------
const lived = A.inhabitedHomes(agents);
ok('most homes are abandoned shells (' + lived.length + ' of ' + feet.length + ' lived-in)',
  lived.length > 0 && lived.length < feet.length * 0.55);
const packed = A.agentsForBlock(SEED, feet, JOBS, fpOf, { occupiedRate: 1 });
ok('the die-off dial works (rate 1 fills every home, rate 0 empties the block)',
  A.inhabitedHomes(packed).length === feet.length &&
  A.agentsForBlock(SEED, feet, JOBS, fpOf, { occupiedRate: 0 }).length === 0);
ok('OCCUPIED_RATE is a flagged placeholder dial, not silently hardcoded',
  typeof A.OCCUPIED_RATE === 'number' && A.OCCUPIED_RATE > 0 && A.OCCUPIED_RATE < 1);

// ---- STAGGER (Paolo 7/19: different wake times, different lives) -----------
// measured on a packed population so small-sample luck can't flake the gate
const wakes = packed.map(a => a.sched[0].t1);
ok('wake times spread over hours (' + A.fmt(Math.min(...wakes)) + '..' + A.fmt(Math.max(...wakes)) + ')',
  Math.max(...wakes) - Math.min(...wakes) >= 150);
const roles = new Set(packed.map(a => a.role));
ok('life archetypes coexist (' + [...roles].sort().join('/') + ')', roles.size >= 3);
const shifts = packed.filter(a => a.role === 'worker').map(a => a.sched.find(b => b.act === 'work').t0);
ok('worker shifts stagger across the morning', shifts.length > 3 && Math.max(...shifts) - Math.min(...shifts) >= 90);

const sim = A.makeSim(res, feet, agents, { fpOf, doorOf, startTurn: 0 });

let occupancyHolds = true, oneStep = true;
const posOf = a => a.loc.mode === 'out' ? [a.loc.x, a.loc.y] : null;
let prev = agents.map(posOf);
for (let t = 0; t < A.DAY_TURNS * 1.5; t++) {
  sim.step();
  const seen = {};
  agents.forEach((a, i) => {
    const p = posOf(a);
    if (p) {
      const k = p[0] + ',' + p[1];
      if (seen[k]) occupancyHolds = false;    // two bodies, one cell
      seen[k] = a.id;
      if (prev[i]) {
        const d = Math.abs(p[0] - prev[i][0]) + Math.abs(p[1] - prev[i][1]);
        if (d > 1) oneStep = false;           // teleport
      }
    }
    prev[i] = p;
  });
  const tod = sim.tod();
  if (tod === 180) {                          // 03:00 — everyone home asleep
    if (!agents.every(a => a.loc.mode === 'in')) occupancyHolds = occupancyHolds; // checked below
  }
}
// day shape probes on a fresh sim (exact times)
const sim2 = A.makeSim(res, feet, agents.map(a => ({ ...a })), { fpOf, doorOf, startTurn: 0 });
let at3 = null, at11 = null;
for (let t = 0; t < A.DAY_TURNS; t++) {
  sim2.step();
  if (sim2.tod() === 180) at3 = sim2.agents.filter(a => a.loc.mode === 'in').length;
  if (sim2.tod() === 660) at11 = sim2.agents.filter(a => a.loc.mode !== 'in').length;
}
ok('OCCUPANCY LAW holds across 1.5 sim days (one body per cell)', occupancyHolds);
ok('nobody teleports (every move is one step)', oneStep);
ok('03:00 — the block sleeps (all ' + agents.length + ' home)', at3 === agents.length);
ok('11:00 — the block lives (' + at11 + ' out working/scavenging)', at11 !== null && at11 > 0);

// ---- ROOM ADVERTISEMENTS (rung 3: the placed house positions its people) ---
let advertsOk = true, bedAt3 = true, kitchenAtBreak = true, spotsDistinct = true;
for (const a of agents) {
  const fp = fpOf(a.home.building);
  // 03:00: asleep in the agent's own bed room
  const nightSpot = A.homeSpotFor(a, fp, 180, 0);
  const bedRm = fp.rooms[a.home.bedRoom];
  if (!(nightSpot.act === 'sleep' && nightSpot.x >= bedRm.x && nightSpot.x < bedRm.x + bedRm.w
    && nightSpot.y >= bedRm.y && nightSpot.y < bedRm.y + bedRm.h)) bedAt3 = false;
  // 20 min after wake: the morning ration, in a room that advertises 'eat' (if the house has one)
  const wake = a.sched[0].t1;
  const morning = A.homeSpotFor(a, fp, wake + 20, 0);
  const hasKitchen = fp.rooms.some(rm => (A.ADVERTS[rm.role] || []).indexOf('eat') >= 0);
  if (morning.act !== 'eat') kitchenAtBreak = false;
  if (hasKitchen && (A.ADVERTS[morning.room] || []).indexOf('eat') < 0) kitchenAtBreak = false;
  // spots are stable + in-bounds
  const again2 = A.homeSpotFor(a, fp, 180, 0);
  if (JSON.stringify(nightSpot) !== JSON.stringify(again2)) advertsOk = false;
  if (nightSpot.x < 0 || nightSpot.y < 0 || nightSpot.x >= fp.W || nightSpot.y >= fp.H) advertsOk = false;
  // two occupants of the same room never stack on one cell (room interiors are >=2 cells)
  const s0 = A.homeSpotFor(a, fp, 180, 0), s1 = A.homeSpotFor(a, fp, 180, 1);
  if (s0.x === s1.x && s0.y === s1.y) spotsDistinct = false;
}
ok('ADVERTS: at 03:00 everyone sleeps in their OWN bed room', bedAt3);
ok('ADVERTS: the morning ration happens where the house serves food', kitchenAtBreak);
ok('ADVERTS: spots deterministic and inside the floorplan', advertsOk);
ok('ADVERTS: occupants spread, never stack on one cell', spotsDistinct);

console.log('LIFE GATE: ' + pass + ' passed, ' + fail + ' failed  (' + agents.length + ' agents simmed, ' + plots.length + ' world plots)');
process.exit(fail ? 1 : 0);
