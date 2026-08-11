/* BOHEMIA INLINED-FRESH GATE (8/11/26, WORLD lane) --------------------------
 * THE APP CARRIES COPIES, AND A COPY GOES STALE WITHOUT A WORD.
 *
 * WHAT HAPPENED, 8/11, and it cost a whole shipping round:
 *   I edited engine/bohemia_dead.js to give Paolo the clustered dead he ruled
 *   for. I re-ran tools/bohemia_city_dead_patch.py. It printed "the dead are
 *   already wired into the walked world. no-op." and exited 0. Every _patch.py
 *   in tools/ is ONE-SHOT: it looks for its own marker and never touches the
 *   body again. So the engine file was right, dead_gate.js was 48/0 GREEN, and
 *   the world page Paolo actually walks was a build behind. A live probe of the
 *   cemetery cell returned 4 bodies where the engine said 34.
 *
 * THE GATE READ THE ENGINE FILE, NOT THE APP. That is the whole failure, and it
 * is VERIFY ON THE REAL SURFACE (7/18) biting a lane for the fifth time. There
 * is no defence in "my gate was green"; a gate on a file nobody ships is a gate
 * on nothing.
 *
 * tools/bohemia_city_module_resync.py has been able to detect this since 7/26.
 * NOTHING IN THE SUITE EVER RAN IT. A law without a machine gate is not
 * enforced, and neither is a tool. This is that gate: the suite now asks the
 * resync tool, every run, whether any of the ~43 inlined modules has drifted
 * from its engine canon. If one has, this goes RED and names it.
 *
 * WHY IT DELEGATES INSTEAD OF RE-IMPLEMENTING: the resync tool finds the body
 * the app carries by walking git history back until it finds the revision that
 * matches, precisely because the module sources contain comment banners that
 * would fool any boundary scan. Re-deriving that here would be a second, worse
 * ruler for the same measurement -- and this repo has already been burned by a
 * gate that re-derived what the module already knew (the 51 invented scatter
 * violations, 8/9). ONE RULER. The tool owns the measurement; the gate owns
 * whether the answer is allowed to ship.
 *
 *   node gates/inlined_fresh_gate.js
 * ------------------------------------------------------------------------- */
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (label, cond, extra) => {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; console.log('  FAIL ' + label + (extra ? '\n         ' + extra : '')); }
};

console.log('INLINED-FRESH GATE — the app carries copies; are they the canon body?');

let out = '', ran = false, code = 0;
try {
  out = execFileSync('python3', [path.join(ROOT, 'tools', 'bohemia_city_module_resync.py'), '--check'],
                     { cwd: ROOT, encoding: 'utf8', timeout: 180000 });
  ran = true;
} catch (e) {
  /* the tool exits 1 when it finds staleness. That is a RESULT, not a crash --
     read its output. Only a missing tool or a real throw is a broken ruler. */
  out = String((e.stdout || '') + (e.stderr || ''));
  code = e.status;
  ran = /RESYNC:/.test(out);
}

ok('the resync tool ran and reported (it is the only ruler for this)', ran,
   ran ? '' : 'tools/bohemia_city_module_resync.py did not report. exit=' + code + '\n         ' + out.slice(0, 300));

if (ran) {
  const m = out.match(/(\d+)\s+embedded,\s+(\d+)\s+already fresh/);
  const embedded = m ? +m[1] : 0;
  const fresh = m ? +m[2] : -1;
  const stale = out.split('\n').filter(l => /^\s*STALE:/.test(l)).map(l => l.trim().replace(/^STALE:\s*/, ''));

  ok('the app announces the modules it inlined (found ' + embedded + ')', embedded >= 20,
     'fewer than 20 inlined modules found — the banner format changed and this gate is now blind');

  /* THE ONE THAT MATTERS. Everything above is the gate checking its own eyesight. */
  ok('EVERY INLINED MODULE IS ITS ENGINE CANON, byte for byte (' + fresh + '/' + embedded + ' fresh)',
     stale.length === 0,
     stale.length
       ? 'STALE, so the engine file and the surface Paolo taps disagree:\n         - ' +
         stale.join('\n         - ') +
         '\n         FIX: python3 tools/bohemia_city_module_resync.py\n' +
         '         WHY THIS IS RED AND NOT A WARNING: a gate that reads engine/ is green\n' +
         '         while the shipped page runs last week\'s code. That is a FALSE GREEN,\n' +
         '         which this repo ranks as worse than a false red.'
       : '');
}

console.log('\nINLINED-FRESH GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
