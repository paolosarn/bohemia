#!/usr/bin/env node
/* BOHEMIA -- MODS [mod checklist] (research, 10/10/26): a modder's self-check. Runs a folder of mods through the reference
   merge and says what happened in plain words, using the codes and fixes of
   records/BOHEMIA_MODS_PLAIN_WORDS_WHEN_A_MOD_IS_WRONG_10_10_26.md. Help only: it never refuses a mod.
   Usage: node tools/bohemia_mods_check.js <folder holding your mod folders> */
'use strict';
const { merge } = require('./bohemia_mods_merge_reference.js');
const { C } = require('./bohemia_mods_error_messages.js');
function check(dir) {
  const r = merge(dir), plain = {};
  C.forEach(e => plain[e[0]] = { plain: e[2], fix: e[3] });
  const lines = [], n = { bad: 0, warn: 0, ok: 0 };
  for (const l of r.log) {
    n[l[0]]++;
    if (l[0] === 'ok') { lines.push('  ok   ' + l[1]); continue; }
    const p = plain[l[2]];
    lines.push((l[0] === 'bad' ? '  SKIPPED ' : '  NOTE    ') + (l[2] || '') + '  ' + l[1]);
    if (p) { lines.push('            what it means: ' + p.plain); lines.push('            how to fix:    ' + p.fix); }
  }
  const head = r.mods + ' mod(s) read. ' + (r.changed ? 'Your changes made a difference.' : 'Nothing changed in the game data.') +
    ' ' + n.bad + ' part(s) skipped, ' + n.warn + ' note(s).';
  return { text: [head].concat(lines).join('\n'), n, r };
}
module.exports = { check };
if (require.main === module) {
  if (!process.argv[2]) { console.log('Usage: node tools/bohemia_mods_check.js <folder holding your mod folders>'); process.exit(0); }
  console.log(check(process.argv[2]).text);
}
