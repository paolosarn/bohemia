// DEVIATION GATE (7/19/26, LIFE session) — events may bend a life, never
// break it. FACTORY LAW gate for the bounded-deviation engine (rung 4b, the
// Radiant AI lesson made law). Proves:
//   1. UNBOUNDED IS REJECTED: a deviation without an expiry never enters the
//      sim (nobody wanders off their life forever)
//   2. THE CAP HOLDS: at most DEVIATION_CAP of the population deviates at
//      once ("never more than a handful")
//   3. goto works: the agent leaves the plan, reaches the point, and after
//      expiry RE-CONVERGES to wherever the schedule says
//   4. stay_home shelters, flee gains distance from the threat point
//   5. OCCUPANCY survives a day full of deviations
//   6. the offline plane stays the PLAN (whereAt ignores deviations)
//   7. deterministic
/* 8/4/26 — THIS GATE WAS NOT RED, IT WAS CRASHING, and a crash is a gate that
   asserts nothing at all. `TypeError: Cannot set properties of undefined` at
   `agent.dev=` : sim.agents[0] did not exist, because its fixture block held
   nobody. Same root cause as LIFE / DRESS / POPULATION / MEMORY, and it was not
   even on the list of four - full story and measurements in
   gates/bohemia_block_fixture.js. In one line: written 7/19 at OCCUPIED_RATE
   0.30 where every seed came up populated, and the rate has been a correct
   0.038 since 8/1, where a 20-home block averages 0.76 occupied houses.
   THE SUBJECTS ARE FOUND, NEVER ASSUMED - which is exactly the fix this gate
   already made for itself on 7/31 ("FIND THE SUBJECTS, DO NOT ASSUME THE
   MINUTE"), applied one level further out: to the block, not just the minute.
   A DEVIATION IS A THING THAT HAPPENS TO A PERSON. It needs several people in
   one place to test the cap and re-convergence at all, and the die-off means a
   single block rarely has them - so the block is chosen as the most populated
   of the survey, deterministically, and the count it found is asserted out
   loud. This gate is about bounded deviation, not about the census; life_gate
   and population_gate own the census claim and assert it over 40 blocks. */
const A = require('../engine/bohemia_agents.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
const FIX = require('./bohemia_block_fixture.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const SURVEY = FIX.survey(40);
const BLOCK = SURVEY.inhabited.slice().sort(
  (a, b) => (b.agents.length - a.agents.length) || (a.seed - b.seed))[0];
const SEED = BLOCK.seed;
const res = BLOCK.res, feet = BLOCK.feet, fpOf = BLOCK.fpOf, doorOf = BLOCK.doorOf;
const G = res.g, WD = res.W, HT = res.H;
const JOBS = FIX.JOBS;
ok('there is a block with enough people to deviate (seed ' + SEED + ', ' +
  BLOCK.agents.length + ' residents; ' + SURVEY.people + ' people over ' +
  SURVEY.n + ' blocks) — a fixture that finds nobody must say so, not crash on agents[0]',
  BLOCK.agents.length >= 3);
const mkSim = () => {
  const agents = A.agentsForBlock(SEED, feet, JOBS, fpOf);
  return A.makeSim(res, feet, agents, { fpOf, doorOf, startTurn: 0 });
};

// a road cell to send people to (the rally point)
let rally = null;
for (let y = HT - 2; y > 0 && !rally; y--) for (let x = 1; x < WD - 1; x++)
  if (G[y][x] === 1) { rally = [x, y]; break; }

// 1+2: bounds
const sim = mkSim();
for (let t = 0; t < 10 * 60; t++) sim.step();          // run to 10:00
ok('unbounded deviation rejected', A.deviate(sim, sim.agents[0], { kind: 'goto', x: rally[0], y: rally[1] }).ok === false);
ok('expired deviation rejected', A.deviate(sim, sim.agents[0], { kind: 'goto', x: rally[0], y: rally[1], until: sim.turn - 1 }).ok === false);
let accepted = 0, rejected = 0;
sim.agents.forEach(a => {
  const r = A.deviate(sim, a, { kind: 'goto', x: rally[0], y: rally[1], until: sim.turn + 300 });
  r.ok ? accepted++ : rejected++;
});
const cap = Math.max(1, Math.floor(sim.agents.length * A.DEVIATION_CAP));
ok('THE CAP HOLDS: ' + accepted + ' of ' + sim.agents.length + ' allowed off-plan (cap ' + cap + ')',
  accepted === cap && rejected === sim.agents.length - cap);

// 3: goto + re-convergence, on a fresh sim
const sim2 = mkSim();
for (let t = 0; t < 10 * 60; t++) sim2.step();
const subject = sim2.agents.find(a => a.loc.mode === 'out') || sim2.agents[0];
A.deviate(sim2, subject, { kind: 'goto', x: rally[0], y: rally[1], until: sim2.turn + 240 });
let reached = false;
for (let t = 0; t < 240; t++) {
  sim2.step();
  if (subject.loc.mode === 'out' && Math.abs(subject.loc.x - rally[0]) + Math.abs(subject.loc.y - rally[1]) <= 1) reached = true;
}
ok('goto: the agent leaves the plan and reaches the point', reached);
// after expiry, run deep into a long block and check re-convergence
const MODE_OF = { home: 'in', work: 'away', street: 'out' };
let reconverged = false;
for (let t = 0; t < 6 * 60; t++) {
  sim2.step();
  const b = A.whereAt(subject, sim2.turn);
  if (b.t1 - b.t0 >= 240 && A.tod(sim2.turn) - b.t0 >= 185 && subject.loc.mode === MODE_OF[b.where]) { reconverged = true; break; }
}
ok('RE-CONVERGENCE: after expiry the agent returns to the scheduled life', reconverged && !subject.dev);

// 4: stay_home + flee
const sim3 = mkSim();
/* FIND THE SUBJECTS, DO NOT ASSUME THE MINUTE (7/31).
   This stepped to exactly 11:00 and required 2 people already outside. That made
   the PRECONDITION depend on block density: when Paolo's 4x5 driveway ruling made
   lots deeper, the block held fewer homes, 11:00 happened to have fewer than two
   people out, and this gate went red on its fixture rather than on anything it
   exists to test. The assertions below are UNCHANGED -- they still test that a
   deviation bends a life and that the agent re-converges. Only the search for two
   test subjects is now robust: walk the day until the street has them.
   Density is WALKABLE-LAND's job and has its own gate; it is not this one's. */
let outs = [];
for (let t = 0; t < 24 * 60 && outs.length < 2; t++) {
  sim3.step();
  if (t >= 6 * 60) outs = sim3.agents.filter(a => a.loc.mode === 'out');
}
ok('the day contains a moment with people on the street to test with', outs.length >= 2);
const homer = outs[0], runner = outs[1];
A.deviate(sim3, homer, { kind: 'stay_home', until: sim3.turn + 200 });
const threat = [runner.loc.x, runner.loc.y];
A.deviate(sim3, runner, { kind: 'flee', x: threat[0], y: threat[1], until: sim3.turn + 60 });
let sheltered = false, fled = false, d0 = 0;
for (let t = 0; t < 200; t++) {
  sim3.step();
  if (homer.loc.mode === 'in') sheltered = true;
  const d = runner.loc.mode === 'out' ? Math.abs(runner.loc.x - threat[0]) + Math.abs(runner.loc.y - threat[1]) : d0;
  if (d > d0) d0 = d;
}
ok('stay_home shelters the agent indoors', sheltered);
ok('flee gains distance from the threat (' + d0 + ' tiles)', d0 >= 5);

// 5: occupancy through a deviation-heavy day
const sim4 = mkSim();
let occOk = true;
for (let t = 0; t < A.DAY_TURNS; t++) {
  sim4.step();
  if (t === 9 * 60) sim4.agents.slice(0, 3).forEach(a => A.deviate(sim4, a, { kind: 'goto', x: rally[0], y: rally[1], until: sim4.turn + 180 }));
  const seen = {};
  sim4.agents.forEach(a => { if (a.loc.mode === 'out') { const k = a.loc.x + ',' + a.loc.y; if (seen[k]) occOk = false; seen[k] = 1; } });
}
ok('OCCUPANCY survives a deviation-heavy day', occOk);

// 6: the offline plane is the PLAN, deviation never rewrites it
const simB = mkSim();
for (let t = 0; t < 10 * 60; t++) simB.step();
const agentB = simB.agents[0];
const planBefore = JSON.stringify(A.whereAt(agentB, simB.turn + 60));
A.deviate(simB, agentB, { kind: 'goto', x: rally[0], y: rally[1], until: simB.turn + 120 });
ok('the offline plane stays the plan (whereAt untouched by deviation)',
  JSON.stringify(A.whereAt(agentB, simB.turn + 60)) === planBefore);

// 7: determinism with identical deviations
const runDet = () => {
  const s = mkSim();
  for (let t = 0; t < 10 * 60; t++) s.step();
  A.deviate(s, s.agents[1], { kind: 'goto', x: rally[0], y: rally[1], until: s.turn + 200 });
  for (let t = 0; t < 400; t++) s.step();
  return JSON.stringify(s.agents.map(a => [a.id, a.loc]));
};
ok('deterministic under identical deviations', runDet() === runDet());

console.log('DEVIATION GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
