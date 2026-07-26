// MEMORY GATE (7/19/26, LIFE session) — witnesses must stay lawful. FACTORY
// LAW gate for bohemia_memory (the seed of the questbook's missing-persons
// organ, Q133/Q134/Q138). Proves:
//   1. sightings accumulate during a real sim day, only of real co-visible
//      bodies (valid coords, never self)
//   2. clarity DECAYS with age (a witness never gets surer over time) and
//      FAMILIARITY slows the decay (neighbors outlast strangers)
//   3. the ring buffer cap holds (memory is finite), refresh-not-flood works
//   4. recall returns the LATEST usable sighting; lastSeenAcross finds the
//      best witness in the settlement ("when did anyone last see H3-2")
//   5. an agent who left for work is still findable through witnesses
//   6. deterministic (two identical sims -> identical minds)
const A = require('../engine/bohemia_agents.js');
const M = require('../engine/bohemia_memory.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// ---- pure decay laws --------------------------------------------------------
const mind = M.makeMind('W1', 8);
M.see(mind, 100, 'S1', 5, 5);
const c1h = M.clarity(mind, mind.sightings[0], 100 + 60);
const c6h = M.clarity(mind, mind.sightings[0], 100 + 360);
const c3d = M.clarity(mind, mind.sightings[0], 100 + 3 * 1440);
ok('clarity decays with age (1h ' + c1h.toFixed(2) + ' > 6h ' + c6h.toFixed(2) + ' > 3d ' + c3d.toFixed(3) + ')',
  c1h > c6h && c6h > c3d && c1h <= 1);

const famMind = M.makeMind('W2', 8);
for (let t = 0; t < 10; t++) M.see(famMind, t * 120, 'N1', 3, 3);   // the neighbor, seen all day
const strMind = M.makeMind('W3', 8);
M.see(strMind, 1080, 'X1', 3, 3);                                   // the stranger, seen once
const cFam = M.recall(famMind, 'N1', 1080 + 720).clarity;
const cStr = M.recall(strMind, 'X1', 1080 + 720).clarity;
ok('familiarity slows the fog (neighbor ' + cFam + ' > stranger ' + cStr + ' at same age)', cFam > cStr);

// ring + refresh
const ring = M.makeMind('W4', 4);
for (let i = 0; i < 12; i++) M.see(ring, i * 100, 'P' + i, i, i);
ok('ring buffer cap holds (12 seen, ' + ring.sightings.length + ' kept)', ring.sightings.length === 4);
const ref = M.makeMind('W5', 4);
M.see(ref, 0, 'Q1', 1, 1); M.see(ref, 10, 'Q1', 2, 2);
ok('re-seeing refreshes, never floods', ref.sightings.length === 1 && ref.sightings[0].x === 2);

// recall picks latest usable
M.see(ref, 200, 'Q1', 9, 9);
const r = M.recall(ref, 'Q1', 260);
ok('recall returns the latest sighting', r && r.x === 9 && r.turn === 200);

// ---- on the real sim --------------------------------------------------------
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
const JOBS = [{ district: 'commercial', dir: 'E', dist: 1 }];
function runDay() {
  const agents = A.agentsForBlock(SEED, feet, JOBS, fpOf);
  const sim = M.attach(A.makeSim(res, feet, agents, { fpOf, doorOf, startTurn: 0 }));
  for (let t = 0; t < A.DAY_TURNS; t++) sim.step();
  return sim;
}
const sim = runDay();
const total = M.minds(sim).reduce((n, m) => n + m.sightings.length, 0);
ok('a sim day produces witnesses (' + total + ' sightings held)', total > 0);

let valid = true;
M.minds(sim).forEach(m => m.sightings.forEach(s => {
  if (s.subject === m.owner) valid = false;
  if (s.subject !== '@' && !sim.agents.find(a => a.id === s.subject)) valid = false;
  if (s.x < 0 || s.y < 0 || s.x >= WD || s.y >= HT) valid = false;
}));
ok('every sighting is a real body at real coords, never self', valid);

// the missing-persons seed: a worker went away; who saw them last?
const away = sim.agents.find(a => a.loc.mode === 'away' || a.job.kind === 'site');
const seen = away ? M.lastSeenAcross(M.minds(sim), away.id, sim.turn) : null;
ok('MISSING-PERSONS SEED: "' + (away ? away.id : '?') + ' left for work, who saw them last?" is answerable',
  !!seen && seen.r.clarity > 0 && typeof seen.witness === 'string');

// determinism
const sim2 = runDay();
ok('minds are deterministic (two identical days, identical memories)',
  JSON.stringify(M.minds(sim).map(m => m.sightings)) === JSON.stringify(M.minds(sim2).map(m => m.sightings)));

console.log('MEMORY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + total + ' sightings)');
process.exit(fail ? 1 : 0);
