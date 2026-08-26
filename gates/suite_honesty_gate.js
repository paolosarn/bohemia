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

/* ---- 5. SHARDING COVERS THE TABLE EXACTLY ONCE ----------------------------- */
/* THE SUITE IS BIGGER THAN A CONTAINER'S LIFETIME AND THAT IS NOT GOING TO STOP
   BEING TRUE. Measured 8/19: 236 gates in 2748s (~11.6s a gate), so all 386 need
   about 75 minutes and a container survives about 50. Trimming one slow gate
   cannot close a 25-minute gap — TOOLS RUN's whole 600s is only a third of it.
   Two shards each finish comfortably and together cover the table EXACTLY ONCE.

   THE CLAIM THAT MATTERS IS COVERAGE, NOT SPEED. A sharding scheme that drops or
   double-runs a gate is worse than no sharding, because it looks like a complete
   answer. So this counts the union and the multiplicity rather than trusting the
   arithmetic. */
{
  function gatesIn(args) {
    const r = runSuite({}, ['--dry-run'].concat(args));
    const out = new Set();
    for (const line of r.out.split('\n')) {
      const m = line.match(/^\s*\[\s*(\d+)\/\s*(\d+)\]/);
      if (m) out.add(Number(m[1]));
    }
    return { set: out, code: r.code, raw: r.out };
  }
  const full = gatesIn([]);
  const s1 = gatesIn(['--shard', '1/2']);
  const s2 = gatesIn(['--shard', '2/2']);
  const union = new Set([...s1.set, ...s2.set]);
  const overlap = [...s1.set].filter(x => s2.set.has(x));

  ok('A12 two shards cover the WHOLE table — nothing is dropped, which is the '
    + 'failure that would matter because a sharding scheme that loses a gate '
    + 'still looks like a complete answer',
    union.size === full.set.size && full.set.size > 0
      && [...full.set].every(x => union.has(x)),
    'full=' + full.set.size + ' union=' + union.size);

  ok('A13 …and NOTHING RUNS TWICE, so two shards are one pass and not one and a '
    + 'half',
    overlap.length === 0, 'overlap: ' + overlap.length);

  ok('A14 …and a sharded run says it is sharded rather than claiming ALL GATES '
    + 'GREEN — the other shard held nothing, same rule as an unrun gate',
    /SHARD 1 OF 2/.test(s1.raw) && !/ALL \d+ GATES GREEN/.test(s1.raw),
    s1.raw.split('\n').slice(-2).join(' | '));

  ok('A15 a malformed --shard refuses instead of silently running everything, '
    + 'because a typo that runs the wrong set quietly is the whole disease',
    runSuite({}, ['--dry-run', '--shard', '3/2']).code === 1
      && runSuite({}, ['--dry-run', '--shard', 'banana']).code === 1);
}

/* ---- 6. THE BOOKS BALANCE: ran + unrun == what this run OWNED --------------- */
/* THIS BUG SHIPPED INSIDE THE FIX FOR IT, AND A REAL SHARD RUN FOUND IT. The
   first unrun list took GATES[i:] wholesale, so `--shard 1/2` — which owns 193 of
   386 — stopped at its budget having run 162 and reported SIXTY-TWO unrun. It was
   counting the OTHER shard's gates as things it had failed to reach. Overstated
   two-to-one, and the named list held gates that were never that run's job.

   A NUMBER THAT READS LIKE A FACT AND IS NOT ONE is precisely the disease this
   whole gate exists to kill, so the accounting is now checked as arithmetic
   rather than as a shape: what a run RAN plus what it reports UNRUN must equal
   exactly what that run OWNED. */
{
  function counts(args, budget) {
    const r = runSuite({ BOHEMIA_SUITE_BUDGET: String(budget) }, ['--dry-run'].concat(args));
    const ran = (r.out.match(/^\s*\[/gm) || []).length;
    const m = r.out.match(/(\d+) GATE\(S\) NEVER RAN/);
    return { ran, unrun: m ? Number(m[1]) : 0 };
  }
  for (const args of [[], ['--shard', '1/2'], ['--shard', '2/2'], ['--only', 'GATE']]) {
    const owned = counts(args, 99999).ran;
    const cut = counts(args, 0);
    ok('A16 the books balance for `' + (args.join(' ') || 'a full run') + '` — it '
      + 'owned ' + owned + ', and ran + unrun must equal that. The first version '
      + 'counted the other shard\'s gates as ones it failed to reach and '
      + 'overstated by two to one',
      owned > 0 && cut.ran + cut.unrun === owned,
      JSON.stringify({ owned, ran: cut.ran, unrun: cut.unrun }));
  }
}

/* ---- 6b. THE BOX IS NOT OVERSUBSCRIBED, AND THIS MEASURES IT ---------------- */
/* THE COMMENT SAID ONE THING AND THE CODE DID ANOTHER, for as long as the
   parallel runner has existed. The runner's own words were "pure gates get all
   the cores and browsers get half" -- but a browser gate held ONLY the browser
   semaphore, so a four-core container ran JOBS pure PLUS BROWSER_JOBS browser
   at the same time: four and two, fifty percent oversubscribed, for exactly the
   gates that MEASURE TIME. The runner had even written down what that costs
   ("oversubscribe the box and they fail for LOAD rather than for truth") and
   then paid it anyway: FIGHT MUSIC and FIRST NIGHT both came up red in the run
   and green alone, and the confirm-alone pass bought a second full run of each
   to discover it.

   SO THIS CLAIM DOES NOT READ THE SOURCE. It hands the runner a trace file,
   runs real gates with a known cap, and computes the PEAK number that were ever
   inside the box at the same instant. A regex would have passed happily on the
   broken version -- the words were right, the nesting was not. */
{
  const os = require('os');
  const TRACE = path.join(os.tmpdir(), 'bohemia_suite_trace_' + process.pid + '.tsv');
  try { fs.unlinkSync(TRACE); } catch (e) { }
  /* cheap, pure, and there are more of them than there are slots, so the cap is
     the only thing that can hold the peak down */
  /* --dry-run, because this gate runs INSIDE the suite and ONE SUITE AT A TIME
     holds the lock -- a real nested run is refused by design, which is what the
     first version of this claim discovered by getting an empty trace. Dry is
     enough: the scheduler, the semaphores and the trace are the same code on
     both paths, and trace mode deliberately holds each slot so occupancy is
     observable rather than a coin flip. */
  const JOBS = 2;
  const r = runSuite({ BOHEMIA_SUITE_TRACE: TRACE, BOHEMIA_JOBS: String(JOBS), BOHEMIA_BROWSER_JOBS: '1' },
    ['--dry-run']);
  let peak = 0, cur = 0, rows = 0;
  try {
    const ev = fs.readFileSync(TRACE, 'utf8').trim().split('\n').filter(Boolean)
      .map(l => l.split('\t')).map(c => ({ ev: c[0], t: Number(c[1]) }))
      .sort((a, b) => a.t - b.t || (a.ev === 'OUT' ? -1 : 1));
    rows = ev.length;
    for (const e of ev) { cur += (e.ev === 'IN' ? 1 : -1); if (cur > peak) peak = cur; }
  } catch (e) { rows = 0; }
  try { fs.unlinkSync(TRACE); } catch (e) { }
  ok('A17 THE RUNNER TELLS THE TRUTH ABOUT HOW MANY GATES IT RUNS AT ONCE — '
    + 'measured by tracing real gates in and out of the box, never by reading '
    + 'the comment that was wrong for months',
    rows > 0 && peak > 0 && peak <= JOBS, JSON.stringify({ peak, cap: JOBS, rows, code: r.code }));
  /* and it must actually REACH the cap, or the measurement proves nothing: a
     runner that accidentally serialised everything would also report peak <= 2 */
  ok('A18 …and it really does run them in parallel, so A17 is a ceiling that was '
    + 'actually touched and not a suite that quietly went single-file',
    peak === JOBS, JSON.stringify({ peak, cap: JOBS }));
}

/* ---- 6c. RED MEANS RED, ALL THE WAY OUT TO THE EXIT CODE -------------------- */
/* THE SUITE EXITED 0 WITH NINETEEN CONFIRMED RED GATES. Measured on the 8/20
   sweep, in this repo, on a full run: "19 GATE(S) FAILED: ... EXIT=0". The
   exit code was `1 if (failed and strict) else 0` and --strict was OPT-IN, so
   anything reading the exit code -- a script, a CI step, a pre-ship check, an
   `&&` in a shell -- was told a nineteen-red suite had passed.

   AND IT WAS BACKWARDS AGAINST A6, four claims up this same file: an UNRUN gate
   already exits 1, because an unfinished run is not a pass. A gate that RAN AND
   FAILED exited 0. The weaker signal was taken more seriously than the stronger
   one. CLAUDE.md has said "green or it does not ship" the whole time.

   TESTED BY RUNNING THE SCHEDULER, not by reading the ternary: the probe imports
   the runner, replaces its table with two gates and its runner with one that
   always fails, and reads what _run_all RETURNS. It calls _run_all directly for
   the same reason A17 uses --dry-run -- this gate runs inside the suite, and
   ONE SUITE AT A TIME refuses a real nested run. */
{
  const os2 = require('os');
  const dir = fs.mkdtempSync(path.join(os2.tmpdir(), 'bohgx-'));
  const probe = path.join(dir, 'exitprobe.py');
  fs.writeFileSync(probe,
    'import sys, importlib.util, io, contextlib\n'
    + 'spec=importlib.util.spec_from_file_location("bg", ' + JSON.stringify(RUNNER) + ')\n'
    + 'm=importlib.util.module_from_spec(spec); sys.argv=["x"]; spec.loader.exec_module(m)\n'
    + 'm.GATES=[("ALWAYS RED",["true"],"a gate that fails",False),\n'
    + '         ("ALSO RED",["true"],"another that fails",False)]\n'
    + 'm.run=lambda argv: (1, "boom")\n'
    + 'buf=io.StringIO()\n'
    + 'with contextlib.redirect_stdout(buf): d=m._run_all(False, False)\n'
    + 'with contextlib.redirect_stdout(buf): l=m._run_all(False, False, lenient=True)\n'
    + 'with contextlib.redirect_stdout(buf): st=m._run_all(False, True)\n'
    + 'print("DEFAULT=%s LENIENT=%s STRICT=%s" % (d, l, st))\n');
  let res = '';
  try {
    res = execFileSync('python3', [probe], { cwd: ROOT, encoding: 'utf8', timeout: 180000 });
  } catch (e) { res = String((e.stdout || '') + (e.stderr || '')); }
  const m = res.match(/DEFAULT=(\d+) LENIENT=(\d+) STRICT=(\d+)/);
  ok('A19 A FAILING SUITE EXITS NON-ZERO BY DEFAULT — it exited 0 with nineteen '
    + 'confirmed reds on 8/20, while an UNRUN gate already exited 1, so the '
    + 'weaker signal was taken more seriously than the stronger one',
    !!m && m[1] === '1', res.trim() || 'probe produced nothing');
  ok('A19 …and --strict still means the same thing, so nothing that already '
    + 'typed it changes behaviour', !!m && m[3] === '1', res.trim());
  ok('A19 …and --lenient is the deliberate, typed way to ask for exit 0 anyway, '
    + 'because removing the escape hatch entirely is how people stop running the '
    + 'suite at all', !!m && m[2] === '0', res.trim());
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch (_e) { }
}

/* ---- 7. EVERY LINE SAYS WHERE IT IS ---------------------------------------- */
ok('A10 every gate line carries its position in the table, so a killed run\'s '
  + 'last line tells you exactly how far it got',
  /\[\s*\d+\/\s*\d+\]/.test(only.out), only.out.split('\n').filter(l => /CARD FOLD/.test(l))[0]);

/* ---- 8. A GATE THAT NEEDS THE RUN SLICE HAS TO ASK FOR IT ------------------
   RUN BEAT was a standing red on main from 8/21 to 8/25 and it was never a game
   defect. On 8/21 the alpha deliberately STOPPED downloading the 17.8 MB run
   slice on boot -- 17.8 MB fetched on every visit for a panel the shell never
   displays -- and exported `window.__loadRunSlice` instead. Its own comment
   states the contract: "nothing in the product calls this, and the four gates
   that need the frame live ask for it by name."

   RUN BEAT was the fifth. It waited for #runFrame to be ATTACHED, which it
   always is, then waited 30s for RB to appear inside a frame with no src, and
   reported "the browser run died". Four days of a red that named the run.

   THE CHECK IS THE CONTRACT, NOT A STYLE RULE. A gate that reaches into the
   alpha for the run frame is depending on a fetch that only it can start. It
   either asks by name or it is measuring an empty iframe -- there is no third
   outcome, which is what makes this mechanical.

   IT ONLY LOOKS AT GATES THAT TAKE THE FRAME FROM INSIDE THE ALPHA. A gate that
   opens slices/BOHEMIA_RUN_CURRENT.html as a PAGE (no_prison, wallclass) needs
   nothing, and a gate that picks its frame BY CAPABILITY and wants the CITY
   (demo_gate, which says so at length) is not asking for the run at all. The
   first sweep written for this flagged all three and it was the sweep that was
   wrong; the pattern below is the corrected one. */
{
  const RUNFRAME = /\$\('#runFrame'\)|querySelector\('#runFrame'\)|getElementById\(['"]runFrame|frames\(\)[\s\S]{0,80}RUN_CURRENT/;
  /* named, with the reason, so an exemption is a decision somebody wrote down
     rather than a gate quietly not being checked */
  const EXEMPT = {
    'demo_gate.js': 'picks its frame by capability and wants CITY_WORLD, not the run',
  };
  const offenders = [];
  let looked = 0;
  for (const f of fs.readdirSync(path.join(ROOT, 'gates')).sort()) {
    const fp = path.join(ROOT, 'gates', f);
    let src = '';
    try { if (fs.statSync(fp).isDirectory()) continue; src = fs.readFileSync(fp, 'utf8'); }
    catch (_e) { continue; }
    if (!RUNFRAME.test(src)) continue;
    if (EXEMPT[f]) continue;
    looked++;
    if (!src.includes('__loadRunSlice')) offenders.push(f);
  }
  ok('A20 EVERY GATE THAT TAKES THE RUN FRAME FROM INSIDE THE ALPHA ASKS FOR THE '
    + 'SLICE BY NAME. The alpha stopped fetching it on boot on 8/21 and exported '
    + '__loadRunSlice instead, so a gate that skips the call waits on an empty '
    + 'iframe and reports the RUN as broken -- which is exactly what RUN BEAT did '
    + 'for four days (' + looked + ' gate(s) checked)',
    offenders.length === 0, offenders.join(', '));
  ok('A20 …and this check is actually looking at something, rather than passing '
    + 'because its pattern stopped matching anything at all',
    looked >= 5, 'only ' + looked + ' gate(s) matched the run-frame pattern');
}

console.log('\nSUITE HONESTY GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
