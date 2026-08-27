#!/usr/bin/env node
/* ============================================================================
   BOHEMIA ORGAN REACH GATE — TEN IN ONE WEEK MEANS THE MACHINE SHOULD BE
   CATCHING THIS, NOT MY ATTENTION.   (8/21/26, FACTIONS lane)

   Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md
   Tool: tools/bohemia_organ_reach.js  (this gate reuses its exact tiering)
   Read: records/BOHEMIA_A_WIRE_TO_THE_WRONG_SURFACE_8_20_26.md

   REUSE CHECK (REUSE-FIRST): cooks nothing and re-implements nothing. The
   tiering logic lives in tools/bohemia_organ_reach.js and this gate SHELLS OUT
   TO IT rather than copying it — a second implementation of the same sweep is
   two opinions about one repo, which is the exact bug this lane spent a week
   removing. gates/sfx_wired_gate.py answers this question for SOUNDS and does
   not generalise; that is why it is not extended instead.

   ------------------------------------------------------------------------
   WHAT IT HOLDS, AND WHY IT CANNOT ROT INTO A BLANKET ALLOWLIST
   ------------------------------------------------------------------------
   TEN TIMES in one week, in this lane alone: AN ORGAN COMPUTES SOMETHING AND
   NOTHING ON THE WALKED SURFACE CALLS IT. give(), the uncollected favour, the
   cost that cost nothing, the ladder with no rungs, neglectFor, the count asked
   to remember, askOutcome, the three third-party conditions, tertius, onward.
   Nine of the ten were found by TRIPPING OVER THEM. It never shows up as a
   crash: the organ is correct, its unit test is green, its gate is green, and
   the feature does not exist for the player.

     1. NOTHING ANYWHERE IS A DEFECT, NO EXEMPTION POSSIBLE. A function nothing
        in the whole repo calls is dead code, whatever anybody claims about it.
     2. NOT ON THE SURFACE NEEDS A WRITTEN REASON. A function only a gate or a
        tool touches must be declared HERE with a sentence saying why it exists
        for the machine. Undeclared -> red, and the failure NAMES it.
     3. A STALE EXEMPTION IS ALSO A DEFECT. If a declared helper later gets
        wired to the surface, this goes red telling you to DELETE the entry.
        Without this rule the list only ever grows and stops meaning anything.
     4. AN EXEMPTION FOR A FUNCTION THAT DOES NOT EXIST IS ROT. Renamed or
        removed, the entry must go.

   Rules 3 and 4 are the whole reason this is a gate and not a checklist. An
   allowlist checked in ONE direction is a place to hide things; checked in BOTH
   it is a ledger that has to stay true.

   ------------------------------------------------------------------------
   THE BLIND SPOT IT INHERITS, DELIBERATELY
   ------------------------------------------------------------------------
   The sweep's first version reported BohemiaTies as a whole module with zero
   callers. Great finding, COMPLETELY WRONG — the module is handed to another
   organ as a VALUE ({ties: BohemiaTies}), so its methods are called under
   another name and a textual count cannot see them. The tool flags such modules
   INJECTED and this gate refuses to fail an injected module's functions on
   surface-reach alone. A SWEEP THAT CANNOT TELL AN INJECTED MODULE FROM A DEAD
   ONE IS THE BROKEN THING (fix the ruler, never the target).

     node gates/organ_reach_gate.js
   ============================================================================ */
'use strict';
const cp = require('child_process');
const path = require('path');

const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

/* ---- RULE 2: the declared helpers, each with the reason it is not on the
   surface. A name may only sit here while it is STILL tooling-only (rule 3) and
   STILL exists (rule 4), so this list cannot quietly become a dumping ground. */
/* *** THREE ENTRIES CAME OUT OF THIS LIST ON 8/27, WHICH IS RULE 3 DOING ITS
   JOB. *** BohemiaBetween.keys, BohemiaBelonging.keys and BohemiaIntros.keys were
   declared tooling-only because "a card asks about ONE outfit, never about all of
   them". The outfit board changed that: the surface asks for the whole roster
   now, all three read `surface` in the sweep, and an exemption for something the
   player can reach is the beginning of a list that means nothing. */
const TOOLING_ONLY = {
  'BohemiaBetween.myRipples':
    'the player\'s OWN outfit\'s canon positions, for faction_between C4. It '
    + 'returns EMPTY today and that is the correct answer, not a gap: canon\'s '
    + 'note on Custom is "Player faction. No preset philosophy. Identity emerges '
    + 'from three generations of action", so an emergent outfit has not made its '
    + 'enemies yet. No card can show a list that is empty by construction, and '
    + 'the claim that asserts the emptiness is CORRECT is the whole reason this '
    + 'function exists — on 8/21 this lane reported his own faction as a defect '
    + 'for exactly this shape and he had to correct it.',
  'BohemiaCommitment.states':
    'the commitment ladder as a list, for faction_arc J6. The card never asks '
    + 'for the whole ladder — it asks what YOUR state is and what the next one '
    + 'costs — but a gate pinning "none, sided, burned and nothing after it" has '
    + 'to read the organ to catch a fourth stage being added behind J1.',
  'BohemiaTies.degrees':
    'how many people each person knows, for a gate measuring the SHAPE of the '
    + 'graph rather than one edge of it. It produced the 199-of-298 finding. A '
    + 'card only ever asks about one pair, so the surface has no use for it.',
  'BohemiaPeople.seatLineOf':
    "PEOPLE's module, not this lane's. Left declared rather than deleted so this "
    + 'gate reports on it without failing another lane; that lane owns the call.',
  'BohemiaPeople.esWordsIn':
    'the one implementation of "which Spanish words does this string contain", '
    + 'and it is tooling-only ON PURPOSE. LANGUAGE NEVER GATES REQUIRED '
    + 'INFORMATION (Paolo 8/25) is a rule about what must NEVER reach the '
    + 'surface, so the thing that checks it belongs off the surface by '
    + 'definition: language_gate sweeps every objective, resolution button and '
    + 'job offer through this function. It lives in the engine rather than in '
    + 'the gate because a checker that re-types the rule it is checking is how '
    + "o'clock got read as the Spanish word \"o\" in one place and not the other.",
};

/* KNOWN DEAD, OWNED ELSEWHERE. Rule 1 admits no exemption for THIS lane's
   modules, but failing on another lane's orphan would make my gate their
   blocker, which ONE SYSTEM ONE SESSION forbids. It is REPORTED every run and
   the report is the handoff. */
const OTHER_LANES = ['BohemiaPeople.peopleOf'];

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim); if (detail) console.log('       ' + detail); }
}

/* ---- run the TOOL, never a second copy of its logic --------------------- */
let raw = '';
try {
  raw = cp.execSync('node tools/bohemia_organ_reach.js', { encoding: 'utf8', cwd: ROOT });
} catch (e) {
  raw = (e.stdout || '') + (e.stderr || '');
}

ok('the sweep tool ran and produced a reach table', /ORGAN REACH/.test(raw),
  raw.slice(0, 300));

/* parse the tool's own report rather than recomputing it */
const lines = raw.split('\n');
const modules = [];
let cur = null;
for (const ln of lines) {
  let m = ln.match(/^\s{2}(\w+)\s+(\d+) fns\s+\|\s+surface (\d+)\s+engine (\d+)\s+tooling-only (\d+)\s+NOTHING (\d+)(.*)$/);
  if (m) {
    cur = { global: m[1], fns: +m[2], surface: +m[3], engine: +m[4],
            tooling: +m[5], nothing: +m[6],
            injected: /INJECTED/.test(m[7]), toolingNames: [], deadNames: [] };
    modules.push(cur);
    continue;
  }
  m = ln.match(/^\s+only a gate or tool:\s*(.+)$/);
  if (m && cur) { cur.toolingNames = m[1].split(',').map(s => s.trim()).filter(Boolean); continue; }
  m = ln.match(/^\s+\*\*\* NOTHING ANYWHERE:\s*(.+)$/);
  if (m && cur) { cur.deadNames = m[1].split(',').map(s => s.trim()).filter(Boolean); }
}

ok('…and it swept every module the lane owns, with a real function count',
  modules.length >= 6 && modules.every(x => x.fns > 0),
  JSON.stringify(modules.map(x => x.global + ':' + x.fns)));

/* ---- RULE 1: nothing anywhere is a defect ------------------------------- */
const deadAll = [];
for (const mod of modules)
  for (const f of mod.deadNames) deadAll.push(mod.global + '.' + f);
const deadMine = deadAll.filter(n => OTHER_LANES.indexOf(n) < 0);

ok('RULE 1 — NOTHING ANYWHERE IS A DEFECT. An organ no line in this repo calls '
  + 'is dead code, and no exemption is possible for it. This is the check that '
  + 'would have caught tertius, overheardFrom and onwardFrom without anybody '
  + 'tripping over them first',
  deadMine.length === 0,
  deadMine.length ? 'orphaned: ' + deadMine.join(', ')
    + '  — wire it to the surface, or delete it' : '');

/* ---- RULE 2: off the surface needs a written reason --------------------- */
const undeclared = [];
for (const mod of modules)
  for (const f of mod.toolingNames) {
    const key = mod.global + '.' + f;
    if (!TOOLING_ONLY[key]) undeclared.push(key);
  }
ok('RULE 2 — OFF THE SURFACE NEEDS A WRITTEN REASON. A function only a gate or '
  + 'a tool touches is legitimate (a registry, a shape measurement) but it must '
  + 'SAY SO here, so "built for the machine" and "built and forgotten" stop '
  + 'looking identical',
  undeclared.length === 0,
  undeclared.length ? 'undeclared, add a reason or wire it: ' + undeclared.join(', ') : '');

/* ---- RULE 3: a stale exemption is also a defect -------------------------- */
const reachedNow = [];
for (const key of Object.keys(TOOLING_ONLY)) {
  const [g, f] = key.split('.');
  const mod = modules.filter(x => x.global === g)[0];
  if (!mod) continue;
  if (mod.toolingNames.indexOf(f) < 0 && mod.deadNames.indexOf(f) < 0) reachedNow.push(key);
}
ok('RULE 3 — A STALE EXEMPTION IS A DEFECT TOO. A declared helper that has since '
  + 'been wired to the surface must be DELETED from the list. Without this the '
  + 'list only ever grows and stops meaning anything, which is how every '
  + 'allowlist in every codebase dies',
  reachedNow.length === 0,
  reachedNow.length ? 'no longer tooling-only, delete the entry: ' + reachedNow.join(', ') : '');

/* ---- RULE 4: an exemption for a function that does not exist is rot ------ */
const ghosts = [];
for (const key of Object.keys(TOOLING_ONLY)) {
  const [g] = key.split('.');
  if (!modules.filter(x => x.global === g)[0]) ghosts.push(key);
}
ok('RULE 4 — AN EXEMPTION FOR SOMETHING THAT NO LONGER EXISTS IS ROT. Renamed or '
  + 'deleted, the entry goes with it',
  ghosts.length === 0,
  ghosts.length ? 'names a module that is not swept: ' + ghosts.join(', ') : '');

/* ---- and every reason is a real sentence, not a name-drop ---------------- */
const thin = Object.keys(TOOLING_ONLY).filter(k =>
  String(TOOLING_ONLY[k]).trim().split(/\s+/).length < 8);
ok('…and every declared reason is an actual sentence rather than a shrug. '
  + 'REUSE-FIRST holds tools to the same bar for their reuse check, and for the '
  + 'same reason: a claim nobody can read is a claim nobody can check',
  thin.length === 0, thin.join(', '));

/* ---- the injected blind spot stays handled ------------------------------ */
const ties = modules.filter(x => x.global === 'BohemiaTies')[0];
ok('THE INJECTED BLIND SPOT IS STILL HANDLED. BohemiaTies is handed to whoHears '
  + 'as a VALUE, so a textual count cannot see its methods — the first sweep '
  + 'called the whole module dead and was completely wrong. If that flag ever '
  + 'stops being reported, this gate is lying about the same thing again',
  !!ties && ties.injected,
  JSON.stringify(ties || null));

/* ---- and it is reported, always ----------------------------------------- */
console.log('');
for (const mod of modules)
  console.log('  ' + mod.global.padEnd(20) + mod.fns + ' fns  |  surface ' + mod.surface
    + '  engine ' + mod.engine + '  tooling ' + mod.tooling + '  dead ' + mod.nothing
    + (mod.injected ? '   [injected]' : ''));
if (deadAll.length) {
  console.log('');
  for (const n of deadAll)
    console.log('  DEAD: ' + n + (OTHER_LANES.indexOf(n) >= 0
      ? '   (another lane owns this — reported, not failed)' : ''));
}

console.log('\nORGAN REACH GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
