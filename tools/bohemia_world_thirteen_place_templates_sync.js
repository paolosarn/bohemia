#!/usr/bin/env node
/* ============================================================================
   THE PLACE TEMPLATES SYNC (WORLD THIRTEEN 11/11, VAMILY rules 429(f), 430; ask line 507)

   records/target/bb/place_templates.json is the file a modder edits (each place board's kinds, how many a valley, how far apart,
   the footprint). engine/bohemia_overmap.js carries its numbers WORD FOR WORD between its two __PLACE_TEMPLATES__ DATA lines; this
   tool writes them, never by hand. gates/the_places_are_templates_gate.js re-runs it in memory and goes red if they differ.

     node tools/bohemia_world_thirteen_place_templates_sync.js          write the block (then re-inline the generator into the map)
     node tools/bohemia_world_thirteen_place_templates_sync.js --check  exit 1 if it would change anything
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/place_templates.json');
const ENGINE = path.join(ROOT, 'engine/bohemia_overmap.js');
const BEGIN = '/* __PLACE_TEMPLATES__ DATA BEGIN */', END = '/* __PLACE_TEMPLATES__ DATA END */';
const KEEP = ['board', 'kinds', 'per_valley', 'min_cells', 'spacing', 'mirror', 'slack'];

function block(file) {
  const J = JSON.parse(fs.readFileSync(file || FILE, 'utf8')), t = {};
  J.order.forEach((k) => { const r = {}; KEEP.forEach((f) => { if (J.templates[k][f] !== undefined) r[f] = J.templates[k][f]; }); t[k] = r; });
  return 'const PLACE_TEMPLATES={tiles_per_block:' + J.tiles_per_block + ',footprint:' + JSON.stringify(J.footprint) + ',order:' + JSON.stringify(J.order) + ',\n  templates:{\n'
    + J.order.map((k) => '    ' + k + ':' + JSON.stringify(t[k])).join(',\n') + '}};';
}
function written(src, file) {
  const a = src.indexOf(BEGIN), b = src.indexOf(END);
  if (a < 0 || b < a) throw new Error('the generator has no __PLACE_TEMPLATES__ DATA block');
  return src.slice(0, a + BEGIN.length) + '\n' + block(file) + '\n' + src.slice(b);
}
module.exports = { block, written, BEGIN, END, FILE, ENGINE };
if (require.main === module) {
  const src = fs.readFileSync(ENGINE, 'utf8'), next = written(src);
  if (process.argv.includes('--check')) { console.log(next === src ? 'in step' : 'OUT OF STEP'); process.exit(next === src ? 0 : 1); }
  if (next !== src) fs.writeFileSync(ENGINE, next);
  console.log(next === src ? 'already in step' : 'written');
}
