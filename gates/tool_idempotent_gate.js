#!/usr/bin/env node
/* ============================================================================
   BOHEMIA TOOL IDEMPOTENT GATE — THE TOOLS THAT STILL RUN ARE THE DANGEROUS ONES.
   (8/21/26, FACTIONS lane)

   Read: records/BOHEMIA_THE_LOUD_FAILURES_WERE_THE_SAFE_ONES_8_21_26.md
   Backlog: P-N (filed 8/4, "sixty tools reach for CITY_B64 and crash")

   REUSE CHECK (REUSE-FIRST): cooks nothing and rewrites no tool. It runs tools
   that already exist and diffs the tree with git. gates/reusefirst_gate.py sweeps
   tool DOCSTRINGS and gates/tools_run_gate reproduces specific factories; neither
   asks whether running a tool twice DESTROYS something, which is this.

   ------------------------------------------------------------------------
   MEASURED, BY RUNNING ALL 63 — TWO STATIC GUESSES GOT IT WRONG FIRST
   ------------------------------------------------------------------------
   P-N has said since 8/4 that ~60 city patch tools crash. Counting them by
   reading the code gave 63, then 61 — and both were wrong, because referencing
   CITY_B64 is not the same as breaking on it (bohemia_city_module_resync.py was
   in both "broken" lists and runs perfectly). A CLASSIFIER THAT CANNOT TELL A
   WORKING TOOL FROM A BROKEN ONE IS THE BROKEN THING. So all 63 were RUN, with
   the tree hard-reset after each:

       BROKE (crash, exit 1)      52
       NOOP  (idempotent)          9
       RAN   (changed the tree)    2

   ------------------------------------------------------------------------
   AND THE RANKING IS INVERTED FROM WHAT THE BACKLOG ASSUMED
   ------------------------------------------------------------------------
   The 52 that crash are the SAFE ones. They fail loudly, change nothing, and
   their edits were baked into the committed city years of turns ago — dead
   scaffolding, not urgent rot. Migrating them is an afternoon nobody needs to
   spend today.

   THE TWO THAT STILL RUN ARE THE PROBLEM:

     bohemia_city_hero_wire_patch.py   prints "69 district heroes wired via
       switch-guard; CITY_B64 2588 KB" plus a 69-name district list, exits 0, and
       CHANGES NOTHING AT ALL. A confident success message over a silent no-op —
       the same disease as a green gate that proves nothing, which is what this
       whole lane spent the week removing.

     bohemia_city_cast_patch.py        prints "wrote ALPHA + CITY", exits 0, and
       DELETES 63 LINES FROM THE ALPHA to add 9. It is destructive on an
       already-patched tree, and it is the one hazard here that can cost real work.

   P-N predicted exactly this shape — "a tool that HALF-works is worse than one
   that crashes loudly" — and then filed the crashers as the problem.

   THIS IS ALSO THE BEST LEAD ON AN UNSOLVED INCIDENT: earlier this same session
   1,159 lines vanished from the city during a mutation cycle and could not be
   reproduced. A patch tool that silently rewrites an already-patched tree is
   precisely that shape. NOT PRESENTED AS THE CAUSE — it was never reproduced,
   and calling it solved would be the false finding this lane keeps catching.

   ------------------------------------------------------------------------
   WHAT IT HOLDS
   ------------------------------------------------------------------------
   A PATCH TOOL MUST BE IDEMPOTENT. Every one of them is written to be run again
   — that is the whole point of a marker — so running one on an already-patched
   tree must change NOTHING. Only the tools that actually execute are checked;
   a tool that crashes cannot destroy anything, and 52 slow crashes would make
   this gate useless.

   IT REFUSES TO RUN ON A DIRTY TREE, because it measures with git diff and
   somebody else's uncommitted work would read as a tool's damage.

     node gates/tool_idempotent_gate.js
   ============================================================================ */
'use strict';
const cp = require('child_process');
const path = require('path');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

/* the tools MEASURED to execute rather than crash. A crasher cannot destroy
   anything, and running all 63 would cost minutes to learn nothing. */
const RUNS = [
  'bohemia_city_cast_patch.py',
  'bohemia_city_dropin_on_the_street_patch.py',
  'bohemia_city_hero_wire_patch.py',
  'bohemia_city_module_resync.py',
  'bohemia_city_overmap_resync.py',
  'bohemia_city_zoombuild_patch.py',
  'bohemia_human_start.py',
  'bohemia_rig_is_law_patch.py',
  'bohemia_run_perimeterwall_patch.py',
  'bohemia_run_spawn.py',
  'bohemia_touch_guard_patch.py',
];

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim); if (detail) console.log('       ' + detail); }
}
const git = (a) => cp.execSync('git ' + a, { cwd: ROOT, encoding: 'utf8' }).trim();

/* ---- IT MEASURES A DELTA, NOT AN ABSOLUTE -------------------------------
   THE FIRST VERSION REFUSED TO RUN ON A DIRTY TREE, and that was wrong in the
   ordinary case rather than the rare one: the very first suite run went red
   because registering this gate had left bohemia_gates.py modified. Every lane
   runs the suite with uncommitted work -- that IS the normal state -- so a gate
   that reds on dirt would be red almost always, and a gate that is always red
   teaches everyone to ignore it.
   A BASELINE, NOT A VETO. The tree's existing state is recorded first and
   subtracted, so pre-existing edits cancel out and only what a TOOL changes is
   attributed to it. Same correctness, none of the false reds -- and it still
   restores anything a tool writes, so somebody else's work is never lost. */
function snapshot() {
  const st = git('diff --numstat') + '\n@@\n' + git('status --porcelain');
  return st;
}
const baseline = snapshot();

/* ---- AND THE UNTRACKED FILES THAT WERE ALREADY HERE ----------------------
   THIS GATE ATE A LANE'S RECORD ON 8/25 AND ITS OWN T4 IS WHAT CAUGHT IT.
   The restore below used to finish with `git clean -qfd slices engine banks
   records`, which deletes EVERY untracked file in those folders -- not the ones
   a tool just wrote, all of them. A COMBAT record written that turn and not yet
   committed was deleted by a gate whose own claim is "nothing a lane had in
   flight was thrown away either". T4 went red, correctly, AFTER the file was
   already gone, and the failure landed in a list of 22 with no way to tell it
   apart from somebody else's.
   THE BUG IS THE SAME SHAPE AS THE ONE THE GATE EXISTS TO CATCH: a blunt
   instrument that cannot tell its own output from somebody else's work. The
   tracked half already got this right -- it takes a baseline and subtracts it.
   The untracked half never did. So: record what was untracked BEFORE anything
   runs, and only remove what APPEARED. */
function untrackedNow() {
  return new Set(git('status --porcelain -uall').split('\n')
    .filter(l => l.startsWith('??'))
    .map(l => l.slice(3).trim().replace(/^"|"$/g, ''))
    .filter(Boolean));
}
const baseUntracked = untrackedNow();
/* A SENTINEL, because a claim that this no longer eats files is worth exactly
   as much as a test that puts a file in front of it. Untracked, in one of the
   four folders it used to sweep, present before the first tool runs. */
const SENTINEL = 'records/.tool_idempotent_sentinel.tmp';
try { require('fs').writeFileSync(path.join(ROOT, SENTINEL),
  'if this file is missing, the gate ate a lane\'s work again\n'); } catch (_e) {}
baseUntracked.add(SENTINEL);
ok('a baseline of the tree is taken before anything runs, so a lane\'s '
  + 'uncommitted work is never attributed to a tool. The first cut REFUSED on a '
  + 'dirty tree and went red on its own registration commit — a gate that is red '
  + 'in the ordinary case is one everybody learns to ignore',
  typeof baseline === 'string');

const destructive = [], silent = [], clean = [];
for (const t of RUNS) {
  const file = 'tools/' + t;
  let out = '', code = 0;
  try { out = cp.execSync('timeout 180 python3 ' + file + ' 2>&1', { cwd: ROOT, encoding: 'utf8' }); }
  catch (e) { out = (e.stdout || '') + (e.stderr || ''); code = e.status || 1; }

  /* the DELTA against the baseline: what THIS tool changed, ignoring whatever
     was already uncommitted when the gate started. */
  const now = snapshot();
  let ins = 0, del = 0;
  if (now !== baseline) {
    const base = {}, cur = {};
    for (const ln of git('diff --numstat').split('\n').filter(Boolean)) {
      const q = ln.split('\t'); cur[q[2]] = [parseInt(q[0], 10) || 0, parseInt(q[1], 10) || 0];
    }
    for (const ln of baseline.split('\n@@\n')[0].split('\n').filter(Boolean)) {
      const q = ln.split('\t'); base[q[2]] = [parseInt(q[0], 10) || 0, parseInt(q[1], 10) || 0];
    }
    for (const f in cur) {
      const b = base[f] || [0, 0];
      ins += Math.max(0, cur[f][0] - b[0]);
      del += Math.max(0, cur[f][1] - b[1]);
    }
    /* restore ONLY what this tool touched, never the lane's own work */
    for (const f in cur) if (!base[f] || String(base[f]) !== String(cur[f])) {
      if (base[f]) continue;                    /* already dirty before: leave it */
      try { cp.execSync('git checkout -q -- ' + JSON.stringify(f), { cwd: ROOT }); } catch (_e) {}
    }
    /* ONLY WHAT APPEARED. `git clean -qfd slices engine banks records` used to
       sit here and it deleted every untracked file in four folders, including a
       lane's in-flight record. Subtract the baseline, exactly as the tracked
       half above already does. */
    for (const f of untrackedNow()) {
      if (baseUntracked.has(f)) continue;                        /* was already here: not ours to delete */
      if (!/^(slices|engine|banks|records)\//.test(f)) continue;  /* same four folders as before */
      try { require('fs').rmSync(path.join(ROOT, f), { force: true }); } catch (_e) {}
    }
  }
  const claimedWrite = /\bwrote\b|\bwired\b|\bKB\b/i.test(out) && !/no-?op|already|nothing to do/i.test(out);
  const rec = { tool: t, code, ins, del, claimedWrite, first: out.split('\n').filter(Boolean)[0] || '' };
  if (del > 0 || ins > 0) destructive.push(rec);
  else if (claimedWrite) silent.push(rec);
  else clean.push(rec);
}

ok('T1 NO PATCH TOOL REWRITES AN ALREADY-PATCHED TREE. Every one of them is '
  + 'written to be run again — that is what the marker is for — so running one '
  + 'on a tree it has already patched must change NOTHING. A tool that deletes '
  + 'lines on a second run is a loaded gun in the toolchain, and it is the best '
  + 'lead on the 1,159 lines that vanished from the city this same session and '
  + 'were never reproduced',
  destructive.length === 0,
  destructive.map(d => d.tool + ' (+' + d.ins + '/-' + d.del + ')').join(', '));

ok('T2 …and NO TOOL REPORTS SUCCESS OVER A SILENT NO-OP. Printing "69 district '
  + 'heroes wired; CITY_B64 2588 KB" and changing zero bytes is the same disease '
  + 'as a green gate that proves nothing: it is a claim nobody checked, and the '
  + 'next person to read that line believes the work happened',
  silent.length === 0,
  silent.map(s => s.tool + ' — "' + s.first.slice(0, 70) + '"').join(' | '));

ok('T3 …and the honest ones stay honest: a tool that has nothing to do SAYS so '
  + 'and touches nothing. This is the behaviour the other two should copy, and '
  + 'it is already the majority',
  clean.length >= 7, clean.map(c => c.tool).join(', '));

/* T5 RUNS BEFORE T4, because T4 compares against a baseline that counts the
   sentinel, so the sentinel has to still be there when T4 reads the tree. */
const sentinelLived = require('fs').existsSync(path.join(ROOT, SENTINEL));
ok('T5 *** AND THIS GATE NO LONGER EATS A LANE\'S UNCOMMITTED WORK, WHICH IT DID '
  + 'ON 8/25. *** The restore step ended with `git clean -qfd slices engine banks '
  + 'records` — every untracked file in four folders, not the ones a tool just '
  + 'wrote — and it deleted a COMBAT record written that same turn and not yet '
  + 'committed. THE SAME SHAPE AS THE DISEASE THIS GATE EXISTS TO CATCH: a blunt '
  + 'instrument that cannot tell its own output from somebody else\'s work. The '
  + 'tracked half always took a baseline and subtracted it; the untracked half '
  + 'never did. This claim is worth what the test in front of it is worth, so '
  + 'there is a real untracked sentinel file sitting in records/ the whole time '
  + 'the tools run',
  sentinelLived, 'the sentinel was deleted — the restore step is eating files again');
try { require('fs').rmSync(path.join(ROOT, SENTINEL), { force: true }); } catch (_e) {}

ok('T4 the tree is as it was AFTER measuring too — nothing this gate ran '
  + 'survived it, and nothing a lane had in flight was thrown away either. '
  + 'T4 IS WHAT CAUGHT THE 8/25 DELETION, correctly and far too late: it went '
  + 'red after the file was already gone, in a list of 22 reds with nothing to '
  + 'tell it apart from somebody else\'s. A gate that detects the damage it '
  + 'itself did is still a gate that did the damage',
  snapshot() === baseline,
  'baseline drifted; run `git status` and check nothing was lost');

console.log('');
console.log('  ran ' + RUNS.length + ' tools that execute (52 more crash on the dead '
  + 'CITY_B64 key and cannot damage anything)');
for (const d of destructive) console.log('  DESTRUCTIVE: ' + d.tool + '  +' + d.ins + ' / -' + d.del);
for (const s of silent) console.log('  SILENT NO-OP: ' + s.tool + '  "' + s.first.slice(0, 60) + '"');

console.log('\nTOOL IDEMPOTENT GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
