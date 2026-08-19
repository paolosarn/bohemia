/* ============================================================================
   SUITE HONESTY GATE (8/19/26) — AN UNRUN GATE HELD NOTHING, AND THE RUN HAS TO
   SAY SO.

   Law: laws/BOHEMIA_ADDENDUM_A_SUITE_THAT_CANNOT_FINISH_8_19_26.md

   WHY. A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED makes the suite the net and
   "green or it does not ship" the rule. On 8/19 the WORLD lane measured that the
   suite RAN 217 OF 382 GATES AND WAS KILLED BY THE CLOCK, and this lane hit the
   same wall twice in one session. So every lane was shipping on a PARTIAL run
   and could not tell which part it missed.

   SILENCE ABOUT AN UNRUN GATE READS EXACTLY LIKE GREEN. That is the whole bug,
   and it is a bug in the RUNNER, not in any gate: the run trailed off mid-table
   when the container killed it, and the last thing on screen was a pass.

   THE ROOT CAUSE, MEASURED: the per-gate cap was 1800s and TOOLS RUN spends all
   of it (bohemia_district_hero_factory.py takes 31 minutes), so ONE gate ate
   thirty of the ~fifty minutes a container survives. The verdict is identical
   either way — a timeout is a failure — so the extra 23 minutes bought nothing
   except the last third of the table never running.

   THIS GATE CANNOT JUST READ THE SOURCE. It RUNS the runner in a child process
   with a tiny budget and reads what it actually prints and what it actually
   exits with, because "the code has an unrun list" and "the run says so" are
   different facts — the same distinction that cost this lane three days on the
   wall.

   node gates/suite_honesty_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.dirname(__dirname);
const RUNNER = path.join(ROOT, 'gates/bohemia_gates.py');

let pass = 0, fail = 0;
function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}

/* run the runner itself, with a budget small enough that it must stop early. */
function runSuite(env, args) {
  const r = spawnSync('python3', [RUNNER].concat(args || []), {
    cwd: ROOT, encoding: 'utf8', timeout: 300000,   /* ms, not seconds */
    env: Object.assign({}, process.env, env || {})
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

console.log('SUITE HONESTY GATE — an unrun gate held nothing, and the run says so\n');

const src = fs.readFileSync(RUNNER, 'utf8');

/* ---- 1. THE CAP IS SANE, AND IT IS THE THING THAT BROKE THE SUITE ---------- */
const cap = (src.match(/GATE_CAP\s*=\s*int\(os\.environ\.get\('BOHEMIA_GATE_CAP',\s*'(\d+)'\)\)/) || [])[1];
ok('A1 the per-gate cap is declared and is at most ten minutes — a gate that '
  + 'cannot answer in that long is broken as a ship gate whether it would pass '
  + 'or not, because every ship in this repo waits behind it',
  !!cap && Number(cap) <= 600, 'cap = ' + cap
  + 's (it was 1800, and TOOLS RUN spent all of it on a 31-minute art factory)');

ok('A2 …and it is not hard-coded — a lane on a slower box can raise it without '
  + 'editing the runner',
  /BOHEMIA_GATE_CAP/.test(src) && /BOHEMIA_SUITE_BUDGET/.test(src));

/* ---- 2. AN UNFINISHED RUN SAYS SO, BY NAME, AND FAILS ---------------------- */
/* --dry-run WALKS THE TABLE AND EXECUTES NOTHING, so this exercises the real
   accounting without a second suite rebuilding slices under the first one --
   and without weakening ONE SUITE AT A TIME (7/30), which still holds for every
   run that actually runs something. */
const short = runSuite({ BOHEMIA_SUITE_BUDGET: '0' }, ['--dry-run']);
ok('A3 A RUN THAT CANNOT FINISH STOPS ITSELF WHILE IT CAN STILL SPEAK, rather '
  + 'than being killed mid-sentence by the container',
  /NEVER RAN/.test(short.out), short.out.slice(-200));

ok('A4 …and it says NOT GREEN AND NOT RED: UNFINISHED, because an unrun gate '
  + 'has held nothing and silence about it reads exactly like a pass',
  /NOT GREEN AND NOT RED: UNFINISHED/.test(short.out));

ok('A5 …and it NAMES the gates that never ran, so the lane knows what it is '
  + 'missing instead of guessing from where the output stopped',
  /\bPURITY\b/.test(short.out) && /\bLEAF PIXEL\b/.test(short.out),
  'the last rows of the table must appear in the unrun list');

ok('A6 …and it EXITS NON-ZERO. An unfinished run is not a pass, and anything '
  + 'reading the exit code has to see that',
  short.code === 1, 'exit code ' + short.code);

ok('A7 …and it never claims ALL GATES GREEN on a run that did not finish',
  !/ALL \d+ GATES GREEN/.test(short.out));

/* ---- 3. A FILTERED RUN IS HONEST ABOUT BEING FILTERED ---------------------- */
const only = runSuite({}, ['--dry-run', '--only', 'CARD FOLD']);
ok('A8 --only runs just the named gates, so a lane can use the runner (and its '
  + 'lock, deps check and table check) instead of calling gates by hand',
  /CARD FOLD/.test(only.out) && only.code === 0, only.out.slice(-260));

ok('A9 …and a filtered run NEVER says ALL GATES GREEN — it says how many of how '
  + 'many, and that the rest held nothing. Same lie as silence, smaller',
  /of \d+ GATE\(S\) GREEN/.test(only.out)
  && /THE REST DID NOT RUN AND HELD NOTHING/.test(only.out)
  && !/ALL \d+ GATES GREEN/.test(only.out),
  only.out.split('\n').slice(-2).join(' | '));

/* ---- 4. A TIMED-OUT GATE ACTUALLY STOPS, INCLUDING WHAT IT SPAWNED --------- */
/* MEASURED 8/19 AND IT IS WHY THE SUITE WAS SLOWER THAN THE SUM OF ITS PARTS:
   subprocess.run(timeout=) kills the CHILD it started and nothing else. TOOLS RUN
   spawns bohemia_district_hero_factory.py, so when the gate hit its cap the
   FACTORY KEPT RUNNING -- caught at FORTY-FIVE MINUTES, long after the gate that
   started it was declared timed out, burning a core alongside every gate that ran
   after it. Every timing downstream of a timeout was inflated by a process nobody
   could see. Proven both ways before this claim was written: the old code leaves
   the grandchild alive, the group kill reaps it. */
{
  const dir = fs.mkdtempSync(path.join(require('os').tmpdir(), 'bohgk-'));
  const gc = path.join(dir, 'gcproc.py');
  const par = path.join(dir, 'parproc.py');
  fs.writeFileSync(gc, 'import time\nwhile True: time.sleep(1)\n');
  fs.writeFileSync(par, 'import subprocess, time\n'
    + 'subprocess.Popen(["python3", ' + JSON.stringify(gc) + '])\n'
    + 'time.sleep(300)\n');
  const probe = path.join(dir, 'probe.py');
  fs.writeFileSync(probe,
    'import sys, os, time, subprocess, importlib.util\n'
    + 'os.environ["BOHEMIA_GATE_CAP"]="3"\n'
    + 'spec=importlib.util.spec_from_file_location("bg", ' + JSON.stringify(RUNNER) + ')\n'
    + 'm=importlib.util.module_from_spec(spec); sys.argv=["x"]; spec.loader.exec_module(m)\n'
    + 'def n():\n'
    + '    r=subprocess.run(["pgrep","-f",' + JSON.stringify(gc) + '],capture_output=True,text=True)\n'
    + '    return len([x for x in r.stdout.split() if x.strip()])\n'
    + 'rc,out = m.run(["python3", ' + JSON.stringify(par) + '])\n'
    + 'time.sleep(1.5)\n'
    + 'print("RC=%s LEFT=%d" % (rc, n()))\n');
  let res = '';
  try {
    res = execFileSync('python3', [probe], { cwd: ROOT, encoding: 'utf8', timeout: 120000 });
  } catch (e) { res = String((e.stdout || '') + (e.stderr || '')); }
  const m = res.match(/RC=(\d+) LEFT=(\d+)/);
  ok('A11 A TIMED-OUT GATE ACTUALLY STOPS, INCLUDING ANYTHING IT SPAWNED. '
    + 'subprocess.run kills only its direct child, so a grandchild outlives the '
    + 'gate that started it — measured at 45 minutes, burning a core beside every '
    + 'gate that ran after it and inflating every timing downstream',
    !!m && m[1] === '124' && m[2] === '0',
    res.trim() || 'probe produced nothing');
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_e) {}
}

/* ---- 5. EVERY LINE SAYS WHERE IT IS ---------------------------------------- */
ok('A10 every gate line carries its position in the table, so a killed run\'s '
  + 'last line tells you exactly how far it got',
  /\[\s*\d+\/\s*\d+\]/.test(only.out), only.out.split('\n').filter(l => /CARD FOLD/.test(l))[0]);

console.log('\nSUITE HONESTY GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
