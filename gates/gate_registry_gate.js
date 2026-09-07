#!/usr/bin/env node
/*
 * GATE REGISTRY GATE -- A GATE THE SUITE CANNOT SEE IS A NAMED RED LINE.
 * (9/7/26, PLUMBER lane, VAMILY row [unregistered gates] SIX-GREEN-GATES-THE-SUITE-NEVER-RAN)
 *
 * WHAT LAW THIS ENFORCES: laws/BOHEMIA_LAW_A_GATE_THAT_NEVER_RUNS_IS_NOT_A_GATE_9_7_26.md,
 * rule 3 -- "Registration is derived, never hand-kept. The suite discovers gates
 * from the folder; a gate file that the suite cannot see is itself a red line,
 * with the file named."
 *
 * WHY IT EXISTS. PEOPLE asked the suite for its newest gate and got "0 of 542
 * GATES": not red, NOTHING. Then it swept its own history and found SIX shipped
 * jobs whose proof was a gate the suite had never run once. Each was marked
 * SHIPPED with "gate green", and green meant a human ran a file by hand.
 * That was one lane out of eighteen. This gate is the sweep, made permanent.
 *
 * THE DEFECT IS STRUCTURAL, NOT CARELESS. gates/bohemia_gates.py keeps a hand-
 * written table of ~555 rows. Adding a gate means adding a file AND editing that
 * table, and the second half is a one-shot human step, so it drifts -- which is
 * NOTHING IS BAKED ONCE (9/6) wearing different clothes again. A hand-kept
 * registry cannot be trusted to list itself; only the FOLDER can.
 *
 * WHAT MAKES IT RED:
 *   - a file named like a gate (*_gate.js / *_gate.py) that no registered row runs
 *   - a registered row pointing at a file that does not exist
 *   - the registry parsing to zero rows, or the folder holding zero gate files
 *     (the anti-silent-pass floor: this whole law is about a run that collects
 *     nothing and prints a check mark)
 *   - an entry in NOT_A_GATE that no longer exists, so the exemption list cannot
 *     quietly outlive the thing it excused
 *
 * THE EXEMPTIONS ARE NAMED, ONE BY ONE, WITH A REASON. gates/ also holds
 * libraries and instruments that are imported by gates rather than run as gates.
 * Skipping them by a pattern would let a real gate hide behind the pattern, so
 * every one is listed by name below and has to be justified when it is added.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const REGISTRY = path.join(ROOT, 'gates', 'bohemia_gates.py');

/* Files in gates/ that are NOT gates. Each says what it is instead. A name added
   here is a claim that nothing runs it as a check; the gate verifies each one
   still exists, so this list cannot rot into a blanket excuse. */
const NOT_A_GATE = {
  'bohemia_gates.py':        'the suite runner itself',
  'bohemia_phone_perf.js':   'library: the speed instrument, imported by FPS ON A PHONE and others',
  'bohemia_beat_profile.js': 'library: the beat profiler, imported by BEAT BUDGET',
  'bohemia_clock_rate.js':   'library: walks the city and reads its clock, imported by CLOCK RATE',
  'bohemia_build_size.js':   'library: the byte inventory, imported by BUILD SIZE',
  'bohemia_suite_census.py': 'library: the suite timing census, imported by SUITE FINISHES',
  'bohemia_fight_pixels.js': 'instrument: fingerprints the fight canvas across boots',
  'bohemia_pages_publish.js':'library: imported by PAGES PUBLISH',
  'bohemia_canon_index.py':  'tool: regenerates the canon index',
  'bohemia_block_fixture.js':'fixture: shared test data',
  'bohemia_city_app.js':     'harness: boots the walked city for other gates',
  'bohemia_city_app.py':     'harness: boots the walked city for other gates',
  'bohemia_webkit.js':       'harness: the webkit browser wrapper',
  'bohemia_settle.js':       'helper: waits for a page to go quiet',
  'cvd_faction_measure.js':  'instrument: colour-blindness measurement, read by hand',
  'ui_pixel_purple.py':      'instrument: samples purple on the UI, read by hand',
  'vista_definite_probe.js': 'probe: one-off measurement kept for its numbers',
};

let pass = 0, fail = 0;
const ok = (c, m, extra) => { if (c) { pass++; console.log('  ok   ' + m); }
  else { fail++; console.log('  FAIL ' + m + (extra ? '\n         ' + extra : '')); } };

function registeredPaths() {
  const src = fs.readFileSync(REGISTRY, 'utf8');
  const i = src.indexOf('GATES = [');
  if (i < 0) return { rows: [], paths: new Set(), why: 'no GATES table found in the registry' };
  const body = src.slice(i);
  /* one row is  ('NAME', ['python3', 'gates/x_gate.py'], ... */
  const rowRe = /^ {4}\('([^']+)',\s*(\[[^\]]*\])/gm;
  const rows = [];
  const paths = new Set();
  let m;
  while ((m = rowRe.exec(body)) !== null) {
    rows.push(m[1]);
    const cmd = m[2];
    const pRe = /'([^']*gates\/[^']+)'/g;
    let p;
    while ((p = pRe.exec(cmd)) !== null) paths.add(p[1]);
  }
  return { rows, paths };
}

const looksLikeAGate = f => /_gate\.(js|py)$/.test(f);

(function main() {
  console.log('\nEVERY GATE FILE, AGAINST WHAT THE SUITE ACTUALLY RUNS');

  const dir = path.join(ROOT, 'gates');
  const files = fs.readdirSync(dir).filter(f => /\.(js|py)$/.test(f)).sort();
  const { rows, paths, why } = registeredPaths();

  console.log('    gate files on disk        ' + files.length);
  console.log('    rows in the registry      ' + rows.length);
  console.log('    files those rows run      ' + paths.size);

  /* ---- the anti-silent-pass floors, before any other check ---------------
     This gate exists because a run that collects nothing printed a check mark.
     It may not do the same thing itself. */
  ok(files.length > 100, 'THE FOLDER WAS ACTUALLY READ (' + files.length + ' gate files, floor 100). '
     + 'A sweep of an empty folder agrees with an empty registry perfectly, and that is the exact '
     + 'shape of the bug this gate is here for');
  ok(rows.length > 100, 'THE REGISTRY WAS ACTUALLY PARSED (' + rows.length + ' rows, floor 100). '
     + (why || ''));
  ok(paths.size > 100, 'AND THE ROWS NAMED REAL COMMANDS (' + paths.size + ' distinct files run, '
     + 'floor 100). A regex that stopped matching leaves every file below looking like an orphan');

  /* ---- a registered row that points at nothing ---- */
  const missing = [...paths].filter(p => !fs.existsSync(path.join(ROOT, p))).sort();
  ok(missing.length === 0,
     'EVERY REGISTERED ROW POINTS AT A FILE THAT EXISTS. A row naming a deleted file is a gate '
     + 'that can never be green and never be red',
     missing.length ? missing.join('\n         ') : '');

  /* ---- the exemption list may not outlive what it excuses ---- */
  const staleExempt = Object.keys(NOT_A_GATE).filter(f => !files.includes(f)).sort();
  ok(staleExempt.length === 0,
     'EVERY NAME ON THE not-a-gate LIST STILL EXISTS. An exemption for a file nobody has any more '
     + 'is a hole waiting for a new file to fall into',
     staleExempt.length ? staleExempt.join(', ') : '');

  /* ---- THE LAW ITSELF: a gate the suite cannot see ---- */
  const orphans = files.filter(f => looksLikeAGate(f)
                                 && !paths.has('gates/' + f)
                                 && !NOT_A_GATE[f]).sort();
  if (orphans.length) {
    console.log('\n    GATES THE SUITE NEVER RUNS:');
    for (const f of orphans) console.log('      ' + f);
  }
  ok(orphans.length === 0,
     'EVERY FILE NAMED LIKE A GATE IS RUN BY THE SUITE. A gate that exists, passes when a person '
     + 'runs it by hand, and is never run by the suite is a law without a gate wearing a gate\'s '
     + 'clothes -- and it is cited as proof on SHIPPED lines',
     orphans.length ? orphans.length + ' orphan(s): ' + orphans.join(', ') : '');

  /* ---- and the files that are in gates/ but are not gates, reported ---- */
  const others = files.filter(f => !looksLikeAGate(f) && !paths.has('gates/' + f) && !NOT_A_GATE[f]).sort();
  if (others.length) {
    console.log('\n    IN gates/ BUT NEITHER RUN NOR NAMED A GATE (not asserted, reported so the '
      + 'list stays deliberate):');
    for (const f of others) console.log('      ' + f);
  }

  console.log('\n=== GATE REGISTRY GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (!fail) console.log('    Every gate file in the folder is a gate the suite runs.');
  process.exit(fail ? 1 : 0);
})();
