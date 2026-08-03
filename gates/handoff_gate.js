#!/usr/bin/env node
/* ============================================================================
   HANDOFF GATE — 8/2/26.

   CLAUDE.md: "`00_START_HERE_NEXT_SESSION.md` at repo root: read it immediately
   after this file, every session. There is only ever ONE, it always has this
   exact name so it sorts first and can never be missed."

   TWICE NOW that file has reached main with a LIVE MERGE CONFLICT in it --
   `<<<<<<<`, `=======`, `>>>>>>>` sitting in the text, one lane's head buried
   inside another's. The file's own history records the first time. The second
   was found on 8/2 by a session that only opened it to add its own head.

   WHY IT MATTERS MORE THAN IT LOOKS. Every parallel session is instructed to read
   this file FIRST, before it does anything. A conflicted handoff does not throw,
   does not fail to load, and does not look broken at a glance -- it just quietly
   hides one lane's entire status behind a marker, and the next session plans its
   work against half a picture. It is the highest-traffic file in the repo and the
   only one with no machine check on it at all.

   A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This is that gate.

   WHAT IT HOLDS
     1. the file exists, at the exact canonical name, at the repo root
     2. there is exactly ONE of it (no BOHEMIA_HANDOFF.md, no _OLD, no dated copy)
     3. NO conflict markers, in it or in any tracked text file
     4. it still leads with a lane head, so it has not been truncated to nothing

   ON THE MARKER TEST, because a sloppy one would fail the fix it guards: only
   `<<<<<<<` and `>>>>>>>` at the START of a line count. `=======` alone is not
   enough -- that is also a markdown setext heading underline, and this repo's
   records are full of them. And a line that MENTIONS markers mid-sentence (this
   file does, and so does the handoff head that reported the 8/2 conflict) is
   prose about the bug, not the bug. Comments are not code, and prose is not a
   conflict.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const NAME = '00_START_HERE_NEXT_SESSION.md';

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL ' + n)); };

const HANDOFF = path.join(ROOT, NAME);
ok('the handoff is at the repo root under its exact canonical name', fs.existsSync(HANDOFF));
const text = fs.existsSync(HANDOFF) ? fs.readFileSync(HANDOFF, 'utf8') : '';

/* THERE IS ONLY EVER ONE. A second copy is how a session ends up reading a stale
   one; the law says git history is the archive, not a sibling file. */
const rootFiles = fs.readdirSync(ROOT).filter(f => /START_HERE|HANDOFF/i.test(f));
ok('there is exactly ONE handoff at the root (' + rootFiles.join(', ') + ')', rootFiles.length === 1);

ok('it is not empty and still leads with a lane head (first line: "'
  + text.split('\n')[0].slice(0, 48) + '...")',
  /^[A-Z][A-Z ]*\([a-z0-9-]+\):/.test(text.split('\n')[0] || ''));

/* the conflict itself */
const START = /^<<<<<<< /m, END = /^>>>>>>> /m;
ok('THE HANDOFF CARRIES NO UNRESOLVED MERGE', !START.test(text) && !END.test(text));

/* and nowhere else either: a conflicted law or record is the same failure with a
   smaller blast radius. Tracked files only -- untracked scratch is nobody's
   business, and binaries are skipped. */
let tracked = [];
try {
  tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean)
    .filter(f => /\.(md|txt|js|py|json|html|css)$/.test(f));
} catch (e) { /* not a checkout; the handoff check above still stands */ }

const conflicted = [];
for (const f of tracked) {
  let body;
  try { body = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
  if (body.length > 4e6) continue;                       // the 34MB alpha, not text to diff
  if (START.test(body) && END.test(body)) conflicted.push(f);
}
ok('no tracked file carries an unresolved merge ('
  + (conflicted.length ? conflicted.slice(0, 5).join(', ') : 'none of ' + tracked.length) + ')',
  conflicted.length === 0);

console.log('\n=== HANDOFF GATE: ' + pass + ' passed, ' + fail + ' failed ===');
console.log('    the one file every session reads first is readable.');
if (fail) process.exit(1);
