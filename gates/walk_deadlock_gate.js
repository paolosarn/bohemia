/* BOHEMIA WALK DEADLOCK GATE (8/4/26) — nobody stands in the street all day.
 *
 * THE BUG THIS LOCKS, measured on block seed 9 before the fix:
 *
 *     H5-3   @111,18   wants 111,17   - held by H14-1
 *     H14-1  @111,17   wants 111,18   - held by H5-3
 *
 * Two people who wanted to swap cells, each one's next step being the other
 * one's body. Neither moved for 1,589 and 1,533 turns - over a game DAY each -
 * on walks home of 173 and 165 steps, while everybody else on the block walked
 * home at one cell per turn. Both had free neighbours the whole time; it was an
 * open street, not a corridor. The blocked branch said `a._path=null; // wait,
 * replan next turn`, and replanning cannot help: path() is a deterministic BFS
 * over the STATIC grid, so it hands back the same route into the same body
 * forever.
 *
 * WHY IT WAS INVISIBLE FOR THREE DAYS: population_gate is the gate that catches
 * walk bugs - it caught the gate-cell regression on 8/1 and the sidewalk-as-wall
 * regression on 7/31, both recorded in engine/bohemia_agents.js. It went blind
 * on 8/1 when OCCUPIED_RATE became 0.038 and its one fixture block rolled empty:
 * "0 spot checks" passed for "agreement". Fixed to survey 40 blocks it went from
 * 0 checks to 1,905 and put this on the first run.
 *
 * FOUR CLAIMS, and the last two are the ones that matter:
 *   1. the ENGINE routes around a blocked body (the fix exists)
 *   2. EVERY SLICE THAT INLINES IT CARRIES THE SAME BODY, byte for byte - the
 *      one Paolo walks included. An engine fix that never reaches his surface
 *      is not a fix (7/18: VERIFY ON THE REAL SURFACE).
 *   3. A REAL DEADLOCK IS BUILT AND BROKEN: two agents forced to swap cells in
 *      an open street both reach their targets. This is the regression test -
 *      it fails if the detour is ever removed, no matter how the code is
 *      spelled.
 *   4. OCCUPANCY LAW and the one-step rule survive the detour.
 *
 *   node gates/walk_deadlock_gate.js
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

const A = require('../engine/bohemia_agents.js');
const FIX = require('./bohemia_block_fixture.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// ---- 1. the engine ---------------------------------------------------------
const eng = fs.readFileSync('engine/bohemia_agents.js', 'utf8');
const cut = (s, from, to) => {
  const i = s.indexOf(from); if (i < 0) return null;
  const j = s.indexOf(to, i); if (j < 0) return null;
  return s.slice(i, j + to.length);
};
const ENG_WALK = cut(eng, '    function walkTo(a,to,arrive){', '// boxed in: wait, replan next turn\n    }\n');
const ENG_PATH = cut(eng, '    // BFS path on the exterior grid', '      return null;\n    }\n');
ok('the engine walkTo exists and routes AROUND a blocked body', !!ENG_WALK && ENG_WALK.indexOf('path([a.loc.x,a.loc.y],to,a.id)') >= 0);
ok('the engine path() takes an avoidFor set (bodies as walls)', !!ENG_PATH && ENG_PATH.indexOf('avoidFor') >= 0);
ok('the detour still respects OCCUPANCY before it moves anybody',
  !!ENG_WALK && /if\(det&&occFree\(det\[0\],det\[1\],a\.id\)\)/.test(ENG_WALK));
/* THE ONE-STEP TRAP, WRITTEN WRONG THE FIRST TIME AND CAUGHT BY THIS FILE.
   a._path and `around` are the SAME array, so shift() mutates both: reading
   around[1] after the shift hands back the cell TWO ahead (a two-cell teleport)
   and crashes outright when the detour is one step long. The success branch
   above avoids it by capturing `nxt` first; the detour has to capture `det`. */
ok('the detour captures its step BEFORE shift() mutates the path (the two-cell teleport)',
  !!ENG_WALK && ENG_WALK.indexOf('var det=(around&&around.length>1)?around[1]:null;') >= 0 &&
  ENG_WALK.indexOf('place(a,det[0],det[1])') >= 0);

// ---- 2. every carrier, byte for byte ---------------------------------------
/* THE SYNC GATE DOES NOT POLICE THIS MODULE. These four files inline walkTo
   verbatim and nothing was going to notice if one of them fell behind. The one
   that matters most is BOHEMIA_CITY_WORLD.html: that is the walked world, the
   surface the RUN tab opens. */
const CARRIERS = [
  'slices/BOHEMIA_CITY_WORLD.html',
  'slices/BOHEMIA_RUN_CURRENT.html',
  'slices/BOHEMIA_LIFE_SLICE_7_19_26.html',
  'slices/BOHEMIA_SUBURB_WALK_7_18_26.html',
];
for (const f of CARRIERS) {
  if (!fs.existsSync(f)) { ok(f + ': exists', false); continue; }
  const s = fs.readFileSync(f, 'utf8');
  ok(f.replace('slices/', '') + ': carries the ENGINE walkTo byte for byte', ENG_WALK && s.indexOf(ENG_WALK) >= 0);
  ok(f.replace('slices/', '') + ': carries the ENGINE path() byte for byte', ENG_PATH && s.indexOf(ENG_PATH) >= 0);
  ok(f.replace('slices/', '') + ': the old stand-there-forever branch is GONE',
    s.indexOf('// blocked body: wait, replan next turn') < 0);
}

// ---- 3. stand in somebody's way and watch them go around -------------------
/* THE REGRESSION TEST, and it is deliberately not a text match. PAOLO IS THE
   BLOCKER, because he is the one who will actually do this: OCCUPANCY LAW
   includes the player, so a person standing in a doorway used to freeze an NPC
   in place for the rest of the day. Here a walking agent is given a destination
   and then the player is parked ON ITS NEXT CELL, every turn, for as long as it
   takes. Before the fix the agent replanned the same blocked route forever and
   never moved again. After it, it walks around and arrives.
   Driven entirely through the public sim - deviate() to give the order,
   sim.playerAt to stand in the way. */
const b = FIX.build(9);
const G = b.res.g, W = b.res.W, H = b.res.H;
const passable = (x, y) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return false;
  const c = G[y][x]; return c === 0 || c === 1 || c === 3 || c === 5 || c === 10;
};
let rally = null;
for (let y = H - 2; y > 0 && !rally; y--) for (let x = 1; x < W - 1; x++)
  if (G[y][x] === 1) { rally = [x, y]; break; }
ok('found a rally point to send somebody to', !!rally);

const sim = A.makeSim(b.res, b.feet, b.agents, { fpOf: b.fpOf, doorOf: b.doorOf, startTurn: 0 });
for (let t = 0; t < 11 * 60; t++) sim.step();               // run to mid-morning
const subject = sim.agents.find(a => a.loc.mode === 'out');
ok('somebody is out on the street to be blocked', !!subject);
if (subject && rally) {
  const r = A.deviate(sim, subject, { kind: 'goto', x: rally[0], y: rally[1], until: sim.turn + 900 });
  ok('the order to walk to the rally point was accepted', r.ok === true);
  let arrived = -1, occHolds = true, oneStep = true, blockedTurns = 0;
  let prev = [subject.loc.x, subject.loc.y];
  for (let t = 0; t < 900; t++) {
    /* PARK THE PLAYER ON THE CELL THEY ARE ABOUT TO STEP INTO. Every turn. */
    if (subject.loc.mode === 'out' && subject._path && subject._path.length > 1) {
      sim.playerAt = [subject._path[1][0], subject._path[1][1]];
      blockedTurns++;
    } else sim.playerAt = null;
    sim.step();
    if (subject.loc.mode === 'out' &&
      Math.abs(subject.loc.x - rally[0]) + Math.abs(subject.loc.y - rally[1]) <= 1) { arrived = t; break; }
    const seen = {};
    for (const a of sim.agents) {
      if (a.loc.mode !== 'out') continue;
      const k = a.loc.x + ',' + a.loc.y;
      if (seen[k]) occHolds = false;
      seen[k] = 1;
      if (sim.playerAt && a.loc.x === sim.playerAt[0] && a.loc.y === sim.playerAt[1]) occHolds = false;
    }
    if (subject.loc.mode === 'out') {
      if (Math.abs(subject.loc.x - prev[0]) + Math.abs(subject.loc.y - prev[1]) > 1) oneStep = false;
      prev = [subject.loc.x, subject.loc.y];
    }
  }
  ok('THE DEADLOCK BREAKS: with the player standing in their way every single turn (' +
    blockedTurns + ' of them), ' + subject.id + ' still reached the rally point at t=' + arrived +
    ' — before the fix they would have stood there forever', arrived >= 0);
  ok('OCCUPANCY LAW held throughout, PLAYER INCLUDED (nobody ever shared a cell)', occHolds);
  ok('and every move was ONE step (the detour never teleports)', oneStep);
}
sim.playerAt = null;

// ---- 4. and the walk home is not 9x its own length any more ----------------
/* THE ORIGINAL SYMPTOM, kept as its own claim because it is the one a person
   would notice: everyone's walk home should cost about its distance. Before the
   fix, two of six residents on this block took 1,589 and 1,533 turns for walks
   of 173 and 165 steps. */
const sim2 = A.makeSim(b.res, b.feet, b.agents, { fpOf: b.fpOf, doorOf: b.doorOf, startTurn: 0 });
const doorFor = {};
Object.keys(b.doorOf).forEach(k => { doorFor[b.doorOf[k]] = k.split(',').map(Number); });
const started = {}, arrived = {}, dist = {};
for (let t = 0; t < A.DAY_TURNS * 2; t++) {
  sim2.step();
  for (const a of b.agents) {
    const blk = A.whereAt(a, sim2.turn);
    if (blk.where === 'home' && a.loc.mode === 'out' && started[a.id] == null) {
      started[a.id] = sim2.turn;
      const d = doorFor[a.home.building];
      if (d) dist[a.id] = Math.abs(a.loc.x - d[0]) + Math.abs(a.loc.y - d[1]);
    }
    if (started[a.id] != null && arrived[a.id] == null && a.loc.mode === 'in') arrived[a.id] = sim2.turn;
  }
}
let worst = 0, worstWho = '';
for (const a of b.agents) {
  if (arrived[a.id] == null || !dist[a.id]) continue;
  const r = (arrived[a.id] - started[a.id]) / dist[a.id];
  if (r > worst) { worst = r; worstWho = a.id; }
}
ok('every walk home costs about its own distance (worst is ' + worstWho + ' at ' +
  worst.toFixed(2) + 'x — it was 9.2x before the fix)', worst > 0 && worst < 1.5);

console.log('WALK DEADLOCK GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
