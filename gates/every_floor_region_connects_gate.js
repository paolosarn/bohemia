/* EVERY FLOOR REGION CONNECTS — the second leg of rule 34(b) (9/28/26, LIFE + CITY, [honest grid])
 *
 * Paolo 9/27, rule 34, LOCKED: THE GRID IS HONEST -- every floor region connects to the
 * street. laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md s2. The first leg (every cell has a
 * class) is gates/every_cell_has_a_class_gate.js. This is the second.
 *
 * *** WHAT WAS MEASURED WHEN THIS WAS WRITTEN. *** Every one of the 72 registered districts,
 * one fixed seed, flooded from every standable cell on its border (the generous reading, so
 * every count is a floor under the truth):
 *
 *     standable floor walled in with no gap        25,544 cells in 40 districts
 *
 * and most of it was NOT a missing door. It was a thing you step over, classed as a wall by
 * its kind DEFAULT, so nobody had chosen it: the sign district's KERB sealed its whole parking
 * lot (1,394 cells), and the reclamation plant's POND BERM -- the thing its own legend says
 * the service road runs along the top of -- sealed 2,734. Both fixed, both to zero: 20,927.
 * Then the chapel, the Church's home base, got the gates its own notes describe: 18,645.
 * (Numbers re-measured with the game's own generate call; see the lib's block().) The rest are real
 * missing gates (a fenced substation with a road inside, the stadium field inside the stands,
 * courtyards inside roof edges) and are listed, frozen, and owed.
 *
 * THIS IS A RATCHET, NOT A PASS MARK. A gate that demanded zero today would be red for
 * reasons that are other people's generators, and a red gate everybody learns to ignore is
 * worse than no gate. So the per-district counts are FROZEN in
 * gates/every_floor_region_connects_baseline.json and may only go DOWN:
 *   - a district whose sealed count RISES fails, by name, with its biggest pocket's contents;
 *   - a district at ZERO must stay at zero;
 *   - a district that improved passes and says so, so the baseline gets lowered;
 *   - a district that is not in the baseline at all (new) must be ZERO. New ground is born
 *     honest; the debt is closed to new entries.
 *
 * ISLANDS ARE ALLOWED AND COUNTED, NEVER RATCHETED. Ground reached only across a void (water,
 * a pit) is an island, and an island is the truth: you can see it and you cannot walk to it.
 * The dam's exposed rock out in the reservoir became islands the round deep water stopped
 * being pavement. That is the grid being honest, and punishing it would push somebody to make
 * the water walkable again.
 *
 * Run:  node gates/every_floor_region_connects_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ENGINE = path.join(ROOT, 'engine');
const BASE = path.join(__dirname, 'every_floor_region_connects_baseline.json');

/* engine modules run self-tests at require time and exit when they finish */
const realExit = process.exit;
process.exit = function () {};
/* ...and print their own ok-lists while they do it. Muted while loading so this gate's
   output is this gate's findings, not four hundred lines of other people's tests. */
const realLog = console.log;
console.log = function () {};
const K = require(path.join(ENGINE, 'bohemia_district_kit.js'));
for (const f of fs.readdirSync(ENGINE).filter(n => n.endsWith('.js'))) {
  try { require(path.join(ENGINE, f)); } catch (e) { /* not every engine file is a district */ }
}
process.exit = realExit;
console.log = realLog;
const R = require('./every_floor_region_connects_lib.js');

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
};

if (!fs.existsSync(BASE)) {
  console.log('REFUSING: ' + path.relative(ROOT, BASE) + ' is not there. A ratchet with no ' +
              'frozen line is a gate that passes anything.');
  process.exit(1);
}
const base = JSON.parse(fs.readFileSync(BASE, 'utf8')).sealed || {};

const types = K.types().filter(t => !t.startsWith('__')).sort();
ok('districts are registered', types.length > 20, types.length + ' districts');

/* ---- A. THE RATCHET ------------------------------------------------------------- */
let total = 0, islands = 0, rose = [], improved = [], fresh = [], errors = [];
const results = {};
for (const t of types) {
  const r = R.measure(K, t);
  if (!r) continue;
  if (r.error) { errors.push(t + ': ' + r.error); continue; }
  results[t] = r;
  total += r.sealed; islands += r.island;
  if (!(t in base)) { if (r.sealed > 0) fresh.push(t + ' ' + r.sealed); continue; }
  if (r.sealed > base[t]) rose.push(t + ' ' + base[t] + ' -> ' + r.sealed);
  else if (r.sealed < base[t]) improved.push(t + ' ' + base[t] + ' -> ' + r.sealed);
}
ok('every district generates a block', errors.length === 0, errors.join('; ') || 'all');
ok('NO district has MORE sealed floor than its frozen line', rose.length === 0,
   rose.join(', ') || 'none rose');
ok('a district new since the freeze is born honest (zero sealed)', fresh.length === 0,
   fresh.join(', ') || 'none');
const zeroes = Object.keys(base).filter(t => base[t] === 0);
const zeroHeld = zeroes.filter(t => results[t] && results[t].sealed === 0).length;
ok('every district frozen at zero is still at zero', zeroHeld === zeroes.length,
   zeroHeld + '/' + zeroes.length);
if (improved.length) console.log('       IMPROVED, lower these in the baseline: ' + improved.join(', '));
console.log('       valley now: ' + total + ' sealed cells (frozen at ' +
            Object.values(base).reduce((a, b) => a + b, 0) + '), ' + islands + ' island cells');

/* ---- B. THE TWO THAT STARTED THIS STAY FIXED -------------------------------------- */
/* Named, because a regression here is a parking lot with no way in, or a pond field whose
   road-carrying berms turned back into walls. */
for (const [t, what] of [['sign', 'the parking lot behind its kerb'],
                         ['reclaim', 'the pond field along its berms']]) {
  ok('the ' + t + ' district: ' + what + ' is reachable', results[t] && results[t].sealed === 0,
     results[t] ? results[t].sealed + ' sealed' : 'missing');
}
/* THE CHURCH'S HOME BASE (9/28). The chapel is where the Church sits on every seed (rule 37e,
   a home base you can raid), and its memorial court and orchard -- 2,296 cells -- were walled
   on every side because the gap in the south wall landed on the nave. Each half of the court
   has its gate now. What is left is 14 cells, the hollow of the fallen bell and the middle of
   the churchyard cross, both drawing choices; anything above that means the gates are gone. */
ok('the Church\'s home base: the memorial court has its gates (at most 14 sealed)',
   results.chapel && results.chapel.sealed <= 14,
   results.chapel ? results.chapel.sealed + ' sealed' : 'missing');
/* And islands stay islands: the dam's rock out in the reservoir is reached only across water,
   never walked to and never sealed. If this flips to SEALED, something walled the lake; if it
   flips to walkable, somebody made the water floor again. */
const dam = results.dam;
ok('the dam\'s rock in the reservoir is an ISLAND: not sealed, not walkable',
   !!dam && dam.sealed === 0 && dam.island > 0,
   dam ? ('sealed ' + dam.sealed + ', island ' + dam.island) : 'missing');

/* ---- C. MUTATION: THE MEASUREMENT MUST BE ABLE TO SEE A SEAL --------------------- */
/* A checker that cannot be made to fail is not a checker. A tiny district: an open field
   with a walled 4x4 yard in the middle and no gate, and a pond with a dry rock in it. */
K.register('__sealtest', {
  generate: () => {
    const g = [];
    for (let y = 0; y < 16; y++) { const row = []; for (let x = 0; x < 16; x++) row.push(0); g.push(row); }
    for (let y = 3; y <= 8; y++) for (let x = 3; x <= 8; x++) g[y][x] = (y === 3 || y === 8 || x === 3 || x === 8) ? 1 : 0;
    for (let y = 10; y <= 14; y++) for (let x = 10; x <= 14; x++) g[y][x] = 2;
    g[12][12] = 0;
    return { g: g };
  },
  body: () => false, palette: {},
  legend: { 0: { name: 'yard', kind: 'ground' }, 1: { name: 'wall', kind: 'fence' },
            2: { name: 'deep water', kind: 'water', 'void': true } }
});
const m = R.measure(K, '__sealtest');
ok('MUTATION: a walled yard with no gate is caught as SEALED', m && m.sealed === 16,
   m ? m.sealed + ' sealed (expected 16)' : 'no result');
ok('MUTATION: a dry rock in a pond is an ISLAND, not a seal', m && m.island === 1,
   m ? m.island + ' island (expected 1)' : 'no result');

console.log('\nEVERY FLOOR REGION CONNECTS GATE: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
