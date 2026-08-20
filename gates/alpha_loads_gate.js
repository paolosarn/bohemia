const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
// BOHEMIA — ALPHA LOADS GATE (7/30/26). FACTORY LAW: new law, new gate, same turn.
//
// WHY THIS EXISTS. On 7/30 the ONE alpha went to main COMPLETELY DEAD. Every
// tab, every system, the whole game: `Unexpected token '<'` on load, nothing
// defined, black screen. It stayed that way on the live site.
//
// WHAT HAPPENED, exactly. A ship rebased onto a main that had moved 161
// commits. The conflict resolution in slices/BOHEMIA_ALPHA_0_9.html DELETED
// three of the largest embedded blocks in the file --
//     const RIG_B64     (127,857 chars — the rig tool)
//     const COMBAT_B64  (1,109,816 chars — the combat slice)
//     const BAKED       ( 30,339 chars — PAOLO'S PAINTED RIG PACKAGE)
// -- and dropped a stray `<div id="buildstamp">` into the <script> body where
// they used to be. Raw HTML inside JavaScript is a syntax error, so the entire
// game script failed to parse. BAKED is the single most sacred asset in the
// repo (RIG LAW: Paolo's painted regions are sacrosanct) and a merge ate it.
//
// THE PROCESS FAILURE, named so it is not repeated. The full suite HAD run
// green -- BEFORE the rebase. ONE GATE PASS PER SHIP says that when main has
// moved you rebase and re-run; main moved 161 commits and the suite was not
// re-run, because the earlier green felt like it still counted. It did not.
// A green from before a rebase describes a tree that no longer exists.
//
// WHY A GATE AND NOT JUST A RESOLUTION TO BE CAREFUL. The existing suite would
// have caught this -- many gates load the alpha and watch pageerror. But the
// suite is ~340s, which is exactly why it got skipped under time pressure.
// This gate is the CHEAP one: it loads the alpha once and asserts it is alive.
// It is meant to be affordable enough that there is never a reason to skip it,
// including immediately before a push. A guard you skip is not a guard.
//
// It checks the failure mode directly, not a proxy for it:
//   1. the page raises ZERO errors and the game's globals actually exist
//   2. the big embedded blocks are present AND still their real size
//      (a truncated block is a silent art loss, not a crash)
//   3. exactly ONE buildstamp div, and no HTML tag loose in the script body
//   4. no conflict markers survived a merge
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const LAW = path.join(ROOT, 'laws', 'BOHEMIA_ADDENDUM_THE_ALPHA_MUST_LOAD_7_30_26.md');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== ALPHA LOADS GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
ok('the law is recorded', fs.existsSync(LAW));
if (f) done();
const src = fs.readFileSync(ALPHA, 'utf8');

/* ---- 2. THE EMBEDDED BLOCKS ARE PRESENT AND FULL SIZE ------------------- */
/* Sizes are floors well under the real values, so legitimate edits pass and a
   deletion or truncation cannot. These three are what the bad merge ate. */
const BLOCKS = [
  /* 2X RE-BLESS (8/20): once the rig is flipped the literal is WRAPPED --
     `const BAKED=RIG2X({...})` -- so an anchored `const BAKED={` matched nothing and
     this reported his rig as MISSING on a build where it is present and doubled.
     The regex accepts either form, because the claim is "the rig package is here and
     is not truncated", not "it is spelled the way it was in August".
     NOTHING IS WEAKENED: the 25,000-char floor is unchanged and still measures the
     literal itself, and the runtime checks below still require BAKED to be defined
     with all 8 facings. */
  ['BAKED',      /^const BAKED\s*=\s*(?:RIG2X\()?\{.*$/m,  25000, "Paolo's painted rig package (RIG LAW)"],
  ['RIG_B64',    /^const RIG_B64='[^']+';?$/m,  100000, 'the embedded rig tool'],
  ['COMBAT_B64', /^const COMBAT_B64='[^']+';?$/m, 900000, 'the embedded combat slice'],
];
for (const [name, re, floor, what] of BLOCKS) {
  const m = src.match(re);
  ok(`${name} is present -- ${what}`, !!m);
  ok(`${name} is full size (>= ${floor} chars), not truncated by a merge`,
    !!m && m[0].length >= floor);
}

/* ---- 3. NO LOOSE HTML IN THE SCRIPT BODY, ONE BUILDSTAMP ---------------- */
/* The stray `<div id="buildstamp">` landed inside <script>, which is what
   actually threw. A tag at the start of a line inside the script body is the
   signature of a merge dropping markup where code belongs. */
const stampDivs = (src.match(/<div id="buildstamp"/g) || []).length;
ok('there is exactly ONE buildstamp div (the merge left two)', stampDivs === 1);

const scriptBodies = [...src.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
ok('the alpha has script bodies to check', scriptBodies.length > 0);
let loose = null;
for (const body of scriptBodies) {
  const m = body.match(/^\s*<(div|span|canvas|p|section)\b[^>]*>/m);
  if (m) { loose = m[0].trim().slice(0, 60); break; }
}
ok('no loose HTML tag sits in a script body (this is what threw on 7/30)'
  + (loose ? ' -- found: ' + loose : ''), !loose);

/* ---- 4. NO CONFLICT MARKERS -------------------------------------------- */
/* Shipped to main once already on 7/29; this keeps it dead. */
ok('no merge conflict markers survived',
  !/^<{7} /m.test(src) && !/^>{7} /m.test(src) && !/^={7}$/m.test(src));

/* ---- THE RECORD -------------------------------------------------------- */
const law = fs.readFileSync(LAW, 'utf8');
const flat = law.replace(/\s+/g, ' ');   /* the law is wrapped; match the prose, not the wrapping */
ok('the law records that a pre-rebase green does not transfer',
  /no longer exists/i.test(flat) && /rebase/i.test(flat));
ok('the law records the three blocks the merge deleted',
  /RIG_B64/.test(flat) && /COMBAT_B64/.test(flat) && /BAKED/.test(flat));
ok('the law records that the cheapness IS the point (a guard you skip is not a guard)',
  /A guard you skip is not a guard/.test(flat));

/* ---- 1. IT ACTUALLY LOADS. THE ONLY CHECK THAT IS NOT A PROXY. ---------- */
/* VERIFY ON THE REAL SURFACE (7/18): the file parsing in my head is not the
   file parsing in a browser. And per the 7/27 outline post-mortem, a load-time
   hang is a page error until proven otherwise -- so pageerror is captured
   FIRST, before anything waits on anything. */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available to load the real surface', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2500);
  const alive = await pg.evaluate(() => ({
    BAKED: typeof BAKED !== 'undefined',
    drawChar: typeof drawChar !== 'undefined',
    MUS: typeof MUS !== 'undefined',
    dirs: (typeof BAKED !== 'undefined' && BAKED.pose) ? Object.keys(BAKED.pose).length : 0,
  }));
  await b.close();

  ok('the alpha loads with ZERO page errors' + (errs.length ? ' -- first: ' + errs[0] : ''),
    errs.length === 0);
  ok('BAKED is defined at runtime (the rig package survived)', alive.BAKED);
  ok('BAKED.pose still carries all 8 facings', alive.dirs === 8);
  ok('drawChar is defined (the character render path is alive)', alive.drawChar);
  ok('MUS is defined (the audio system is alive)', alive.MUS);
  done();
})();
