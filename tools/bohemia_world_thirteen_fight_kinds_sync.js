#!/usr/bin/env node
/* ============================================================================
   THE FIGHT KINDS SYNC (WORLD THIRTEEN 11/7, VAMILY rule 429(b), ask line 505)

   records/target/bb/map_fight_kinds.json is the file a modder edits: every building kind the map draws and its fight answer
   (storeys, in or on its roof, cover, what blocks). engine/bohemia_fight_kinds.js carries the same rows WORD FOR WORD between its
   two DATA lines so the map's painter, its worker and the fight read them with no fetch and no wait. This tool writes that
   block from the file; never by hand. gates/the_map_kinds_have_fight_answers_gate.js re-runs it in memory and goes red if the
   engine's block is not what the file says.

     node tools/bohemia_world_thirteen_fight_kinds_sync.js          write the block
     node tools/bohemia_world_thirteen_fight_kinds_sync.js --check  exit 1 if it would change anything
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/map_fight_kinds.json');
const ENGINE = path.join(ROOT, 'engine/bohemia_fight_kinds.js');
const BEGIN = '/* __FIGHT_KINDS__ DATA BEGIN */', END = '/* __FIGHT_KINDS__ DATA END */';
const KEEP = ['class', 'zone', 'building', 'storeys', 'man', 'cover', 'open_cover', 'blocks', 'street_front', 'place', 'piece'];   /* piece: 11/11, tools/bohemia_world_thirteen_pieces.py */

function rows(obj) {
  const out = {};
  Object.keys(obj).forEach((k) => {
    const e = obj[k], r = {};
    KEEP.forEach((f) => { if (e[f] !== undefined) r[f] = e[f]; });
    out[k] = r;
  });
  return out;
}
function block(file) {
  const J = JSON.parse(fs.readFileSync(file || FILE, 'utf8'));
  const data = {
    districts: rows(J.districts),
    townlot: rows(J.town.lots), townmark: rows(J.town.marks), townworks: rows(J.town.works),
    home: rows(J.home.pieces),
    model: rows(J.models.houses),
  };
  const lines = ['var DATA = {'];
  const keys = Object.keys(data);
  keys.forEach((k, i) => {
    const v = data[k];
    lines.push('  ' + k + ': {');
    const ks = Object.keys(v);
    ks.forEach((n, j) => lines.push('    ' + JSON.stringify(n) + ': ' + JSON.stringify(v[n]) + (j < ks.length - 1 ? ',' : '')));
    lines.push('  }' + (i < keys.length - 1 ? ',' : ''));
  });
  lines.push('};');
  return lines.join('\n');
}
function written(src, file) {
  const a = src.indexOf(BEGIN), b = src.indexOf(END);
  if (a < 0 || b < a) throw new Error('the engine has no DATA block');
  return src.slice(0, a + BEGIN.length) + '\n' + block(file) + '\n' + src.slice(b);
}
module.exports = { block, written, BEGIN, END, FILE, ENGINE };
if (require.main === module) {
  const src = fs.readFileSync(ENGINE, 'utf8'), next = written(src);
  if (process.argv.includes('--check')) { console.log(next === src ? 'in step' : 'OUT OF STEP'); process.exit(next === src ? 0 : 1); }
  if (next !== src) fs.writeFileSync(ENGINE, next);
  console.log(next === src ? 'already in step' : 'written');
}
