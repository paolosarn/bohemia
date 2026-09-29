/* ============================================================================
   ONE DRIVER GATE -- THE DOOR IS ONE PROCEDURE, AND NO NEW CHECKER BUILDS ITS OWN
   (PLUMBER 9/29/26, row [one driver], rule 14(g): "there is one driver... every lane
   that walks the five minutes uses it or extends it"; the coordinator's row, 9/23:
   "make every gate that opens the alpha go through it")

   WHY. The door is the most-broken thing in this fleet's instruments. Five lanes in
   one round measured a covered surface (the splash over the game, the VOTE landing,
   a hidden frame, a one-pixel board). On 9/29 CITY DEEDS and CITY MEMORY were red on
   main for a reason that had nothing to do with their subject: each opened the alpha
   as a local file and clicked the RUN tab itself, the tab strip had moved, and the
   click timed out after 30 s. Moved onto the driver the same round, they reached the
   city for the first time since: DEEDS 36 passed (was 0), MEMORY 25 passed (was 0).

   MEASURED 9/29: 292 checkers in the suite open the alpha or the demo in a browser.
   Before this round 2 went through the driver and 290 built their own browser and
   door, 239 of them as a local file (which SOUNDS proved cannot see into the city
   frame, [real surface]). After moving DEEDS and MEMORY: 4 and 288. Moving 288
   checkers owned by twenty lanes is not one round's work, so this gate does the part
   that can be done at once and holds it:

     S1  the driver refuses an option it does not know, and a wait that is not a number
         (runtab: true was a wait of ONE millisecond; this lane's own tool did it)
     L1  every suite checker that opens the game in its own browser is on
         gates/one_driver_baseline.txt; a NEW one is refused by name. The list may only
         shrink. A checker that names the game but opens something else says so with
         the marker   one-driver: not the game   in a comment.
     L2  the ones already moved stay moved: a checker that uses the driver is never on
         the baseline (the list cannot quietly re-grow).
     NOTE the count, and how many of the baseline open the game as a local file.

   Static and fast (no browser; S1 is refused before any browser starts), so it runs
   before every push. Mutation-checked three ways 9/29: a checker missing from the list
   (L1 red), a moved checker back on the list (L2 red), the driver's wait check removed
   (S1 red). What it cannot see, stated: a checker that opens the game under a name
   other than the two page files.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = 'gates/one_driver_baseline.txt';

let pass = 0, fail = 0;
const ok = (n, c, why) => { if (c) { pass++; console.log('  ok   ' + n); }
  else { fail++; console.log('  FAIL ' + n + (why ? '\n         ' + why : '')); } };

/* who counts: a checker in the suite that starts a browser and names the alpha or the
   demo, and does not go through the driver */
function census() {
  const reg = fs.readFileSync(path.join(ROOT, 'gates/bohemia_gates.py'), 'utf8');
  const files = [...new Set((reg.match(/'((?:gates|tools)\/[A-Za-z0-9_.\/-]+\.(?:js|py|mjs))'/g) || [])
    .map(s => s.slice(1, -1)))].filter(f => fs.existsSync(path.join(ROOT, f)));
  const game = [], viaDriver = [], own = [], local = [];
  for (const f of files) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (!/playwright|chromium\.launch|puppeteer/.test(s)) continue;
    if (!/BOHEMIA_ALPHA_0_9|BOHEMIA_DEMO/.test(s)) continue;
    if (/one-driver:\s*not the game/.test(s)) continue;
    game.push(f);
    if (/bohemia_drive_the_demo/.test(s)) viaDriver.push(f);
    else { own.push(f); if (/file:\/\/|pathToFileURL/.test(s)) local.push(f); }
  }
  return { suite: files.length, game, viaDriver, own, local };
}

console.log('='.repeat(74));
console.log('ONE DRIVER: the door is one procedure, and no new checker builds its own');
console.log('='.repeat(74));

(async () => {
  /* ---- S1: the driver says no to what it cannot honour --------------------- */
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const says = async (opts) => { try { await open(opts); return null; } catch (e) { return String(e.message || e); } };
  const a = await says({ runtab: true });
  const b = await says({ runTab: 20000 });
  ok('S1 the driver refuses a wait that is not a number (runtab: true) and an option it does not know (runTab)',
     !!a && /MILLISECONDS/.test(a) && !!b && /does not understand/.test(b),
     'runtab:true -> ' + (a || 'NO THROW (it would have opened the game with a 1 ms wait)')
     + ' | runTab -> ' + (b || 'NO THROW'));

  /* ---- L1 / L2 ------------------------------------------------------------- */
  const c = census();
  const base = new Set(fs.readFileSync(path.join(ROOT, BASE), 'utf8').split('\n')
    .map(x => x.trim()).filter(x => x && !x.startsWith('#')));
  console.log('  (' + c.game.length + ' suite checkers open the game in a browser: ' + c.viaDriver.length
    + ' through the driver, ' + c.own.length + ' with their own browser and door, ' + c.local.length
    + ' of those as a local file)');
  const fresh = c.own.filter(f => !base.has(f));
  ok('L1 no NEW checker opens the game with its own browser (' + c.own.length + ' old ones on the baseline of '
     + base.size + ')', !fresh.length,
     fresh.map(f => f).join(', ') + '\n         Rule 14(g): open the game with tools/bohemia_drive_the_demo.js '
     + '(open({ alpha: true }) or open() for the demo): it knocks until the door is behind you, lands on '
     + 'RUN, and hands you the city frame. If this checker names the game but opens something else, put '
     + 'the words  one-driver: not the game  in a comment.');
  const back = c.viaDriver.filter(f => base.has(f));
  ok('L2 a checker that has moved onto the driver is not still on the baseline (' + c.viaDriver.length
     + ' use the driver)', !back.length, back.join(', ') + ' -- take these lines off ' + BASE);
  const gone = [...base].filter(f => !c.own.includes(f));
  if (gone.length) console.log('  NOTE: ' + gone.length + ' baseline line(s) no longer open the game on their own '
    + '(moved, retired or unregistered). Take them off ' + BASE + ' to lock it in: '
    + gone.slice(0, 5).join(', ') + (gone.length > 5 ? ' ...' : ''));

  console.log('\n=== ONE DRIVER GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('ONE DRIVER GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });

module.exports = { census };
