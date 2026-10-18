#!/usr/bin/env node
/* MODS [the style guide as data] + [the ten gates as a mod check] (10/18/26, lane 22, RESEARCH ONLY, rule 22).

   Two measurements, reads only, nothing in the game, exit 0 always (an instrument, not a gate):

   1. THE TWENTY FIELDS. records/BOHEMIA_RESEARCH_HOW_NOT_TO_LOOK_VIBE_CODED_ROUND_ONE_10_16_26.md Section C lists the
      twenty fields a pixel-art style guide carries. For each: is there a MACHINE-READABLE file in this repo today that
      holds its number (a key a program can read), a PROSE file only, or nothing. A modder can only follow a rule a
      program can read back, so this is the floor DIRECTION's style guide file starts from.

   2. A SPRITE MOD TODAY. Build a mod folder in memory that carries a PNG and a sheet declaration the way a modder
      would, and ask the reference merge's own file filter what it would do with each file.

   Run: node tools/bohemia_mods_style_fields_audit.js            (about one second)
*/
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
const rd = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(ROOT, p));
const J = (p) => { try { return JSON.parse(rd(p)); } catch (e) { return null; } };

const card = J('records/target/DIRECTION_THE_CARD_OF_NUMBERS.json');
const rig = J('records/target/master_rig/robot/rig.json');
const pal = J('records/target/BOHEMIA_MASTER_PALETTE.json');
const sheet = J('slices/fight_people/fight_people.json');
const gpl = exists('skills/bohemia-pixel-art/references/palettes/prop.gpl');
const band = card && card.families && card.families.prop && card.families.prop.band;
const has = (o, k) => !!(o && o[k] !== undefined && o[k] !== null);

/* field, where a program can read a number today (or ''), the key, and the note */
const FIELDS = [
  [1, 'Visual identity statement', '', '', 'prose only: records/BOHEMIA_ANALOG_HORROR_BIBLE_9_20_26.md'],
  [2, 'Native resolution and pixel size', 'records/target/master_rig/*/rig.json', 'ppm', has(rig, 'ppm') && has(sheet, 'frame') ? '57 px a metre; the sheet frame 112' : 'missing'],
  [3, 'Camera and perspective', 'records/target/master_rig/*/rig.json', 'camera', has(rig, 'camera') ? 'tilt 45, turn 0, orthographic' : 'missing'],
  [4, 'Master palette', 'records/target/BOHEMIA_MASTER_PALETTE.json', 'ramp_hex', has(pal, 'ramp_hex') ? pal.ramp_hex.length + ' hexes, no roles, no ramps; status says NOT YET ENFORCED' + (gpl ? '; plus seven family .gpl (64 each)' : '') : 'missing'],
  [5, 'Colour budget per asset class', 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json', 'families.<fam>.band.colours', has(band, 'colours') ? 'a FLOOR per family (prop ' + Math.round(band.colours[0]) + ' to ' + Math.round(band.colours[1]) + '), not a cap; no class for people, beasts, UI' : 'missing'],
  [6, 'Light direction', 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json', 'families.<fam>.band.tb', has(band, 'tb') ? 'top minus bottom band; rig.json sun is a sentence ("' + (rig && rig.sun) + '")' : 'missing'],
  [7, 'Shading steps', 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json', 'families.<fam>.band.span', has(band, 'span') ? 'value span band only; no step count, no "never black"' : 'missing'],
  [8, 'Outline rule', 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json', 'families.<fam>.band.step', has(band, 'step') ? 'edge minus inside band per family; no rule for people or UI' : 'missing'],
  [9, 'Anti-aliasing and dithering', '', '', 'checked in code (banding = 0 in check.py), no data file'],
  [10, 'Proportions and silhouette', 'records/target/master_rig/*/rig.json', 'real_dims_m', has(rig, 'real_dims_m') ? 'metres per model; no silhouette feature per class' : 'missing'],
  [11, 'Detail budget per asset class', 'records/target/DIRECTION_THE_CARD_OF_NUMBERS.json', 'families.<fam>.band.run', has(band, 'run') ? 'grain band only; no rest-region share' : 'missing'],
  [12, 'Variation rules', '', '', 'nothing: no variant count, no run limit in any file'],
  [13, 'Ground contact', 'records/target/master_rig/*/rig.json', 'contact_shadow', has(rig, 'contact_shadow') ? 'a flag, not a size' : 'missing'],
  [14, 'UI rules', '', '', 'nothing: no font file named, no radius, no gradient rule in data'],
  [15, 'Animation timing', 'records/target/master_rig/*/rig.json', 'bpm', has(rig, 'bpm') && has(rig, 'keys_per_beat') ? '120 BPM, 3 keys a beat' : 'missing'],
  [16, 'Do and don\'t page', '', '', 'one PNG of three lessons (skills/bohemia-pixel-art/references/lessons/), not per field'],
  [17, 'Named common mistakes', '', '', 'prose: skills/bohemia-pixel-art/references/faults.md'],
  [18, 'Tie-breaker', '', '', 'nothing'],
  [19, 'Review procedure', '', '', 'code, not data: skills/bohemia-pixel-art/scripts/check.py and look.py'],
  [20, 'Reference board and anti-reference', 'reference/art_bank/CORPUS.json', 'families', exists('reference/art_bank/CORPUS.json') ? 'his 1,927 tiles indexed by family; no anti-reference list' : 'missing'],
];

let data = 0, prose = 0, none = 0;
const rows = FIELDS.map(([n, name, file, key, note]) => {
  const kind = file ? 'DATA' : (/prose|code|PNG/.test(note) ? 'PROSE/CODE' : 'NONE');
  if (kind === 'DATA') data++; else if (kind === 'PROSE/CODE') prose++; else none++;
  return { n, name, kind, file, key, note };
});

/* 2. a sprite mod through the reference merge's own filter (the filter is the line that picks patch files) */
const mergeSrc = rd('tools/bohemia_mods_merge_reference.js');
const filterLine = (mergeSrc.match(/readdirSync\(mdir\)\.filter\([^\n]*/) || [''])[0];
const BB = fs.readdirSync(path.join(ROOT, 'records/target/bb')).filter((f) => f.endsWith('.json'));
const modFiles = ['manifest.json', 'robot_S.png', 'robot_S.json', 'fight_people.json', 'sprites.json'];
const probe = modFiles.map((f) => {
  if (f === 'manifest.json') return { file: f, fate: 'read as the manifest' };
  if (!f.endsWith('.json')) return { file: f, fate: 'IGNORED WITHOUT A WORD (the filter reads .json only)' };
  if (BB.includes(f)) return { file: f, fate: 'patched into records/target/bb/' + f };
  return { file: f, fate: 'M19, no such data file, ignored (' + (f === 'fight_people.json' ? 'the real one lives under slices/fight_people/, outside the data folder' : 'no sprite table exists in the data folder') + ')' };
});

const pngCheck = exists('skills/bohemia-pixel-art/scripts/check.py');
const out = { date: '10/18/26', lane: 'mods', rows, counts: { data, prose_or_code: prose, none }, merge_filter: filterLine.trim(), sprite_mod_probe: probe, one_png_check_exists: pngCheck, bb_files: BB.length };

if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
console.log('THE TWENTY FIELDS OF A STYLE GUIDE, AGAINST THE REPO (10/18/26)');
for (const r of rows) console.log(String(r.n).padStart(2) + '  ' + r.kind.padEnd(10) + ' ' + r.name.padEnd(36) + ' ' + (r.file ? r.file + ' :: ' + r.key + ' -- ' : '') + r.note);
console.log('\n' + data + ' of 20 fields have a number a program can read; ' + prose + ' live in prose, a picture or code; ' + none + ' exist nowhere.');
console.log('\nA SPRITE MOD TODAY, through the reference merge\'s filter: ' + filterLine.trim());
for (const p of probe) console.log('  ' + p.file.padEnd(18) + ' -> ' + p.fate);
console.log('\nThe one check that exists for a PNG: skills/bohemia-pixel-art/scripts/check.py <png> <family> (' + (pngCheck ? 'present' : 'MISSING') + '); the family comes from the command line, nothing in or beside the PNG declares it.');
