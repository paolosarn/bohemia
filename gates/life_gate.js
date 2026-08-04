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
/* 8/4/26 — WHY THIS GATE WAS RED ON MAIN FOR THE WHOLE VISIBLE HISTORY, and
   what changed. Full reasoning + the measurements in gates/bohemia_block_fixture.js.
   Short version: it was written on 7/19 when OCCUPIED_RATE was 0.30, where every
   seed and every plot came up populated, so "sample three plots and assert each
   one has people in it" was a safe bet. On 8/1 the rate became 0.038 - derived
   arithmetic off Paolo's scale-model question, and CORRECT - and a 20-home block
   now averages 0.76 occupied houses. Empty is the MODAL outcome. The claim did
   not become wrong so much as it became A COIN FLIP WEARING A CLAIM'S NAME: which
   plot the scan lands on decides the verdict, and it landed on 14,10, which rolls
   empty.
   THE CLAIM NOW PINS BOTH ENDS - the valley is mostly empty (the die-off is real)
   AND somewhere in it people are living (it is not dead-dead). That asserts MORE
   than the old one, not less: the old check could not tell those two failures
   apart, and this one cannot flip on scan order. */
const W = require('../engine/bohemia_world.js');
const A = require('../engine/bohemia_agents.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
const FIX = require('./bohemia_block_fixture.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const world = W.world(12345);

// find residential plots with buildings AND at least one job district near
const plots = [];
outer:
for (let y = 10; y < 60 && plots.length < 12; y++) for (let x = 10; x < 60; x++) {
  const c = world.at(x, y);
  if (!c || c.district !== 'suburb') continue;
  if (!A.jobsNear(world, x, y, 3).length) continue;
  const p = world.plot(x, y);
  if (p && p.buildings && p.buildings.length > 5) { plots.push([x, y]); if (plots.length >= 12) break outer; }
}
ok('world model yields residential plots with job districts in range', plots.length === 12);

/* THE DISTRIBUTION, over the whole sample instead of over whichever plot the
   scan reached first. Both halves are asserted because both halves are canon. */
const plotPop = plots.map(([x, y]) => A.agentsForPlot(world, x, y).length);
const livedPlots = plotPop.filter(n => n > 0).length;
ok('the valley is MOSTLY EMPTY, as the die-off says (' + (plots.length - livedPlots) +
  ' of ' + plots.length + ' sampled plots hold nobody)', livedPlots < plots.length * 0.75);
ok('and it is NOT dead-dead: somewhere on the sample people are living (' +
  livedPlots + ' inhabited plots, ' + plotPop.reduce((a, b) => a + b, 0) + ' residents)',
  livedPlots > 0);

let homed = true, schedFull = true, factionEmpty = Object.keys(A.FACTION_ASSIGN).length === 0;
let deterministic = true, quantized = true, someEmployed = false, someScav = false;
for (const [x, y] of plots) {
  const agents = A.agentsForPlot(world, x, y);
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
/* THE SURVEY, not one seed. 40 ring blocks, seeds 1..40, deterministic. The
   sim below runs on an INHABITED one, chosen as the lowest inhabited seed -
   and the claims that could turn on WHICH one are asked of the whole survey
   instead, never of this block alone (bohemia_block_fixture.js has the
   measurements showing why: seed 39 has six people who never see each other
   all day, and that is the dead world working, not a bug to route around). */
const SURVEY = FIX.survey(40);
const BLOCK = SURVEY.inhabited[0];
const SEED = BLOCK.seed;
const res = BLOCK.res, feet = BLOCK.feet, fpOf = BLOCK.fpOf, doorOf = BLOCK.doorOf;
const G = res.g, WD = res.W, HT = res.H;
const JOBS = FIX.JOBS;
const agents = BLOCK.agents;

// ---- VACANCY (Paolo 7/19: the suburb must reflect the die-off) -------------
/* asked of 40 blocks at once, so it is a statement about the world and not
   about a coin. 825 homes / 91 people / 27 inhabited blocks when this landed. */
const surveyLived = SURVEY.blocks.reduce((n, b) => n + A.inhabitedHomes(b.agents).length, 0);
ok('most homes are abandoned shells across ' + SURVEY.n + ' blocks (' + surveyLived +
  ' of ' + SURVEY.homes + ' lived-in, ' + SURVEY.people + ' people)',
  surveyLived > 0 && surveyLived < SURVEY.homes * 0.55);
ok('and the empty ones are the NORM, not the exception (' +
  (SURVEY.n - SURVEY.inhabited.length) + ' of ' + SURVEY.n + ' blocks hold nobody at all)',
  SURVEY.inhabited.length < SURVEY.n && SURVEY.inhabited.length > 0);
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
/* DAY SHAPE, across every inhabited block in the survey rather than on one.
   At 0.038 a single block can hold six people who all happen to be scavengers
   with a late start, and "nobody is out at 11:00 HERE" is not the same finding
   as "nobody in the valley ever goes out". These two claims separate them:
   the 03:00 half must hold on EVERY block (a sleeping valley is universal),
   the 11:00 half must hold SOMEWHERE (a living one is not). */
let sleepsEverywhere = true, blocksAlive = 0, outAt11 = 0, simmed = 0;
for (const b of SURVEY.inhabited) {
  const s2 = A.makeSim(b.res, b.feet, b.agents.map(a => ({ ...a })),
    { fpOf: b.fpOf, doorOf: b.doorOf, startTurn: 0 });
  let a3 = null, a11 = null;
  for (let t = 0; t < A.DAY_TURNS; t++) {
    s2.step();
    if (s2.tod() === 180) a3 = s2.agents.filter(a => a.loc.mode === 'in').length;
    if (s2.tod() === 660) a11 = s2.agents.filter(a => a.loc.mode !== 'in').length;
  }
  simmed += b.agents.length;
  if (a3 !== b.agents.length) sleepsEverywhere = false;
  if (a11 > 0) { blocksAlive++; outAt11 += a11; }
}
ok('OCCUPANCY LAW holds across 1.5 sim days (one body per cell)', occupancyHolds);
ok('nobody teleports (every move is one step)', oneStep);
ok('03:00 — EVERY inhabited block sleeps, all ' + simmed + ' people indoors across ' +
  SURVEY.inhabited.length + ' blocks', sleepsEverywhere);
ok('11:00 — the valley lives (' + outAt11 + ' people out working/scavenging on ' +
  blocksAlive + ' of ' + SURVEY.inhabited.length + ' inhabited blocks)', blocksAlive > 0);

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
