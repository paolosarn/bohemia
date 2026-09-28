/* EVERY CELL HAS A CLASS — the gate rule 34(b) was owed (9/27/26, LIFE + CITY, [honest grid])
 *
 * Paolo 9/27, rule 34, LOCKED: "one house doesn't equal one tile, it's all fucked up."
 * laws/BOHEMIA_LAW_TWO_SCALES_ONE_GAME_9_27_26.md s2: THE GRID IS HONEST -- every cell is
 * FLOOR, WALL, DOOR, COVER or PROP, and the drawing agrees with it cell for cell.
 *
 * A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED, and this one had no gate at all.
 *
 * *** WHAT THIS CATCHES, AND IT WAS NOT HYPOTHETICAL. *** Every cell's class comes from
 * one table, KIND_LAYER in the district kit: kind -> {layer, solid}. tileLayer() falls back
 * to {ground, not solid} for a kind the table has never heard of. THE FALLBACK IS SILENT,
 * so a typo or a new word does not fail, it becomes ORDINARY WALKABLE FLOOR.
 *
 * Measured on clean main the round this was written: 72 registered districts, 1,171 legend
 * entries, 19 kinds in use, and EXACTLY ONE missing from the table -- `water`, on three
 * entries. On a generated block that was 5,329 cells of the dam's reservoir and tailrace
 * (a THIRD of the block) and 534 of the fort's creek standing as pavement. The vocabulary
 * already had `water-dead` for the dry ones and 20 of the valley's 25 water cells used it
 * correctly; the five live ones were where it fell apart.
 *
 * THE GATE READS THE TABLE, IT DOES NOT KEEP A COPY. A checker holding its own list of
 * legal kinds is the same bug one level up: the list drifts, the gate stays green, and the
 * thing it was built to catch walks straight past. KIND_LAYER is required out of the kit
 * and if that export ever disappears this gate REFUSES rather than passing vacuously.
 *
 * Run:  node gates/every_cell_has_a_class_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ENGINE = path.join(ROOT, 'engine');

/* Several engine modules run self-tests at require time and call process.exit when they
   finish. Loading the district registry means loading them, so the real exit is held aside
   for our own verdict and restored before we use it. */
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

let pass = 0, fail = 0;
const ok = (name, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '  [' + detail + ']' : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '  [' + detail + ']' : '')); }
};

/* ---- A. THE GATE CAN ONLY WORK IF IT IS READING THE REAL TABLE ---------------- */
const TABLE = K.KIND_LAYER;
if (!TABLE || typeof TABLE !== 'object' || !Object.keys(TABLE).length) {
  console.log('REFUSING: the district kit no longer exports KIND_LAYER. This gate checks ' +
              'legend kinds against THAT table; without it there is nothing to check ' +
              'against and a green result would be a lie.');
  process.exit(1);
}
const KNOWN = Object.keys(TABLE);
ok('the gate reads the kit\'s own kind table, it does not keep a copy', KNOWN.length > 0,
   KNOWN.length + ' kinds declared');

/* Sanity: the table has to actually distinguish things, or "every kind is known" is empty. */
ok('the table distinguishes floor from wall',
   TABLE.ground && TABLE.ground.solid === false && TABLE.structure && TABLE.structure.solid === true);

/* ---- B. EVERY LEGEND KIND IN EVERY DISTRICT IS KNOWN TO THAT TABLE ------------ */
const types = K.types().filter(t => t !== '__test' && t !== '__gatetest');
ok('districts are registered and have legends', types.length > 20, types.length + ' districts');

let entries = 0;
const unknown = [];
const kinds = {};
for (const t of types) {
  const d = K.get(t);
  if (!d || !d.legend) continue;
  for (const code in d.legend) {
    const L = d.legend[code];
    if (!L) continue;
    entries++;
    const k = L.kind || '(no kind)';
    kinds[k] = (kinds[k] || 0) + 1;
    if (KNOWN.indexOf(k) < 0) unknown.push(t + ':' + code + ' "' + (L.name || '?') + '" kind=' + k);
  }
}
ok('there are real legends to sweep', entries > 500, entries + ' legend entries, ' +
   Object.keys(kinds).length + ' distinct kinds');

if (unknown.length) {
  console.log('       every unknown kind silently becomes WALKABLE FLOOR:');
  unknown.slice(0, 20).forEach(u => console.log('         ' + u));
}
ok('EVERY legend kind is known to the solidity table (an unknown kind is silent floor)',
   unknown.length === 0, unknown.length + ' unknown');

/* ---- C. NOTHING IS BOTH A HOLE AND A WALL ------------------------------------- */
/* The 8/20 void law: a void does not stop you and nothing walks into it. An entry that
   declares itself void AND solid is asking for both, and tileLayer resolves that by
   dropping solid -- so the declaration lies about what the author asked for. */
const contradictory = [];
for (const t of types) {
  const d = K.get(t);
  if (!d || !d.legend) continue;
  for (const code in d.legend) {
    const L = d.legend[code];
    if (!L) continue;
    if (L['void'] === true && L.solid === true) contradictory.push(t + ':' + code + ' ' + L.name);
  }
}
ok('nothing declares itself both a hole and a wall', contradictory.length === 0,
   contradictory.join(', ') || 'none');

/* ---- D. THE ONE THAT STARTED THIS: LIVE WATER IS NOT PAVEMENT ----------------- */
/* Named cells, because this is the defect the gate was built from and a regression here
   is 5,863 cells of standable reservoir coming back. Deep water resolves to a void:
   not solid (a lake cannot block a body) and not standable (nothing walks into it). */
const DEEP = [['dam', 3, 'reservoir'], ['dam', 12, 'tailrace'], ['fort', 12, 'creek']];
for (const [t, code, name] of DEEP) {
  const d = K.get(t);
  const L = d && d.legend && d.legend[code];
  const ly = L ? K.tileLayer(L) : null;
  ok('the ' + t + '\'s ' + name + ' is a void, not floor',
     !!(ly && ly['void'] === true && ly.solid === false),
     ly ? ('solid=' + ly.solid + ' void=' + ly['void']) : 'entry missing');
}

/* And the other half of the same ruling: DRY water is genuinely ground and must stay
   walkable. A fix that drowned every empty fountain would be worse than the bug. */
const DRY = [['cityhall', 8, 'dry fountain basin'], ['chapel', 21, 'dry font'],
             ['apartment', 8, 'drained pool'], ['waterpark', 6, 'drained wave pool']];
let dryOk = 0;
for (const [t, code] of DRY) {
  const d = K.get(t);
  const L = d && d.legend && d.legend[code];
  const ly = L ? K.tileLayer(L) : null;
  if (ly && ly.solid === false && ly['void'] !== true) dryOk++;
}
ok('dry water is still ordinary walkable ground', dryOk === DRY.length,
   dryOk + '/' + DRY.length + ' stayed floor');

/* ---- E. MUTATION: THE GATE MUST ACTUALLY BITE --------------------------------- */
/* A checker that cannot be made to fail is not a checker. Register a district whose
   legend carries an invented kind and confirm the sweep in B would have caught it. */
K.register('__gatetest', {
  generate: () => ({}), body: () => false, palette: {},
  legend: { 0: { name: 'invented surface', kind: 'lagoon' } }
});
const probe = K.get('__gatetest');
const caught = KNOWN.indexOf(probe.legend[0].kind) < 0;
const resolves = K.tileLayer(probe.legend[0]);
ok('MUTATION: an invented kind is detected as unknown', caught === true);
ok('MUTATION: and it proves the danger -- an unknown kind resolves to walkable floor',
   resolves.layer === 'ground' && resolves.solid === false,
   'layer=' + resolves.layer + ' solid=' + resolves.solid);

console.log('\nEVERY CELL HAS A CLASS GATE: ' + pass + ' ok, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
