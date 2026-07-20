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
const W = require('../engine/bohemia_world.js');
const A = require('../engine/bohemia_agents.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const world = W.world(12345);

// residential plots with buildings
const plots = [];
outer:
for (let y = 10; y < 60 && plots.length < 3; y++) for (let x = 10; x < 60; x++) {
  const c = world.at(x, y);
  if (!c || c.district !== 'suburb') continue;
  const p = world.plot(x, y);
  if (p && p.buildings && p.buildings.length > 5) { plots.push([x, y]); if (plots.length >= 3) break outer; }
}

// 1. exact match: numbers plane === bodies plane
let exact = true;
for (const [x, y] of plots) {
  const census = A.censusForPlot(world, x, y);
  const bodies = A.agentsForPlot(world, x, y).length;
  if (census.people !== bodies) exact = false;
}
ok('EXACT-MATCH: census people === materialized agents on ' + plots.length + ' world plots', exact && plots.length === 3);

// 2. dial flows through
const [px0, py0] = plots[0];
const c1 = A.censusForPlot(world, px0, py0, { occupiedRate: 1 });
const cD = A.censusForPlot(world, px0, py0);
const c0 = A.censusForPlot(world, px0, py0, { occupiedRate: 0 });
ok('die-off dial flows through the census (full ' + c1.people + ' >= default ' + cD.people + ' > empty ' + c0.people + ')',
  c1.people >= cD.people && cD.people > 0 && c0.people === 0 && c1.lived === c1.homes);

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
const SEED = 7;
const res = SUB.generate(SEED, 'ring', 1, 1);
const feet = SUB.homeFootprints(res);
const fpOf = i => FP.generate((SEED ^ ((i + 1) * 0x9E3779B1)) >>> 0, feet[i].w, feet[i].h, { zone: 'residential', entrance: 'S' });
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
const agents = A.agentsForBlock(SEED, feet, [{ district: 'commercial', dir: 'E', dist: 1 }], fpOf);
ok('block census matches block agents too', A.censusForBlock(SEED, feet).people === agents.length);

const sim = A.makeSim(res, feet, agents, { fpOf, doorOf, startTurn: 0 });
const MODE_OF = { home: 'in', work: 'away', street: 'out' };
let agree = true, checked = 0;
for (let t = 0; t < A.DAY_TURNS * 1.2; t++) {
  sim.step();
  if (sim.turn % 30 !== 0) continue;
  for (const a of agents) {
    const b = A.whereAt(a, sim.turn);
    const into = A.tod(sim.turn) - b.t0, len = b.t1 - b.t0;
    if (len < 240 || into < 185) continue;      // only deep into LONG blocks (walks take time)
    checked++;
    if (a.loc.mode !== MODE_OF[b.where]) agree = false;
  }
}
ok('OFFLINE/ONLINE AGREEMENT: deep in long blocks, bodies are where the schedule says (' + checked + ' spot checks)',
  agree && checked > 50);

// 6. offline plane is cheap: a whole day of valley summaries, zero stepping
const t0 = Date.now();
let sums = 0;
for (let t = 0; t < A.DAY_TURNS; t += 15) sums += A.offlineSummary(agents, t).home;
const ms = Date.now() - t0;
ok('offline plane is cheap (96 day-summaries in ' + ms + 'ms, no sim)', ms < 500 && sums > 0);

console.log('POPULATION GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
