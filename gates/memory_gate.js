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
/* 8/4/26 — see gates/bohemia_block_fixture.js for why this gate was red on main
   for its whole visible history: written 7/19 at OCCUPIED_RATE 0.30 where one
   block at seed 7 always held people, and the rate is 0.038 since 8/1 (correct,
   derived arithmetic), where seed 7 rolls empty and "0 sightings held" is what
   an empty block truthfully produces.
   AND THE TRAP ONE LEVEL DOWN, which is why this gate surveys instead of just
   picking a populated seed: measured, seed 3 answers the missing-persons
   question, seeds 9, 21, 25 and 39 do not, and seed 39's six residents never
   see each other at all in a whole day. Six people spread over twenty-one
   houses genuinely may not meet - THAT IS THE DEAD WORLD WORKING. Picking the
   seed that passes is choosing the coin. So the claims below ask the VALLEY:
   does memory accumulate somewhere, is the missing-persons organ answerable
   somewhere, and are the laws that must hold EVERYWHERE (never self, real
   coords, deterministic) still holding on every block at once. */
const A = require('../engine/bohemia_agents.js');
const M = require('../engine/bohemia_memory.js');
const SUB = require('../engine/bohemia_suburb.js');
const FP = require('../engine/bohemia_floorplan.js');
const FIX = require('./bohemia_block_fixture.js');

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

// ---- on the real sim, ACROSS THE VALLEY -------------------------------------
const SURVEY = FIX.survey(40);
const runDay = b => FIX.simDay(b, { attach: M.attach });

let total = 0, blocksWithSight = 0, answerable = 0, answeredOn = null;
let valid = true, deterministic = true;
for (const b of SURVEY.inhabited) {
  const sim = runDay(b);
  const minds = M.minds(sim);
  const n = minds.reduce((s, m) => s + m.sightings.length, 0);
  total += n;
  if (n > 0) blocksWithSight++;

  // laws that must hold on EVERY block, sightings or not
  minds.forEach(m => m.sightings.forEach(s => {
    if (s.subject === m.owner) valid = false;
    if (s.subject !== '@' && !sim.agents.find(a => a.id === s.subject)) valid = false;
    if (s.x < 0 || s.y < 0 || s.x >= b.res.W || s.y >= b.res.H) valid = false;
  }));

  // the missing-persons seed: a worker went away; who saw them last?
  const away = sim.agents.find(a => a.loc.mode === 'away' || a.job.kind === 'site');
  const seen = away ? M.lastSeenAcross(minds, away.id, sim.turn) : null;
  if (seen && seen.r.clarity > 0 && typeof seen.witness === 'string') {
    answerable++;
    if (!answeredOn) answeredOn = b.seed + '/' + away.id;
  }

  // determinism, re-simmed block by block (a whole valley of identical days)
  const again = runDay(b);
  if (JSON.stringify(minds.map(m => m.sightings)) !==
      JSON.stringify(M.minds(again).map(m => m.sightings))) deterministic = false;
}

ok('a valley day produces witnesses (' + total + ' sightings across ' + blocksWithSight +
  ' of ' + SURVEY.inhabited.length + ' inhabited blocks, ' + SURVEY.people + ' people)', total > 0);
ok('and the quiet blocks are LEGAL, not broken: some inhabited blocks produce no sightings at all (' +
  (SURVEY.inhabited.length - blocksWithSight) + ' of ' + SURVEY.inhabited.length +
  '), because six people over twenty houses may never meet - the dead world working',
  blocksWithSight < SURVEY.inhabited.length && blocksWithSight > 0);
ok('every sighting on every block is a real body at real coords, never self', valid);
ok('MISSING-PERSONS SEED: "who saw them last?" is answerable somewhere in the valley (' +
  answerable + ' of ' + SURVEY.inhabited.length + ' blocks, first at ' + answeredOn + ')',
  answerable > 0);
ok('minds are deterministic across the whole survey (every block re-simmed, identical memories)',
  deterministic);

console.log('MEMORY GATE: ' + pass + ' passed, ' + fail + ' failed  (' + total + ' sightings)');
process.exit(fail ? 1 : 0);
