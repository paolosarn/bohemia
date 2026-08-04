// POPULATION GATE (7/19/26, LIFE session) — the two-plane sim must never lie.
// The valley holds people as NUMBERS per cell (Zomboid pattern); real bodies
// only materialize in the bubble (STALKER pattern). This gate proves the
// planes agree:
//   1. EXACT-MATCH LAW: censusForPlot's people === agentsForPlot's length on
//      real world plots (the numbers ARE the people, same hashes)
//   2. the die-off dial flows through the census (rate 1 >= default > rate 0)
//   3. non-residential cells hold zero census (streets/desert/commercial are
//      not homes; jobs are not residents)
//   4. the valley estimate is deterministic and sane, and is labeled an
//      estimate (exact counts exist only per cell)
//   5. OFFLINE/ONLINE AGREEMENT: deep into any long schedule block, a simmed
//      body is where the offline plane says it should be (home->in,
//      work->away, street->out)
//   6. the offline plane is cheap: a full valley-day of offline summaries
//      runs with zero sim steps
/* 8/4/26 — see gates/bohemia_block_fixture.js for why this gate was red on main
   for its whole visible history. In one line: written on 7/19 at OCCUPIED_RATE
   0.30 where every plot and every seed came up populated, and correct then; the
   rate became 0.038 on 8/1 by arithmetic off Paolo's own scale-model question,
   and a single-plot fixture became a coin flip. The claims below ask the SAMPLE,
   which is both what canon says and a thing that cannot flip on scan order. */
const W = require('../engine/bohemia_world.js');
const A = require('../engine/bohemia_agents.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
const FIX = require('./bohemia_block_fixture.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const world = W.world(12345);

// residential plots with buildings
const plots = [];
outer:
for (let y = 10; y < 60 && plots.length < 12; y++) for (let x = 10; x < 60; x++) {
  const c = world.at(x, y);
  if (!c || c.district !== 'suburb') continue;
  const p = world.plot(x, y);
  if (p && p.buildings && p.buildings.length > 5) { plots.push([x, y]); if (plots.length >= 12) break outer; }
}

// 1. exact match: numbers plane === bodies plane
/* THE STRONGEST CHECK IN THIS FILE and it was only ever asked of three plots.
   Widened to twelve: an exact-match law is worth every sample you can give it,
   and it holds on empty plots too (0 === 0 is a real agreement, not a pass by
   accident) - which is exactly why THIS one was never the coin flip. */
let exact = true;
for (const [x, y] of plots) {
  const census = A.censusForPlot(world, x, y);
  const bodies = A.agentsForPlot(world, x, y).length;
  if (census.people !== bodies) exact = false;
}
ok('EXACT-MATCH: census people === materialized agents on ' + plots.length + ' world plots', exact && plots.length === 12);

// 2. dial flows through
/* ASKED OF THE SAMPLE. `default > 0` on ONE plot is the coin flip: at 0.038 most
   plots hold nobody, so it decided the verdict by which plot the scan reached.
   Across twelve it says the real thing - the dial moves the whole population,
   full fills every home, zero empties the valley, and the default lands strictly
   between - and each of those three is separately capable of failing. */
let dialUp = true, dialZero = true, fullFills = true;
let sumFull = 0, sumDefault = 0, sumEmpty = 0;
for (const [x, y] of plots) {
  const c1 = A.censusForPlot(world, x, y, { occupiedRate: 1 });
  const cD = A.censusForPlot(world, x, y);
  const c0 = A.censusForPlot(world, x, y, { occupiedRate: 0 });
  sumFull += c1.people; sumDefault += cD.people; sumEmpty += c0.people;
  if (c1.people < cD.people) dialUp = false;
  if (c0.people !== 0) dialZero = false;
  if (c1.lived !== c1.homes) fullFills = false;
}
ok('die-off dial flows through the census across ' + plots.length + ' plots (full ' +
  sumFull + ' >= default ' + sumDefault + ' > empty ' + sumEmpty + ')',
  dialUp && sumDefault > 0 && sumDefault < sumFull);
ok('rate 0 empties EVERY plot (nobody survives a zeroed dial)', dialZero && sumEmpty === 0);
ok('rate 1 fills EVERY home on EVERY plot', fullFills);

// 3. non-residential = zero census
let nonresZero = true, found = 0;
outer2:
for (let y = 10; y < 60 && found < 3; y++) for (let x = 10; x < 60; x++) {
  const c = world.at(x, y);
  if (!c || A.RESIDENTIAL[c.district] || c.district === 'suburb') continue;
  const cen = A.censusForPlot(world, x, y);
  if (cen.people !== 0 || cen.lived !== 0) nonresZero = false;
  if (++found >= 3) break outer2;
}
ok('non-residential cells hold zero census (jobs are not residents)', nonresZero && found === 3);

// 4. valley estimate: deterministic, sane, labeled
const s1 = A.sampleValley(world, 16);
const s2 = A.sampleValley(world, 16);
ok('valley estimate deterministic (' + s1.estimatedPeople + ' people est. across ' + s1.residentialCells + ' residential cells)',
  JSON.stringify(s1) === JSON.stringify(s2) && s1.sampled > 0 && s1.estimatedPeople > 0);
ok('estimate scales with the dial', A.sampleValley(world, 16, { occupiedRate: 1 }).estimatedPeople > s1.estimatedPeople);

// 5. offline/online agreement on a simmed block
/* 40 BLOCKS, NOT ONE SEED. Six people on one block do not produce fifty spot
   checks any more - `checked > 50` was quietly a claim about population size,
   not about agreement - and simming only the seeds that happen to hold people
   is picking the coin (bohemia_block_fixture.js has that measurement too).
   So: census-vs-agents is asked of ALL 40 blocks including the 13 empty ones
   (0 === 0 is a real agreement), and the agreement sweep runs every inhabited
   block and pools the checks. */
const SURVEY = FIX.survey(40);
let blockExact = true;
for (const b of SURVEY.blocks) if (A.censusForBlock(b.seed, b.feet).people !== b.agents.length) blockExact = false;
ok('block census matches block agents on all ' + SURVEY.n + ' blocks (' + SURVEY.people +
  ' people, ' + (SURVEY.n - SURVEY.inhabited.length) + ' of them empty and agreeing at zero)', blockExact);

const MODE_OF = { home: 'in', work: 'away', street: 'out' };
let agree = true, checked = 0;
for (const b of SURVEY.inhabited) {
  const sim = A.makeSim(b.res, b.feet, b.agents, { fpOf: b.fpOf, doorOf: b.doorOf, startTurn: 0 });
  for (let t = 0; t < A.DAY_TURNS * 1.2; t++) {
    sim.step();
    if (sim.turn % 30 !== 0) continue;
    for (const a of b.agents) {
      const blk = A.whereAt(a, sim.turn);
      const into = A.tod(sim.turn) - blk.t0, len = blk.t1 - blk.t0;
      if (len < 240 || into < 185) continue;      // only deep into LONG blocks (walks take time)
      checked++;
      if (a.loc.mode !== MODE_OF[blk.where]) agree = false;
    }
  }
}
ok('OFFLINE/ONLINE AGREEMENT: deep in long blocks, bodies are where the schedule says (' +
  checked + ' spot checks across ' + SURVEY.inhabited.length + ' inhabited blocks)',
  agree && checked > 50);

// 6. offline plane is cheap: a whole day of valley summaries, zero stepping
const everyone = SURVEY.inhabited.reduce((acc, b) => acc.concat(b.agents), []);
const t0 = Date.now();
let sums = 0;
for (let t = 0; t < A.DAY_TURNS; t += 15) sums += A.offlineSummary(everyone, t).home;
const ms = Date.now() - t0;
ok('offline plane is cheap (96 day-summaries over ' + everyone.length + ' people in ' + ms + 'ms, no sim)',
  ms < 500 && sums > 0);

console.log('POPULATION GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
