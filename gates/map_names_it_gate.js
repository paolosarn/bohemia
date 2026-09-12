/* BOHEMIA — IF THE MAP NAMES IT, SOMETHING MUST BE ABLE TO DRAW IT (9/12, COOK).
 *
 * FACTORY LAW: new claim, own gate. The claim is one sentence: every district
 * name the overmap can put on a cell must resolve to a generator somewhere, or
 * the player walks to a place the map promised and finds bare ground.
 *
 * WHY THIS EXISTS, AND IT IS THE SAME SENTENCE FOR THE FOURTH TIME IN THIS LANE.
 * The board has said "about 20 map-only districts nobody draws" since before I
 * held it, and the towns law (9/4) builds a whole ART row on that number: "the
 * buildings a fortress needs that nobody has drawn are the ~20 map-only districts
 * already on ART's queue". Measured 9/12 the number is EIGHT, and getting there
 * meant finding FOUR separate registries, one at a time, each time believing a
 * clean negative from the wrong one:
 *
 *     DISTGEN      61 kinds   engine/bohemia_world.js
 *     SURFACEGEN   10 kinds   the roads and the raw land -- "surfaces, never
 *                             districts: nobody bases a faction on a mountain"
 *     KIT registry  5 kinds   reached by KIT.get(name) AFTER a registrar module
 *                             (bohemia_landmarks.js) has been required -- NOT a
 *                             property on the module object
 *     the overmap  79 names   engine/bohemia_overmap.js DISTRICT
 *
 * Ask three of the four and you get 18 missing. Ask two and you get more. The
 * count is only true when every registry has been asked, so THIS GATE ASKS ALL
 * OF THEM, and it asks by RUNNING them, never by reading a filename.
 *
 * AND IT COUNTS CELLS, NOT NAMES, because a name nothing places is a dead enum
 * entry and a name on ten cells is ten places a player can stand. `beltway` is
 * the first kind: known to the graphics engine, in the kit's ROADSET, and placed
 * on ZERO cells of a real 96x96 map.
 *
 *   node gates/map_names_it_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const BASELINE = path.join(__dirname, 'map_names_it_baseline.json');
let pass = 0; const fails = [];
const ok = (n, c) => { c ? pass++ : fails.push(n); };

function blockOf(src, name) {
  const m = src.match(new RegExp('var ' + name + '\\s*=\\s*\\{'));
  if (!m) return null;
  let i = src.indexOf('{', m.index), d = 0, j;
  for (j = i; j < src.length; j++) {
    if (src[j] === '{') d++;
    else if (src[j] === '}') { d--; if (!d) break; }
  }
  return src.slice(i, j + 1);
}
const keysOf = (blk) => blk
  ? [...new Set([...blk.matchAll(/^\s*([a-zA-Z_][\w]*)\s*:\s*\{/gm)].map(x => x[1]))]
  : [];

const world = fs.readFileSync(path.join(ROOT, 'engine/bohemia_world.js'), 'utf8');
const distgen = keysOf(blockOf(world, 'DISTGEN'));
const surfacegen = keysOf(blockOf(world, 'SURFACEGEN'));
ok('DISTGEN is readable and non-trivial (' + distgen.length + ')', distgen.length >= 40);
ok('SURFACEGEN is readable — the roads and the raw land are a SECOND registry ('
   + surfacegen.length + ')', surfacegen.length >= 5);

/* THE KIT REGISTRY IS ONLY POPULATED ONCE A REGISTRAR HAS RUN. Requiring the kit
   alone gives an empty answer that looks exactly like "these do not exist" --
   measured: before requiring bohemia_landmarks.js, KIT.get('convention') is false. */
let kitTypes = [];
try {
  const KIT = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));
  require(path.join(ROOT, 'engine/bohemia_landmarks.js'));
  kitTypes = (typeof KIT.types === 'function') ? KIT.types() : [];
} catch (e) { /* reported by the arm below */ }
ok('the KIT registry answers after its registrar is required (' + kitTypes.length + ')',
   kitTypes.length >= 1);

const om = fs.readFileSync(path.join(ROOT, 'engine/bohemia_overmap.js'), 'utf8');
const dm = om.match(/const DISTRICT=\{([\s\S]*?)\};/);
const names = dm ? [...dm[1].matchAll(/(\w+)\s*:\s*'([^']+)'/g)].map(x => x[2]) : [];
ok('the overmap DISTRICT list is readable (' + names.length + ')', names.length >= 40);

const drawable = new Set([...distgen, ...surfacegen, ...kitTypes]);
const undrawable = names.filter(n => !drawable.has(n));

/* CELLS, NOT NAMES. A name nothing places costs the player nothing; a name on ten
   cells is ten places he can walk to. Counted on a real generated map. */
let cells = {}; let mapOk = false;
try {
  const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
  const m = OM.buildOvermap(12345);
  for (let y = 0; y < OM.OVER_N; y++) for (let x = 0; x < OM.OVER_N; x++) {
    const t = m.at(x, y); if (!t) continue;
    cells[t.district] = (cells[t.district] || 0) + 1;
  }
  mapOk = Object.keys(cells).length > 5;
} catch (e) { /* reported below */ }
ok('a real overmap generates and can be counted (kinds placed: '
   + Object.keys(cells).length + ')', mapOk);

const placedUndrawable = undrawable.filter(n => (cells[n] || 0) > 0);
const deadNames = undrawable.filter(n => !(cells[n] || 0));
const lostCells = placedUndrawable.reduce((a, n) => a + cells[n], 0);

let base = null;
try { base = JSON.parse(fs.readFileSync(BASELINE, 'utf8')); } catch (e) {}
ok('there is a frozen baseline to ratchet against', !!base);

if (base) {
  /* RATCHET, for the same reason every other ratchet here is one: eight undrawn
     names is a real debt that predates this gate, and a hard zero on day one is a
     fleet-wide red on work nobody in this lane did. It may only SHRINK. */
  const newly = placedUndrawable.filter(n => !base.placed_undrawable.includes(n));
  ok('no NEW map name is placed with nothing able to draw it'
     + (newly.length ? ' — NEW: ' + newly.join(', ') : ''), newly.length === 0);
  ok('the undrawable cell count only falls (' + lostCells + ' vs frozen '
     + base.lost_cells + ')', lostCells <= base.lost_cells);
  ok('the undrawable name count only falls (' + placedUndrawable.length + ' vs frozen '
     + base.placed_undrawable.length + ')',
     placedUndrawable.length <= base.placed_undrawable.length);
}

console.log('\n  overmap names %d · drawable by some registry %d · undrawable %d',
  names.length, drawable.size, undrawable.length);
console.log('  PLACED and undrawable: %d names over %d cells — %s',
  placedUndrawable.length, lostCells,
  placedUndrawable.map(n => n + ' ' + cells[n]).join(', ') || 'none');
console.log('  named but never placed (dead enum entries, cost nothing): %s',
  deadNames.join(', ') || 'none');
if (base && lostCells < base.lost_cells) {
  console.log('\n  *** IT FELL. Re-freeze the baseline DOWNWARD (--freeze) and say so. ***');
}
if (process.argv.includes('--freeze')) {
  fs.writeFileSync(BASELINE, JSON.stringify({
    what: 'IF THE MAP NAMES IT, SOMETHING MUST BE ABLE TO DRAW IT — frozen debt.',
    why: 'Frozen 9/12/26 by COOK the turn this gate was written. The board had said '
       + '"about 20 map-only districts nobody draws" and the towns law built an ART row on '
       + 'that number; asking all four registries instead of three gives EIGHT.',
    rule: 'MAY ONLY SHRINK. A newly placed undrawable name is RED whatever the totals say.',
    placed_undrawable: placedUndrawable,
    lost_cells: lostCells,
    dead_names: deadNames,
  }, null, 1) + '\n');
  console.log('\n  FROZE %d names over %d cells -> %s',
    placedUndrawable.length, lostCells, path.basename(BASELINE));
}
for (const f of fails) console.log('  > FAIL ' + f);
console.log('\n=== MAP NAMES IT GATE: ' + pass + ' passed, ' + fails.length + ' failed ===');
process.exit(fails.length ? 1 : 0);
