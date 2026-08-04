/* ============================================================================
   NO MARKERS GATE (8/3/26, LAB lane)

   TWICE IN ONE DAY a session committed GIT CONFLICT MARKERS into
   00_START_HERE_NEXT_SESSION.md -- the ONE file every session is required to read
   first, immediately after CLAUDE.md.

     1. I did it. A python conflict-resolver threw on its LAST assert, so the file was
        never written -- and I ran `git add` and `rebase --continue` anyway without
        looking. Fixed and force-pushed the same turn.
     2. The PEOPLE lane did it in 105a6b5, mangling 162 lines of the COMBAT lane's
        section together with its own. Repaired here, both sides kept whole.

   Two different sessions, same failure, same day, and NOTHING IN THE MACHINE CARED.
   That is the definition of an unenforced rule. A LAW WITHOUT A MACHINE GATE IS NOT
   ENFORCED, so this is the gate.

   WHY IT IS WORTH ITS OWN GATE RATHER THAN A LINE IN ANOTHER ONE: the handoff is
   shared infrastructure with no owning lane, so no lane's gate was ever going to
   check it. Parallel sessions all rewrite it, which is exactly why it collides, and a
   corrupted handoff silently poisons the NEXT session's understanding of where the
   project is -- the most expensive possible thing to get wrong for the one human this
   apparatus exists to protect.

   IT SWEEPS EVERY TRACKED TEXT FILE, not just the handoff, because a marker committed
   into an engine module or a law is worse, not better.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('NO MARKERS GATE — no session ships a git conflict marker,');
console.log('                  least of all into the handoff every session reads');
console.log('='.repeat(74));

/* The three marker forms git writes. Matched at LINE START only: prose legitimately
   contains "=======" as a rule and "<<<" in other contexts, and a check that hunts the
   characters anywhere instead of the STRUCTURE is the bug this repo keeps shipping. */
const MARKERS = [
  [/^<<<<<<< /m, 'ours-side marker'],
  [/^>>>>>>> /m, 'theirs-side marker'],
  [/^=======$/m, 'divider']
];

const SKIP_DIRS = new Set(['.git', 'node_modules', 'archive']);
const EXT = /\.(md|txt|js|py|html|json|css)$/;

function walk(dir, out) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return out;
  for (const f of fs.readdirSync(full, { withFileTypes: true })) {
    if (f.name.startsWith('.')) continue;
    const rel = dir ? path.join(dir, f.name) : f.name;
    if (f.isDirectory()) { if (!SKIP_DIRS.has(f.name)) walk(rel, out); continue; }
    if (EXT.test(f.name)) out.push(rel);
  }
  return out;
}

const HANDOFF = '00_START_HERE_NEXT_SESSION.md';
ok('A1 the handoff exists at its one required name', fs.existsSync(path.join(ROOT, HANDOFF)));

/* THE HANDOFF IS CHECKED FIRST AND NAMED SEPARATELY, because it is the file that has
   actually been broken twice and a reader of this output should see it called out. */
const handoff = fs.existsSync(path.join(ROOT, HANDOFF))
  ? fs.readFileSync(path.join(ROOT, HANDOFF), 'utf8') : '';
MARKERS.forEach(([re, what], i) =>
  ok('A2.' + (i + 1) + ' the handoff carries no ' + what, !re.test(handoff)));

/* A repaired conflict must keep BOTH sides. A "resolution" that deletes the other
   lane's section is worse than the conflict, because the conflict is visible and the
   deletion is not. So: the handoff must still carry more than one lane heading. */
const lanes = [...new Set((handoff.match(/^[A-Z][A-Z ]{1,14}\([a-z0-9-]+\):/gm) || [])
  .map(h => h.split('(')[0].trim()))];
ok('A3 the handoff still carries several lanes\' sections (' + lanes.length + ' lanes: ' +
   lanes.slice(0, 8).join(', ') + ') — a resolution that deletes another lane is not a resolution',
   lanes.length >= 2);

/* ---- AND EVERY OTHER TRACKED TEXT FILE ------------------------------------ */
const files = walk('', []);
let hits = [];
files.forEach(f => {
  let src;
  try { src = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { return; }
  /* This gate contains the marker patterns as source code, so it must exempt itself --
     but by PATH, never by "does it look like a gate", or the exemption becomes a hole
     any file could crawl through. */
  if (f === 'gates/nomarkers_gate.js') return;
  MARKERS.forEach(([re, what]) => { if (re.test(src)) hits.push(f + ': ' + what); });
});
ok('B1 no tracked text file carries a conflict marker (' + files.length + ' swept)' +
   (hits.length ? ' -> ' + hits.slice(0, 5).join('; ') : ''), hits.length === 0);

console.log('='.repeat(74));
console.log('  NO MARKERS GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('='.repeat(74));
process.exit(fail ? 1 : 0);
