#!/usr/bin/env node
/* ============================================================================
   THE EXPRESSION LINE (RF4-35), AND WHY IT NEEDED A GATE ON 8/20/26

   laws/BOHEMIA_ADDENDUM_RECREATE_RF4_FIRST_8_16_26.md §5:

     "Systems are free to recreate. EXPRESSION IS NOT. Never copy a name, a
      string, an icon, a screen, or the title."

   RF4-35 was marked BUILT in the teardown spec on the strength of a sentence in
   its own diff column -- "nothing here copies an RF4 name into Bohemia" -- and
   NOTHING IN THE MACHINE HAD EVER CHECKED IT. That is the same shape as every
   other finding this week, and it was found by counting which BUILT rows any
   gate actually names: 20 of 24 were held, and this was one of the four that
   were not. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

   *** AND THE HARD HALF IS TELLING A CITATION FROM A NAME. ***
   `Rogue Fable` appears twice inside the shipped combat blob right now, and BOTH
   ARE LEGAL: they sit in code comments quoting the source a mechanic was built
   from, which is exactly what the row permits and what the QUEST STUDY LAW asks
   of every other borrowed idea in this repo. A gate that simply grepped the file
   would fail the build for doing the right thing, and the next session would
   "fix" it by DELETING THE CITATIONS -- turning honest sourcing into laundering.

   Paolo, 8/1: "a checker that cannot tell a mention from a use is the broken
   one. Fix the ruler, never the target." So this strips comments first and reads
   only what a player can actually see: readouts, button labels, and the visible
   text of the page.

   REUSE CHECK: cooks no graphic pixels, opens no bank. The RF4 vocabulary is not
   typed here -- it is READ OUT of the teardown spec's own citations, so the day
   LAB documents another RF4 name the sweep covers it without anybody
   remembering to add it.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SPEC = path.join(ROOT, 'records', 'BOHEMIA_RF4_TEARDOWN_SPEC.md');
const SURFACES = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_CITY_WORLD.html'];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };

/* ---- the vocabulary, read out of the spec rather than typed here ---- */
const spec = fs.readFileSync(SPEC, 'utf8');
const NAMES = [...new Set([
  ...spec.match(/\b[A-Z][a-z]+-of-[A-Z][a-z]+\b/g) || [],
  ...spec.match(/\bWar-Cry\b/g) || [],
  'Rogue Fable',
])];

/* ---- strip comments and every blob, then read what is LEFT as player text ---- */
const stripComments = s => s
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');

const decodeBlobs = html => {
  const out = [];
  const re = /const (\w+_B64)\s*=\s*'([^']{200,})'/g;
  let m;
  while ((m = re.exec(html))) {
    try { out.push({ name: m[1], text: Buffer.from(m[2], 'base64').toString('utf8') }); }
    catch (e) { /* not a text blob */ }
  }
  return out;
};

/* what a player can actually READ: readout lines, button labels, visible text */
const playerText = src => {
  const bits = [];
  for (const m of src.matchAll(/setRead\(([^;]{0,400}?)\)\s*;/g)) bits.push(m[1]);
  for (const m of src.matchAll(/\.textContent\s*=\s*([^;]{0,200});/g)) bits.push(m[1]);
  for (const m of src.matchAll(/>([^<>{}]{2,200})</g)) bits.push(m[1]);
  for (const m of src.matchAll(/(?:title|placeholder|alt|aria-label)\s*=\s*"([^"]{0,200})"/g)) bits.push(m[1]);
  return bits.join('\n');
};

ok('E1 THE VOCABULARY IS READ OUT OF THE SPEC, NOT TYPED HERE. A hand-typed list of forbidden words goes stale the first time LAB documents another RF4 item, and a sweep that is quietly out of date reads exactly like a clean one',
  NAMES.length >= 3 && NAMES.includes('Rogue Fable') &&
  NAMES.some(n => /-of-/.test(n)));
console.log('    sweeping for: ' + NAMES.join(', '));

let totalCitations = 0, leaks = [];
for (const rel of SURFACES) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const parts = [{ name: rel, text: html }, ...decodeBlobs(html)];
  for (const part of parts) {
    const bare = stripComments(part.text);
    const seen = playerText(bare);
    for (const n of NAMES) {
      const inComments = (part.text.match(new RegExp(n, 'g')) || []).length
                       - (bare.match(new RegExp(n, 'g')) || []).length;
      totalCitations += Math.max(0, inComments);
      if (seen.includes(n)) leaks.push(part.name + ' :: ' + n);
    }
  }
}

ok('E2 *** NOT ONE RF4 NAME REACHES A SURFACE THE PLAYER READS. *** Systems are free to recreate; expression is not. This is the check RF4-35 was marked BUILT without for four days'
  + (leaks.length ? '  LEAKED: ' + leaks.join(', ') : ''),
  leaks.length === 0);

ok('E3 AND THE CITATIONS ARE LEFT ALONE, WHICH IS THE WHOLE DIFFICULTY. ' + totalCitations
  + ' mention(s) of RF4 sit in code comments naming the source a mechanic came from, and every one of them is LEGAL and wanted -- the row permits RF4 names "only as citations of RF4\'s own content". A gate that grepped the file would fail the build for honest sourcing, and the obvious fix would be to delete the citations, which turns sourcing into laundering',
  totalCitations >= 1);

ok('E4 AND IT CAN TELL THE DIFFERENCE, PROVED ON THE SPOT rather than asserted: a name planted in a readout is caught, and the same name in a comment beside it is not. A checker that cannot tell a mention from a use is the broken one (Paolo 8/1)',
  (() => {
    const planted = "/* Rogue Fable IV does this */ setRead('Rogue Fable','x','#fff');";
    const commentOnly = "/* Rogue Fable IV does this */ setRead('THE SMOKE','x','#fff');";
    return playerText(stripComments(planted)).includes('Rogue Fable')
        && !playerText(stripComments(commentOnly)).includes('Rogue Fable');
  })());

console.log('=== EXPRESSION LINE GATE: ' + pass + ' passed, ' + fail + ' failed ===');
process.exit(fail ? 1 : 0);
