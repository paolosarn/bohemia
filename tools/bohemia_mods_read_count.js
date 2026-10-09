#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: THE READ COUNT (MODS lane, row [read count], 9/30/26)

   The coordinator's row: "count, on clean main, how many files a modder must
   read and touch to change one weapon's damage, one background, one sound; the
   number is the readability score the data line has to beat; report it every
   round."  This tool is that number, re-runnable in about two seconds.

   For each probe (a literal that DEFINES the thing) it counts:
     FOUND      tracked files a plain text search for the literal finds, split
                LIVE (engine/, slices/), GATE (gates/), TOOL (tools/), DOC (the rest)
     HIDDEN     tracked files that hold a LIVE copy the plain search CANNOT see,
                because it sits inside a base64 blob (COMBAT_B64, RIG_B64,
                PREFAB_B64) in an .html file: found only by decoding
     TOUCH      the files a modder must EDIT for the change to stick and stay
                green: every LIVE copy (found + hidden) plus every GATE that pins it
     A modder who greps sees FOUND and misses HIDDEN. HIDDEN is the finding.

   Usage: node tools/bohemia_mods_read_count.js [--write] [--json]
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const RECORD = path.join(ROOT, 'records', 'BOHEMIA_MODS_READ_COUNT_LATEST.json');

const PROBES = [
  { thing: 'one weapon\'s damage (the pistol\'s lethal odds)', literal: 'WEAPON_LETHAL' },
  { thing: 'one weapon\'s damage in the NEW fight (the knife row)', literal: '"id": "knife",' },
  { thing: 'one background (the kitchen hand, a former trade)', literal: 'RAN A KITCHEN' },
  { thing: 'one sound (the gunshot)', literal: 'shot: {' },
];

function tracked() { return execSync('git ls-files', { cwd: ROOT, maxBuffer: 1 << 28 }).toString().split('\n').filter(Boolean); }
/* A page registered in VOTE is a candidate a lane made, never the game itself, so it is DOC. */
const CANDIDATES = new Set();
try {
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  for (const i of reg.items || []) if (i.lane === 'mods' && i.show && i.show.src && /\.html$/.test(i.show.src)) CANDIDATES.add('slices/' + i.show.src);
} catch (e) {}
function cat(f) { if (CANDIDATES.has(f)) return 'DOC'; return f.startsWith('slices/') || f.startsWith('engine/') || f.startsWith('records/target/') ? 'LIVE' : f.startsWith('gates/') ? 'GATE' : f.startsWith('tools/') ? 'TOOL' : 'DOC'; }

const files = tracked().filter(f => /\.(js|py|html|md|txt|json)$/.test(f));
const texts = new Map();
function text(f) { if (!texts.has(f)) { try { texts.set(f, fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { texts.set(f, ''); } } return texts.get(f); }

function blobs(html) {
  const out = [];
  const re = /(\w+_B64)\s*=\s*["']([A-Za-z0-9+/=]{2000,})["']/g;
  let m;
  while ((m = re.exec(html))) out.push({ name: m[1], src: Buffer.from(m[2], 'base64').toString('utf8') });
  return out;
}

function probe(p) {
  const found = { LIVE: [], GATE: [], TOOL: [], DOC: [] }, hidden = [];
  for (const f of files) {
    const t = text(f);
    if (t.includes(p.literal)) found[cat(f)].push(f);
    if (f.endsWith('.html') && cat(f) === 'LIVE') {
      for (const b of blobs(t)) if (b.src.includes(p.literal)) hidden.push(f + ' [' + b.name + ']');
    }
  }
  const touch = found.LIVE.length + hidden.length + found.GATE.length;
  return { thing: p.thing, literal: p.literal,
    found: { LIVE: found.LIVE.length, GATE: found.GATE.length, TOOL: found.TOOL.length, DOC: found.DOC.length },
    foundLive: found.LIVE, foundGates: found.GATE,
    hidden, touch };
}

const res = PROBES.map(probe);
let sha = 'unknown';
try { sha = execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch (e) {}
const out = { measuredAt: sha, note: 'MODS [read count]. touch = live copies (found + hidden in a blob) + gates that pin the literal. The data line has to beat these numbers; the target is 1.', probes: res };
if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
console.log('READ COUNT at ' + sha + '  (a modder greps; HIDDEN is what the grep cannot see)');
for (const r of res) {
  console.log('\n' + r.thing + '   [' + r.literal + ']');
  console.log('  found by a plain search: live ' + r.found.LIVE + ', gates ' + r.found.GATE + ', tools ' + r.found.TOOL + ', docs ' + r.found.DOC);
  console.log('  HIDDEN inside a blob   : ' + r.hidden.length + (r.hidden.length ? '   ' + r.hidden.join(', ') : ''));
  console.log('  FILES TO TOUCH         : ' + r.touch + '  (live ' + (r.found.LIVE + r.hidden.length) + ' + gates ' + r.found.GATE + ')');
}
if (process.argv.includes('--write')) { fs.writeFileSync(RECORD, JSON.stringify(out, null, 1) + '\n'); console.log('\nwrote ' + path.relative(ROOT, RECORD)); }
