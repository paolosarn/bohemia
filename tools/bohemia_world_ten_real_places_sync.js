#!/usr/bin/env node
/* ============================================================================
   THE MISSING REAL PLACES: THE DATA INTO THE GENERATOR (WORLD TEN 11/6, VAMILY rule 409(c), ask line 458)

   records/target/bb/real_places.json is the one list a modder edits. The valley's generator
   (engine/bohemia_overmap.js) is a pure function that runs before anything can fetch a file, so it
   carries the valley places' SEATS as a literal between its two DATA lines. This tool writes that
   literal from the file (id, kind, seat: nothing else; the rest of a place is read at play time by
   slices/bohemia_real_places.js), so the two can never drift: gates/the_missing_real_places_gate.js
   fails the moment they differ.

     node tools/bohemia_world_ten_real_places_sync.js          write it
     node tools/bohemia_world_ten_real_places_sync.js --check  say whether it is written (exit 1 if not)

   After a write, re-inline the generator into the pages that carry it:
     python3 tools/bohemia_city_overmap_resync.py
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'records/target/bb/real_places.json');
const ENGINE = path.join(ROOT, 'engine/bohemia_overmap.js');
const BEGIN = '/* __THE_MISSING_REAL_PLACES__ DATA BEGIN */';
const END = '/* __THE_MISSING_REAL_PLACES__ DATA END */';

function literal() {
  const j = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const rows = (j.places || []).filter(p => p.where === 'valley').map(p => {
    const sx = p.seat.x, sy = p.seat.y;
    const x = '{from:' + JSON.stringify(sx.from) + ',east:' + (sx.east | 0) + '}';
    const y = sy.of != null ? '{of:' + Number(sy.of) + '}' : '{from:' + JSON.stringify(sy.from) + ',south:' + (sy.south | 0) + '}';
    return '  {id:' + JSON.stringify(p.id) + ',kind:' + JSON.stringify(p.kind) + ',seat:{x:' + x + ',y:' + y + '}}';
  });
  return 'const REAL_PLACES=[\n' + rows.join(',\n') + '\n];';
}
function current(src) {
  const a = src.indexOf(BEGIN), b = src.indexOf(END);
  if (a < 0 || b < a) return null;
  return src.slice(a + BEGIN.length, b).trim();
}
const src = fs.readFileSync(ENGINE, 'utf8');
const want = literal();
const have = current(src);
if (have === null) { console.error('the DATA lines are missing from ' + ENGINE); process.exit(1); }
if (process.argv.includes('--check')) {
  if (have === want) { console.log('written: the generator carries the file\'s seats'); process.exit(0); }
  console.log('NOT written: the generator\'s seats differ from the file'); process.exit(1);
}
if (have === want) { console.log('already written, nothing to do'); process.exit(0); }
const a = src.indexOf(BEGIN), b = src.indexOf(END);
fs.writeFileSync(ENGINE, src.slice(0, a + BEGIN.length) + '\n' + want + '\n' + src.slice(b));
console.log('wrote ' + want.split('\n').length + ' lines into ' + path.relative(ROOT, ENGINE));
