/* BOHEMIA SURFACE TRUTH GATE (8/4/26) — a document that measures the game must
 * say WHICH DOOR IT IS LOOKING AT.
 *
 * THE MOST EXPENSIVE RECURRING BUG IN THIS REPO, three times in one day:
 *
 *   8/2  the identity card, the ask, the name over their head — all built, all
 *        gated green, all on slices/BOHEMIA_RUN_CURRENT.html, which the RUN tab
 *        does not show. Paolo: "I couldn't find them."
 *   8/4  nineteen gates read the city by hunting a constant that had moved, and
 *        touch_guard_gate answered a missing payload with `continue` — a GREEN
 *        gate that was checking nothing.
 *   8/4  I told Paolo a walk fix would stop neighbours freezing in the RUN tab.
 *        Measured after: makeSim( is DEFINED in the city frame and CALLED ZERO
 *        TIMES. The fix is real, it is live in the run slice, and the run slice
 *        is the file he cannot see.
 *
 * Every one of those is the same shape: A CHECK POINTED AT THE WRONG DOOR. It
 * never announces itself, because pointing at the wrong door produces confident
 * green, not red — which is why finding them one at a time has not worked.
 *
 * WHAT THIS GATE DOES, AND WHAT IT DELIBERATELY DOES NOT.
 *
 * It does NOT demand that the measured surface equal the shown surface. Which
 * file the run lives in is a real design decision with real consequences and it
 * belongs to the RUN lane, not to a gate and not to me. A gate that forced that
 * answer would be a gate outranking a ruling (Paolo 8/1).
 *
 * It demands HONESTY: the integration ledger must DECLARE which file its probes
 * read and which file the RUN tab actually shows, both must be true, and if they
 * differ the document must say so where a reader cannot miss it. The mismatch is
 * allowed. Being quiet about it is not.
 *
 * THE SHOWN SURFACE IS DERIVED, NEVER TYPED. It is read out of the alpha's own
 * routing line and its own frame src, so if somebody re-points the RUN tab this
 * gate follows them and the ledger's declaration goes stale loudly.
 *
 *   node gates/surface_truth_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const LEDGER_PATH = 'records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md';
const ALPHA_PATH = 'slices/BOHEMIA_ALPHA_0_9.html';

ok('the integration ledger is on disk', fs.existsSync(LEDGER_PATH));
ok('the alpha is on disk', fs.existsSync(ALPHA_PATH));
if (!fs.existsSync(LEDGER_PATH) || !fs.existsSync(ALPHA_PATH)) {
  console.log('SURFACE TRUTH GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}
const ledger = fs.readFileSync(LEDGER_PATH, 'utf8');
const alpha = fs.readFileSync(ALPHA_PATH, 'utf8');

/* ---- 1. WHAT THE RUN TAB REALLY SHOWS, derived from the alpha ------------- */
/* the tab handler maps a tab id to a panel; RUN has been routed to the city
   panel since 7/28. Read the routing rather than trusting anybody's memory. */
const route = /var PANEL\s*=\s*\(t\.dataset\.p===['"]run['"]\)\s*\?\s*['"](\w+)['"]\s*:/.exec(alpha);
ok('the alpha states where the RUN tab routes (one readable line)', !!route);
const panel = route ? route[1] : null;

/* the panel's frame src — again read, not assumed */
const SRC_OF = {
  city: /CITY_SRC\s*=\s*['"]([^'"]+)['"]/,
  run: /<iframe[^>]*id="runFrame"[^>]*src="([^"]+)"/,
};
let shown = null;
if (panel === 'city') {
  const m = SRC_OF.city.exec(alpha);
  shown = m ? 'slices/' + m[1] : null;
} else if (panel === 'run') {
  const m = SRC_OF.run.exec(alpha);
  shown = m ? 'slices/' + m[1] : null;
}
ok('the file the RUN tab shows is derivable from the alpha (got ' + shown + ')', !!shown);
ok('and that file really exists on disk', !!shown && fs.existsSync(shown));

/* ---- 2. THE LEDGER MUST DECLARE BOTH DOORS -------------------------------- */
const decl = t => {
  const m = new RegExp('<!--\\s*' + t + ':\\s*([^\\s>]+)\\s*-->').exec(ledger);
  return m ? m[1] : null;
};
const measured = decl('SURFACE-MEASURED');
const declaredShown = decl('SURFACE-SHOWN');
ok('the ledger DECLARES which file its probes read (SURFACE-MEASURED)', !!measured);
ok('the ledger DECLARES which file the RUN tab shows (SURFACE-SHOWN)', !!declaredShown);
ok('the declared measured file exists (' + measured + ')', !!measured && fs.existsSync(measured));
ok('the declared shown file is the one the alpha really shows (declared ' + declaredShown +
   ', derived ' + shown + ')', !!shown && declaredShown === shown);

/* the declaration must not be decoration: the probes really do read that file */
const gateSrc = fs.existsSync('gates/integration_gate.js')
  ? fs.readFileSync('gates/integration_gate.js', 'utf8') : '';
ok('the gate that runs the ledger really reads the file the ledger declares',
  !!measured && gateSrc.indexOf(measured.replace('slices/', '')) >= 0);

/* ---- 3. IF THE DOORS DIFFER, THE DOCUMENT MUST SAY SO, LOUDLY ------------- */
/* A mismatch is legal - it is the RUN lane's call. Silence about it is not. The
   warning has to sit ABOVE the table, because a reader who has already read the
   greens has been misled by the time a footnote reaches them. */
if (measured && declaredShown && measured !== declaredShown) {
  const tableAt = ledger.indexOf('| system | status | probe |');
  const warnAt = ledger.search(/^>.*(?:TWO DIFFERENT FILES|does not display|not evidence about the surface)/mi);
  ok('the doors differ, so the ledger carries a visible warning about it', warnAt >= 0);
  ok('and the warning sits ABOVE the table, where it cannot be read too late',
    warnAt >= 0 && tableAt >= 0 && warnAt < tableAt);
  ok('the warning names BOTH files by path, so nobody has to guess which is which',
    ledger.indexOf(measured) >= 0 && ledger.indexOf(declaredShown) >= 0);
  /* A CITATION IS A CLAIM THE MACHINE CAN CHECK, never a name-drop (QUEST STUDY
     LAW, generalised). The warning asserts that the RUN tab routes to another
     panel; it must quote the alpha's OWN routing line so a reader can verify it
     instead of trusting me — and so this goes loudly stale the day somebody
     re-points the tab, which is precisely when the declaration stops being true.
     (The first version of this claim grepped for the phrase "rows are lies" to
     police tone, and matched it inside my own sentence saying the rows are NOT
     lies. A checker that cannot tell a mention from a use is the broken one —
     Paolo 8/1. Fix the ruler, never the target.) */
  const norm = s => s.replace(/\s+/g, ' ').trim();
  ok('the warning QUOTES the alpha\'s own routing line, so the claim is checkable ' +
     'and goes stale the day the tab is re-pointed',
    !!route && norm(ledger).indexOf(norm(route[0])) >= 0);
} else {
  ok('the measured and shown surfaces agree, so no warning is owed', true);
}

/* ---- 4. THE THING THAT MADE ME WRONG, KEPT AS A CLAIM --------------------- */
/* Not "the sim must run in the city" - that is a design call and not mine. Just:
   whatever the ledger says about the agent simulation must be checkable against
   the shown surface, so nobody repeats my mistake of reading a green about one
   file and describing the other one to Paolo. */
if (shown && fs.existsSync(shown)) {
  const shownSrc = fs.readFileSync(shown, 'utf8');
  const defines = /function makeSim\s*\(/.test(shownSrc);
  const calls = (shownSrc.match(/(?<!function )makeSim\s*\(/g) || []).length;
  const stepped = defines && calls > 0;
  const claimsSim = /\|\s*neighbours \(agents[^|]*\|\s*INTEGRATED/.test(ledger);
  ok('the shown surface\'s agent-sim state is measurable (defined ' + defines +
     ', call sites ' + calls + ')', defines === true || defines === false);
  ok('the ledger marks the agent sim INTEGRATED and it is ' +
     (stepped ? 'really stepped on the shown surface' :
       'NOT stepped there — so the ledger must say so in words') ,
    !claimsSim || stepped || /called zero times/i.test(ledger));
}

console.log('SURFACE TRUTH GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
