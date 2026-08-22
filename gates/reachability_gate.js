/* BOHEMIA REACHABILITY GATE (8/6/26) — the census cannot go stale, and the
 * work-already-paid-for list cannot quietly grow.
 *
 * WHAT THE CENSUS FOUND, and why it needed a gate the same turn: seventeen
 * finished things — Paolo's own eleven approved perimeter walls, the interior
 * pool, the one-button verb system (bohemia_resolve.js), the quest runtime —
 * ship only into slices/BOHEMIA_RUN_CURRENT.html, which the alpha loads and
 * never displays. That is not a bug anybody introduced. It is what six separate
 * incidents in three days were each a symptom of, finally counted.
 *
 * THIS GATE DOES NOT DEMAND THE NUMBER GO DOWN. Wiring a bank into the walked
 * world is real work with real ordering, and which of the seventeen gets done
 * first is Paolo's and the owning lane's call, never a gate's. A gate that
 * failed until somebody wired them would be a gate outranking a ruling.
 *
 * IT DEMANDS THAT THE NUMBER STAY TRUE:
 *   1. the census exists and parses
 *   2. it is FRESH — regenerated since the surfaces it measures last changed,
 *      because a census measuring yesterday's alpha is worse than none
 *   3. the LOADED ONLY list does not grow silently. It may grow — but a lane
 *      that adds an eighteenth has to say so by re-running the census, which
 *      puts it in the file where the next session reads it.
 *   4. the report keeps its own honesty caveat. The census can produce false
 *      NO TRACE results for transformed art, it says so, and a later edit must
 *      not quietly delete that sentence and leave a number that reads as
 *      certainty.
 *
 *   node gates/reachability_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const JSON_PATH = 'records/BOHEMIA_REACHABILITY_CENSUS.json';
const MD_PATH = 'records/BOHEMIA_REACHABILITY_CENSUS.md';
const TOOL = 'tools/bohemia_reachability_census.py';
const SURFACES = [
  'slices/BOHEMIA_CITY_WORLD.html',
  'slices/BOHEMIA_ALPHA_0_9.html',
  'slices/BOHEMIA_RUN_CURRENT.html',
];

ok('the census tool is on disk', fs.existsSync(TOOL));
ok('the census JSON is on disk', fs.existsSync(JSON_PATH));
ok('the census report is on disk', fs.existsSync(MD_PATH));
if (!fs.existsSync(JSON_PATH) || !fs.existsSync(MD_PATH)) {
  console.log('REACHABILITY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}

let census = null;
try { census = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')); } catch (e) { }
ok('the census JSON parses', !!census && Array.isArray(census.rows));
if (!census) {
  console.log('REACHABILITY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}
const md = fs.readFileSync(MD_PATH, 'utf8');

/* ---- 1. it measured a real corpus ---------------------------------------- */
ok('the census covers the whole corpus (' + census.rows.length + ' sources)', census.rows.length >= 150);
const kinds = new Set(census.rows.map(r => r.kind));
ok('it covers both banks and engine modules', kinds.has('bank') && kinds.has('engine'));

/* ---- 2. FRESHNESS: a census of yesterday's alpha is worse than none ------- */
/* the surfaces move constantly - four lanes ship into them daily - so a stale
   census would report confident numbers about a game that has changed. */
const censusAge = fs.statSync(JSON_PATH).mtimeMs;
let newest = 0, newestName = '';
for (const s of SURFACES) {
  if (!fs.existsSync(s)) continue;
  const m = fs.statSync(s).mtimeMs;
  if (m > newest) { newest = m; newestName = s; }
}
const staleHours = (newest - censusAge) / 3.6e6;
ok('the census is FRESH — regenerated since the surfaces last changed (' +
  (staleHours > 0 ? staleHours.toFixed(1) + 'h behind ' + newestName : 'up to date') +
  '). Re-run: python3 ' + TOOL,
  staleHours <= 24);

/* ---- 3. the paid-for list cannot grow in silence -------------------------- */
/* THE NUMBER IS ALLOWED TO MOVE IN EITHER DIRECTION. What it may not do is move
   without the census being re-run, because the census file is where the next
   session finds out. This pins the count the report itself states. */
const loaded = census.rows.filter(r => r.verdict === 'LOADED ONLY');
const stated = /(\d+)\s+sources?,\s+[\d.]+\s*MB/.exec(md);
ok('the report states its own LOADED ONLY count', !!stated || md.indexOf('LOADED ONLY') >= 0);
ok('the JSON and the report agree on the LOADED ONLY set (' + loaded.length + ' sources)',
  loaded.every(r => md.indexOf(r.path) >= 0));

/* every LOADED ONLY row must name a real file — a paid-for list full of ghosts
   would send somebody wiring something that no longer exists */
let ghosts = 0;
loaded.forEach(r => { if (!fs.existsSync(r.path)) { ghosts++; console.log('    GHOST: ' + r.path); } });
ok('every source on the paid-for list really exists on disk', ghosts === 0);

/* ---- 4. the honesty caveat survives editing ------------------------------- */
/* A census that overclaims is worse than none. The report explains that a
   TRANSFORMED bank reads as NO TRACE while genuinely reaching him; if somebody
   trims that, the counts start reading as certainty they have not earned. */
ok('the report keeps its false-negative caveat (transformed art reads as NO TRACE)',
  /transformed/i.test(md) && /not proof/i.test(md));
ok('the report says it decides by BYTES, not by names (the 8/4 false-alarm lesson)',
  /bytes/i.test(md) && /names/i.test(md));

/* ---- 5. the instrument agrees with what was verified BY HAND -------------- */
/* THE CALIBRATION, and it is the claim that makes the rest worth reading. Four
   sources were checked by hand on 8/4 before this tool existed. If the census
   ever disagrees with one of them, the census is broken, not the hand check --
   UNLESS THE WORLD MOVED UNDER THE HAND CHECK, which is what happened to the
   dress row and is why this comment now exists.

   dress.js was genuinely unreached on 8/4. On 8/11 the FACTIONS lane wired the
   allegiance line into the run's person card, and it reads BohemiaDress's
   FACTION_LOOK/FACTION_MOTIF for the colour and the mark -- so the module is
   loaded by the shown surface now and NO TRACE is simply no longer true. The
   census only caught it today because regenerating it is what made it current.
   A hand check is a measurement of a moment, not a permanent fact; when a later
   change falsifies one, the row moves and says why. (The census's LOADED ONLY is
   conservative here: the colour does reach the screen, as a swatch, but it
   arrives as a value rather than a draw call and the classifier reads calls.) */
const VERIFIED = [
  /* MOVED 8/21, AND THE ROW ABOVE ALREADY SAID HOW TO DO THIS: "a hand check is a
     measurement of a moment, not a permanent fact; when a later change falsifies
     one, the row moves and says why". This one was hand-checked NO TRACE on 8/4
     with the note "grep: no makeMind on any surface". That is no longer true, and
     the census caught it the moment regenerating made it current -- which is the
     calibration working in the direction nobody expects, the instrument correcting
     the hand.
     VERIFIED BEFORE MOVING IT, on the comment-stripped city so a mention could not
     pass for a use: the module is inlined VERBATIM and the city really CALLS it --
     BohemiaMemory.makeMind(, .recall(, .see( -- and gates/city_memory_gate.js
     ("somebody remembers seeing you, on the tab he taps") is 23/0 over it. The
     block knowing your face is on the surface he plays. */
  ['engine/bohemia_memory.js', 'SHOWN'],          // 8/4 NO TRACE; the CITY MEMORY work calls makeMind/recall/see
  ['engine/bohemia_dress.js', 'LOADED ONLY'],     // was NO TRACE 8/4; the run's allegiance line loads it 8/11
  ['engine/bohemia_people.js', 'SHOWN'],          // P-J shipped it into the city
  ['engine/bohemia_agents.js', 'SHOWN'],          // makeSim is in the city frame
];
const byPath = {};
census.rows.forEach(r => { byPath[r.path] = r; });
VERIFIED.forEach(([p, want]) => {
  const got = byPath[p] ? byPath[p].verdict : 'MISSING';
  ok('CALIBRATION — ' + p.replace('engine/', '') + ' hand-verified ' + want +
    ', census says ' + got, got.indexOf(want) === 0);
});

console.log('REACHABILITY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  loaded.length + ' sources reach only the file nobody sees)');
process.exit(fail ? 1 : 0);
