#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: THE WEAPON CENSUS (MODS lane, row [bb modding], 9/28/26)

   Paolo 9/27: "a chat dedicated towards simplifying the code, or just
   understanding that I want this to be mod friendly for the community as
   well, it'd be so awesome."  The row asks for a MEASUREMENT, not an opinion:
   "how many files a modder must read to change one weapon today."

   This tool answers it by reading the LIVE fight, never a copy of it. The
   fight is not a file in this repo: it is COMBAT_B64, a base64 blob sealed
   inside slices/BOHEMIA_ALPHA_0_9.html (the demo carries its own cut of it).
   So the first thing a modder has to know is a thing no file tells them.

   It prints and (with --write) records:
     1. every object table in the fight keyed by two or more weapon names
        (pistol / smg / rifle / shotgun / sniper), with its line;
     2. every inline `WEAPON==='x' ? a : b` ternary (a number hidden in logic);
     3. every comparison against a weapon name (behaviour hidden in logic);
     4. every gate assertion that pins a weapon number as a literal string
        (a test that forbids tuning);
     5. THE PIVOT: one row per weapon, every value READ OUT OF THE LIVE
        CONSTANT, none typed. That pivot is the draft data file: what a
        modder would edit if weapons were data. draft:true, NOT in the game.

   Usage:
     node tools/bohemia_mods_weapon_census.js            # print
     node tools/bohemia_mods_weapon_census.js --write    # + record + draft
     node tools/bohemia_mods_weapon_census.js --json     # machine output
   RESEARCH ONLY (Paolo 9/28, rule 38g): this is an instrument, not a gate.
   Nothing in the suite runs it and it refuses nothing. The ratchet gate it
   could back is a RECOMMENDATION in the record, for the day he says build.
   census() is exported so that gate, when it exists, counts what this counts.
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const GATES_DIR = path.join(ROOT, 'gates');
const RECORD = path.join(ROOT, 'records', 'BOHEMIA_MODS_WEAPON_CENSUS_9_28_26.json');
const DRAFT = path.join(ROOT, 'banks', 'BOHEMIA_MODS_WEAPONS_DRAFT_9_28_26.json');

const WEAPONS = ['pistol', 'smg', 'rifle', 'shotgun', 'sniper'];
const W_ALT = WEAPONS.join('|');

/* THE BLOB. Pulled by name, decoded, returned as text. */
function combatSource(html) {
  const m = /COMBAT_B64\s*=\s*["']([A-Za-z0-9+/=]+)["']/.exec(html);
  if (!m) return null;
  return Buffer.from(m[1], 'base64').toString('utf8');
}

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/* Brace-match from an opening '{' so nested tables (WEAPON_RANGE, the
   muzzle table) come out whole. Skips strings and comments. */
function matchBrace(t, open) {
  let depth = 0;
  for (let i = open; i < t.length; i++) {
    const c = t[i], d = t[i + 1];
    if (c === '/' && d === '*') { i = t.indexOf('*/', i + 2); if (i < 0) return -1; i++; continue; }
    if (c === '/' && d === '/') { i = t.indexOf('\n', i); if (i < 0) return -1; continue; }
    if (c === '"' || c === "'" || c === '`') {
      for (i++; i < t.length && t[i] !== c; i++) if (t[i] === '\\') i++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/* Top-level keys of an object literal (depth 1 only). */
function topKeys(lit) {
  const keys = [];
  let depth = 0;
  for (let i = 0; i < lit.length; i++) {
    const c = lit[i];
    if (c === '/' && lit[i + 1] === '*') { i = lit.indexOf('*/', i + 2) + 1; continue; }
    if (c === '"' || c === "'" || c === '`') { for (i++; i < lit.length && lit[i] !== c; i++) if (lit[i] === '\\') i++; continue; }
    if (c === '{') { depth++; if (depth === 1) { const m = /^\{\s*['"]?(\w+)['"]?\s*:/.exec(lit.slice(i)); if (m) keys.push(m[1]); } continue; }
    if (c === '}') { depth--; continue; }
    if (c === ',' && depth === 1) { const m = /^,\s*(?:\/\*[\s\S]*?\*\/\s*)*['"]?(\w+)['"]?\s*:/.exec(lit.slice(i)); if (m) keys.push(m[1]); }
  }
  return keys;
}

function safeEval(lit) {
  try { return Function('"use strict";return (' + lit + ');')(); } catch (e) { return undefined; }
}

function census(html) {
  html = html || fs.readFileSync(ALPHA, 'utf8');
  const src = combatSource(html);
  if (!src) return { ok: false, why: 'COMBAT_B64 not found in the alpha' };

  /* 1. NAMED TABLES keyed by >= 2 weapons: `NAME = {` or `NAME={`. */
  const tables = [];
  const decl = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*\{/g;
  let m;
  while ((m = decl.exec(src))) {
    const open = m.index + m[0].length - 1;
    const close = matchBrace(src, open);
    if (close < 0) continue;
    const lit = src.slice(open, close + 1);
    const keys = topKeys(lit).filter(k => WEAPONS.includes(k));
    if (keys.length >= 2) {
      tables.push({ name: m[1], line: lineOf(src, m.index), weapons: keys, value: safeEval(lit) });
    }
  }
  /* 1b. ANONYMOUS tables: `{pistol:..,rifle:..}[WEAPON]` inline in an expression. */
  const anon = [];
  const anonRe = new RegExp('\\{\\s*(?:' + W_ALT + ')\\s*:[^{}]{0,300}\\}\\s*\\[\\s*(?:WEAPON|w|src)\\s*\\]', 'g');
  while ((m = anonRe.exec(src))) {
    const lit = m[0].replace(/\[\s*\w+\s*\]$/, '');
    const pre = src.slice(Math.max(0, m.index - 50), m.index).split('\n').pop().trim();
    const named = /(?:const|let|var)\s+([\w$]+)\s*=\s*$/.exec(pre);
    const nm = named ? named[1] : null;
    if (nm && tables.some(t => t.name === nm)) continue;   /* already counted as a named table */
    anon.push({ name: nm, context: pre.slice(-40), line: lineOf(src, m.index), value: safeEval(lit) });
  }

  /* 2. TERNARIES: a number hidden in logic. */
  const ternRe = new RegExp("WEAPON\\s*===\\s*'(?:" + W_ALT + ")'\\s*\\?", 'g');
  const ternaries = [];
  while ((m = ternRe.exec(src))) ternaries.push(lineOf(src, m.index));

  /* 3. COMPARISONS: behaviour that asks which gun it is. */
  const cmpRe = new RegExp("[\\w$.\\])]+\\s*[!=]==?\\s*'(?:" + W_ALT + ")'", 'g');
  const comparisons = [];
  while ((m = cmpRe.exec(src))) comparisons.push({ line: lineOf(src, m.index), text: m[0] });

  /* 4. GATE PINS: a weapon number written as a literal inside an assertion. */
  const pins = [];
  const pinRe = new RegExp('(?:' + W_ALT + ')\\s*:\\s*[0-9]');
  for (const f of fs.readdirSync(GATES_DIR)) {
    if (!/\.(js|py)$/.test(f) || f === 'mods_weapon_census_gate.js') continue;
    const lines = fs.readFileSync(path.join(GATES_DIR, f), 'utf8').split('\n');
    lines.forEach((ln, i) => {
      if (pinRe.test(ln) && /includes\(|\.test\(|match\(|\bin (demo|alpha|src)\b/.test(ln)) pins.push({ file: 'gates/' + f, line: i + 1 });
    });
  }

  /* 5. THE PIVOT: one row per weapon, every value read from the live table. */
  const pivot = {};
  for (const w of WEAPONS) pivot[w] = {};
  for (const t of tables.concat(anon.filter(a => a.name))) {
    if (!t.value || typeof t.value !== 'object') continue;
    for (const w of WEAPONS) if (w in t.value) pivot[w][t.name] = t.value[w];
  }
  anon.filter(a => !a.name).forEach((a, i) => {
    if (!a.value) return;
    const key = 'inline_L' + a.line;
    for (const w of WEAPONS) if (w in a.value) pivot[w][key] = a.value[w];
  });

  const places = tables.length + anon.length + ternaries.length + comparisons.length;
  return {
    ok: true,
    blobBytes: src.length,
    blobLines: src.split('\n').length,
    tables: tables.map(t => ({ name: t.name, line: t.line, weapons: t.weapons })),
    anonymous: anon.map(a => ({ name: a.name, line: a.line, context: a.context })),
    ternaries,
    comparisons,
    pins,
    places,
    pivot,
  };
}

module.exports = { census, combatSource, WEAPONS };

if (require.main === module) {
  const c = census();
  if (!c.ok) { console.error('CENSUS FAILED: ' + c.why); process.exit(1); }
  if (process.argv.includes('--json')) { console.log(JSON.stringify(c, null, 1)); process.exit(0); }
  console.log('THE FIGHT: COMBAT_B64, ' + c.blobBytes + ' bytes, ' + c.blobLines + ' lines, sealed inside the alpha');
  console.log('named tables keyed by weapon : ' + c.tables.length);
  c.tables.forEach(t => console.log('   L' + t.line + '  ' + t.name + '  [' + t.weapons.join(',') + ']'));
  console.log('inline tables [WEAPON]       : ' + c.anonymous.length);
  c.anonymous.forEach(a => console.log('   L' + a.line + '  ' + (a.name || a.context)));
  console.log('WEAPON==="x" ? ternaries     : ' + c.ternaries.length);
  console.log('comparisons to a weapon name : ' + c.comparisons.length);
  console.log('PLACES A WEAPON LIVES        : ' + c.places);
  console.log('gate asserts pinning a number: ' + c.pins.length);
  console.log('pistol, read live            : ' + JSON.stringify(c.pivot.pistol));
  if (process.argv.includes('--write')) {
    const { execSync } = require('child_process');
    let sha = 'unknown';
    try { sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch (e) {}
    const rec = Object.assign({ _readme: 'MODS [bb modding] 9/28: the measured cost of changing one weapon today. Written by tools/bohemia_mods_weapon_census.js --write. RESEARCH ONLY (rule 38g): no gate holds these counts yet; the recommended ratchet is in records/BOHEMIA_MODS_SCHOOL_HOW_BATTLE_BROTHERS_IS_MODDED_9_28_26.md s5.', measuredAt: sha }, c);
    delete rec.pivot;
    fs.writeFileSync(RECORD, JSON.stringify(rec, null, 1) + '\n');
    const draft = {
      _readme: [
        'DRAFT. NOT IN THE GAME. MODS [bb modding] 9/28, test material for [data line].',
        'This is what a modder would edit if weapons were data: one row per weapon.',
        'Every value was READ OUT OF THE LIVE FIGHT by tools/bohemia_mods_weapon_census.js, none typed.',
        'A key named inline_L<n> is a table with no name at all, written straight into an expression.',
        'TUNING owns what the numbers are. MODS owns that they live here.',
      ],
      draft: true,
      readFrom: 'slices/BOHEMIA_ALPHA_0_9.html COMBAT_B64 at ' + sha,
      weapons: c.pivot,
    };
    fs.writeFileSync(DRAFT, JSON.stringify(draft, null, 1) + '\n');
    console.log('wrote ' + path.relative(ROOT, RECORD) + ' and ' + path.relative(ROOT, DRAFT));
  }
}
