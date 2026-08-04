/* BOHEMIA — A LIVED-IN BLOCK, FOUND HONESTLY (8/4/26).

   FOUR OF THE PEOPLE LANE'S GATES WERE RED ON MAIN FOR THE WHOLE VISIBLE
   HISTORY: LIFE, DRESS, POPULATION, MEMORY. All four failed the same way -
   "0 agents simmed", "0 distinct tops", "0 sightings" - and all four failed for
   the same reason, which is NOT that anybody wrote bad code.

   THE ROOT CAUSE, MEASURED, NOT ASSUMED:

     seed 7, occupiedRate 0.30  ->  6 agents in 19 homes
     seed 7, occupiedRate 0.038 ->  0 agents in 19 homes
     seeds 1..40 at 0.30        ->  40 populated, 0 empty
     seeds 1..40 at 0.038       ->  27 populated, 13 EMPTY

   The four gates were written on 7/19 against a world where OCCUPIED_RATE was
   0.30. At that rate EVERY seed produced a populated block, so "build one block
   at seed 7 and assert people are in it" was a safe bet and a fine fixture.

   On 8/1 OCCUPIED_RATE became 0.038 - not a guess and not a regression, but
   arithmetic off Paolo's own question ("now we have the scale model, and on top
   of it an apocalypse"): 2050 Vegas ~2.9 M, scale 1:78, GDD v5's ~3% survival
   = 1,113 people in the whole valley. THAT NUMBER IS CORRECT AND STAYS.

   What it did was turn a safe bet into a coin flip, and seed 7 came up tails.
   A 20-home block now averages 0.76 occupied houses; an empty block is the
   MODAL outcome. So the gates were asserting that one particular coin landed
   heads, and calling it a claim about the world.

   THIS IS NOT A LICENCE TO EDIT GATES UNTIL THEY GO GREEN - that is the
   pre-named forbidden shortcut and it does not stop being one because I think
   I am right. The test I held these to: DOES THE NEW CLAIM ASSERT MORE?
   A distribution claim pins BOTH ends - the valley is mostly empty (the
   die-off is real) AND somewhere in it people are living (the world is not
   dead-dead) - and it cannot flip on which seed a scan happens to reach.
   The old claim could not tell those two failures apart. This one can.

   AND THE TRAP ONE LEVEL DOWN, which is why this file exists at all: the
   obvious fix is "scan for the first seed that HAS people and sim that one".
   Measured, that is the same bug in a better disguise -

     seed  3: 6 agents,  4 sightings, missing-persons ANSWERABLE
     seed  9: 6 agents,  8 sightings, not answerable
     seed 21: 6 agents,  4 sightings, not answerable
     seed 39: 6 agents,  0 sightings, not answerable

   Picking the lowest seed that passes IS choosing the coin. Six people spread
   across twenty-one houses genuinely may never see each other all day, and
   that is the dead world working, not a bug. So the gates that use this ask
   about the SET: across N blocks, does the machinery work SOMEWHERE, and is
   the valley still mostly empty. Both halves, every time.

     const FIX = require('./bohemia_block_fixture.js');
     const s = FIX.survey(40);        // { blocks, homes, people, inhabited }
     const b = FIX.build(3);          // one block: res, feet, fpOf, doorOf, agents

   A FIXTURE THAT FINDS NOTHING MUST FAIL, NEVER SKIP. survey() throws if the
   whole sample is empty rather than handing back a zero a caller might sim
   quietly - the 8/4 touch-guard lesson (a gate that skips reports GREEN) is
   this lane's own to learn from too.

   Reads only. Owns nothing. Decides nothing. */
'use strict';
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
const A = require('../engine/bohemia_agents.js');

/* the one job district every one of these gates put next door. */
const JOBS = [{ district: 'commercial', dir: 'E', dist: 1 }];

/* FRONT DOORS, exactly as the walk slice picks them: a house cell touching a
   sidewalk, then a driveway, then a road, then bare ground. This loop was
   copied into life_gate, population_gate, memory_gate and deviation_gate;
   ENGINE SYNC LAW says one canonical body, so it lives here now.
   AND THE FOUR COPIES HAD ALREADY DRIFTED. deviation_gate's was fixed on 7/31 to
   try SIDEWALK (code 10) first - "it did not exist when this fixture was written,
   so a house fronting the walk found NO door, its residents could never leave" -
   and the other three never got that fix. They did not go red over it because
   they were simming nobody. The canonical body is the CORRECTED one. */
function frontDoors(res, feet) {
  const G = res.g, WD = res.W, HT = res.H, doorOf = {};
  const pref = (x, y, want) => [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dx, dy]) => {
    const ax = x + dx, ay = y + dy;
    return ax >= 0 && ay >= 0 && ax < WD && ay < HT && G[ay][ax] === want;
  });
  feet.forEach((f, i) => {
    let pick = null;
    for (const want of [10, 3, 1, 0]) {
      for (let y = f.y; y < f.y + f.h && !pick; y++) for (let x = f.x; x < f.x + f.w; x++)
        if (G[y][x] === 2 && pref(x, y, want)) { pick = [x, y]; break; }
      if (pick) break;
    }
    if (pick) doorOf[pick[0] + ',' + pick[1]] = i;
  });
  return doorOf;
}

/* one ring block, built the way all four gates built it. opts.occupiedRate
   passes straight through to agentsForBlock (rate 1 = packed, for the checks
   that are about a mechanism rather than about the census). */
function build(seed, opts) {
  opts = opts || {};
  const res = SUB.generate(seed, 'ring', 1, 1);
  const feet = SUB.homeFootprints(res);
  const fpOf = i => FP.generate((seed ^ ((i + 1) * 0x9E3779B1)) >>> 0, feet[i].w, feet[i].h,
    { zone: 'residential', entrance: 'S' });
  const jobs = opts.jobs || JOBS;
  const agentOpts = (opts.occupiedRate != null) ? { occupiedRate: opts.occupiedRate } : undefined;
  return {
    seed, res, feet, fpOf, jobs,
    doorOf: frontDoors(res, feet),
    agents: A.agentsForBlock(seed, feet, jobs, fpOf, agentOpts),
  };
}

/* N blocks, seeds 1..N, deterministic. The RETURN is the distribution, because
   the distribution is the thing worth asserting. */
function survey(n, opts) {
  n = n || 40;
  const blocks = [];
  let homes = 0, people = 0;
  for (let seed = 1; seed <= n; seed++) {
    const b = build(seed, opts);
    homes += b.feet.length;
    people += b.agents.length;
    blocks.push(b);
  }
  const inhabited = blocks.filter(b => b.agents.length > 0);
  if (!inhabited.length) {
    throw new Error('BLOCK FIXTURE: ' + n + ' blocks and not one person in any of them. ' +
      'That is not a fixture problem to route around - either OCCUPIED_RATE has been ' +
      'zeroed or agentsForBlock is broken. Failing loudly on purpose: a fixture that ' +
      'finds nothing must FAIL, never hand back an empty a caller sims in silence.');
  }
  return { blocks, inhabited, homes, people, n };
}

/* a sim on a block, stepped a whole day. attach: e.g. bohemia_memory's. */
function simDay(b, opts) {
  opts = opts || {};
  let sim = A.makeSim(b.res, b.feet, opts.agents || b.agents,
    { fpOf: b.fpOf, doorOf: b.doorOf, startTurn: 0 });
  if (opts.attach) sim = opts.attach(sim);
  const turns = Math.round(A.DAY_TURNS * (opts.days || 1));
  for (let t = 0; t < turns; t++) sim.step();
  return sim;
}

module.exports = { JOBS, frontDoors, build, survey, simDay };
