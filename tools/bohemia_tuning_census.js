#!/usr/bin/env node
// TUNING [numbers table] 9/28 -- RESEARCH INSTRUMENT, NOT A GATE (rule 38g: TUNING builds nothing).
// Decodes the fight (COMBAT_B64 in the alpha), reads every FELT constant this lane named in
// records/BOHEMIA_TUNING_BB_NUMBERS_HOW_FIVE_POINTS_ARE_FELT_9_28_26.md s4, and reports its live value
// and line, plus the enemy archetype table. With --write it refreshes the draft table's `live` fields
// (records/BOHEMIA_TUNING_NUMBERS_TABLE_DRAFT_9_28_26.json) so the draft never disagrees with the build.
// It also counts ALL top-level numeric consts: the baseline a future "no felt number outside the table"
// ratchet would start from. Nothing in the game reads anything this writes.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
const m = alpha.match(/COMBAT_B64\s*=\s*'([^']+)'/);
if (!m) { console.log('CENSUS: no COMBAT_B64 in the alpha; nothing to read'); process.exit(1); }
const src = Buffer.from(m[1], 'base64').toString('utf8');
const lines = src.split('\n');

function constVal(name) {
  const re = new RegExp('(?:const|var|let)\\s+[^;\\n]*?\\b' + name + '\\s*=\\s*(-?[0-9.]+(?:e-?[0-9]+)?)');
  for (let i = 0; i < lines.length; i++) { const r = lines[i].match(re); if (r) return { value: +r[1], line: i + 1 }; }
  return null;
}
function archetypes() {
  const out = {};
  const re = /^\s*([a-z]+)\s*:\s*\{n:'([A-Z-]+)',\s*hp:(\d+),\s*acc:([0-9.]+),\s*dmg:\[(\d+),(\d+)\]/;
  lines.forEach((l, i) => { const r = l.match(re); if (r) out[r[1]] = { name: r[2], hp: +r[3], acc: +r[4], dmg: [+r[5], +r[6]], line: i + 1 }; });
  return out;
}
let all = 0;
lines.forEach(l => { const r = l.match(/^\s*(?:const|var|let)\s+[A-Z][A-Z0-9_]{2,}\s*=\s*-?[0-9.]/); if (r) all++; });

const draftPath = path.join(ROOT, 'records/BOHEMIA_TUNING_NUMBERS_TABLE_DRAFT_9_28_26.json');
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
let found = 0, missing = [], moved = [];
for (const row of draft.rows) {
  if (!row.const) continue;
  const v = constVal(row.const);
  if (!v) { missing.push(row.id); row.live = null; continue; }
  found++;
  if (row.live && row.live.value !== v.value) moved.push(row.id + ' ' + row.live.value + '->' + v.value);
  row.live = v;
}
const arch = archetypes();
draft.enemies.live = arch;
draft.census = { numericConstsInFight: all, feltRowsFound: found, feltRowsMissing: missing, blobLines: lines.length };
console.log('TUNING CENSUS: ' + lines.length + ' fight lines, ' + all + ' top-level numeric consts, ' +
  found + ' felt rows read live, ' + missing.length + ' missing' + (missing.length ? ' (' + missing.join(', ') + ')' : '') +
  ', ' + Object.keys(arch).length + ' enemy kinds' + (moved.length ? '; MOVED since last write: ' + moved.join('; ') : ''));
if (process.argv.includes('--write')) fs.writeFileSync(draftPath, JSON.stringify(draft, null, 1) + '\n');
