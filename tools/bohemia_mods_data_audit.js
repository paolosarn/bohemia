#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: WHAT IS DATA AND WHAT IS NOT (MODS lane, 10/9/26)
   Row [what is data and what is not], rules 22 and 63d. Reads, never writes
   game files. For each play surface it lists:
     DATA      which records/target/bb/*.json files the surface really loads
     TABLES    every top-level literal table (const NAME = [ or { ... ) with
               real size, that is content a modder would want in a data file
   and then marks each table: SHADOWED (a data file already holds that kind,
   so the table is a second copy that can drift) or LOOSE (no data file).
   Usage: node tools/bohemia_mods_data_audit.js [--json]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BB = path.join(ROOT, 'records', 'target', 'bb');

const SURFACES = [
  { name: 'the new fight', file: 'slices/BOHEMIA_FIGHT.html', lane: 'COMBAT' },
  { name: 'the map (city world)', file: 'slices/BOHEMIA_CITY_WORLD.html', lane: 'RUN / WORLD', skipBlobs: true },
  { name: 'the demo shell', file: 'slices/BOHEMIA_DEMO.html', lane: 'RUN', skipBlobs: true },
  { name: 'the old fight (inside the demo)', file: 'slices/BOHEMIA_DEMO.html', blob: 'COMBAT_B64', lane: 'COMBAT' },
];
/* kinds: a keyword in the table's name, mapped to the data file that would hold it */
const KIND = [
  [/weapon|wpn|gun|pistol|reach|mag\b|muzzle|swing/i, 'weapons.json / weapon_lines.json'],
  [/armou?r|helmet|shield|plate/i, 'armor.json'],
  [/enemy|enemies|foe|beast|archetype|bestiary/i, 'enemies.json'],
  [/background|trade|was_|crew/i, 'backgrounds.json'],
  [/origin/i, 'origins.json'],
  [/perk|mastery|trait/i, 'perks.json / perk_translation.json'],
  [/injur|wound/i, 'injuries.json'],
  [/\bai\b|tactic|hunt|gambit/i, 'ai.json'],
  [/morale|fatigue|\bap\b|hit_?chance|terrain|initiative|rule/i, 'rules.json'],
  [/lethal|difficulty|day_cap|roster|bpm|death/i, 'ours.json / party_math.json'],
];

function blobText(html, name) {
  const m = new RegExp(name + '\\s*=\\s*["\']([A-Za-z0-9+/=]+)["\']').exec(html);
  return m ? Buffer.from(m[1], 'base64').toString('utf8') : '';
}
function stripBlobs(html) { return html.replace(/(\w+_B64)\s*=\s*["'][A-Za-z0-9+/=]{2000,}["']/g, '$1=""'); }

function matchClose(t, open) {
  let d = 0;
  for (let i = open; i < t.length; i++) {
    const c = t[i];
    if (c === '/' && t[i + 1] === '*') { i = t.indexOf('*/', i + 2) + 1; if (i < 1) return -1; continue; }
    if (c === '/' && t[i + 1] === '/') { i = t.indexOf('\n', i); if (i < 0) return -1; continue; }
    if (c === '"' || c === "'" || c === '`') { for (i++; i < t.length && t[i] !== c; i++) if (t[i] === '\\') i++; continue; }
    if (c === '{' || c === '[') d++;
    else if (c === '}' || c === ']') { d--; if (d === 0) return i; }
  }
  return -1;
}
function tables(text) {
  const out = [];
  const re = /(?:^|\n)\s{0,4}(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([\[{])/g;
  let m;
  while ((m = re.exec(text))) {
    const open = m.index + m[0].length - 1;
    const close = matchClose(text, open);
    if (close < 0) continue;
    const body = text.slice(open, close + 1);
    const lines = body.split('\n').length;
    const entries = (body.match(/,\s*(?:\n|\{|\[|['"\w])/g) || []).length + 1;
    if (lines >= 8 && body.length >= 400) out.push({ name: m[1], chars: body.length, lines, line: text.slice(0, m.index).split('\n').length });
    re.lastIndex = close;
  }
  return out;
}
function kindOf(name) { for (const [rx, f] of KIND) if (rx.test(name)) return f; return null; }

const dataFiles = fs.readdirSync(BB).filter(f => f.endsWith('.json'));
const rows = {};
for (const f of dataFiles) {
  try { const j = JSON.parse(fs.readFileSync(path.join(BB, f), 'utf8')); rows[f] = Array.isArray(j.rows) ? j.rows.length : (j.rows ? Object.keys(j.rows).length : Object.keys(j).length); } catch (e) { rows[f] = 0; }
}

const report = { dataFiles: rows, surfaces: [] };
for (const s of SURFACES) {
  const html = fs.readFileSync(path.join(ROOT, s.file), 'utf8');
  const text = s.blob ? blobText(html, s.blob) : (s.skipBlobs ? stripBlobs(html) : html);
  /* a file counts as READ only when its path sits inside a quoted string: a comment that names a file is not a read */
  const loaded = dataFiles.filter(f => new RegExp('[\'"`][^\'"`\\n]*bb/' + f.replace(/\./g, '\\.') + '[\'"`]').test(text));
  const t = tables(text).map(x => Object.assign(x, { kind: kindOf(x.name) }));
  report.surfaces.push({ name: s.name, lane: s.lane, file: s.file + (s.blob ? ' [' + s.blob + ']' : ''),
    loads: loaded, notLoaded: dataFiles.filter(f => !loaded.includes(f)),
    tables: t.sort((a, b) => b.chars - a.chars) });
}
if (process.argv.includes('--json')) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }
for (const s of report.surfaces) {
  console.log('\n== ' + s.name + '  (' + s.lane + ', ' + s.file + ')');
  console.log('   loads ' + s.loads.length + ' of ' + dataFiles.length + ' data files' + (s.loads.length ? ': ' + s.loads.join(' ') : ''));
  console.log('   big literal tables: ' + s.tables.length + ', ' + s.tables.reduce((a, b) => a + b.chars, 0) + ' chars');
  s.tables.slice(0, 14).forEach(x => console.log('     ' + (x.kind ? 'SHADOWED' : 'LOOSE   ') + '  ' + x.name + '  ' + x.chars + ' chars, ' + x.lines + ' lines' + (x.kind ? '  -> ' + x.kind : '')));
}
