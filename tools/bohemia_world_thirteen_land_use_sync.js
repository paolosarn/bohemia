#!/usr/bin/env node
/* ============================================================================
   THE LAND-USE SYNC (WORLD THIRTEEN 11/10, VAMILY rule 429(g), ask line 508)

   records/target/bb/land_use.json is the file a modder edits (the zones, their shares, the rules, each zone's streets).
   engine/bohemia_overmap.js carries the numbers its land-use pass reads (the industry corridor and parks, the cheap edge)
   WORD FOR WORD between its two DATA lines; this tool writes them, never by hand. gates/the_valley_has_its_zones_gate.js
   re-runs it in memory and goes red if the engine's block is not what the file says.

     node tools/bohemia_world_thirteen_land_use_sync.js          write the block (then re-inline the generator into the map)
     node tools/bohemia_world_thirteen_land_use_sync.js --check  exit 1 if it would change anything
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/land_use.json');
const ENGINE = path.join(ROOT, 'engine/bohemia_overmap.js');
const BEGIN = '/* __LAND_USE__ DATA BEGIN */', END = '/* __LAND_USE__ DATA END */';
const KEEP = ['corridor_reach', 'corridor_y', 'park_radius', 'keep', 'takes', 'kinds', 'near', 'chance'];

function pick(o) { const r = {}; KEEP.forEach((k) => { if (o[k] !== undefined) r[k] = o[k]; }); return r; }
function block(file) {
  const J = JSON.parse(fs.readFileSync(file || FILE, 'utf8'));
  return 'const LAND_USE={industry:' + JSON.stringify(pick(J.industry)) + ',\n  cheap_edge:' + JSON.stringify(pick(J.cheap_edge)) + ',\n  works_zone:' + JSON.stringify(J.zones.industry.districts) + ',\n  house_zone:' + JSON.stringify(J.zones.suburb.districts) + '};';
}
function written(src, file) {
  const a = src.indexOf(BEGIN), b = src.indexOf(END);
  if (a < 0 || b < a) throw new Error('the generator has no __LAND_USE__ DATA block');
  return src.slice(0, a + BEGIN.length) + '\n' + block(file) + '\n' + src.slice(b);
}
module.exports = { block, written, BEGIN, END, FILE, ENGINE };
if (require.main === module) {
  const src = fs.readFileSync(ENGINE, 'utf8'), next = written(src);
  if (process.argv.includes('--check')) { console.log(next === src ? 'in step' : 'OUT OF STEP'); process.exit(next === src ? 0 : 1); }
  if (next !== src) fs.writeFileSync(ENGINE, next);
  console.log(next === src ? 'already in step' : 'written');
}
