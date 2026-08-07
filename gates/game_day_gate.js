/* BOHEMIA GAME DAY GATE (8/6/26) — the day loop can get better, never quietly worse.
 *
 * THE BIG MISSING item 1: "the circulatory system between the organs is the game,
 * and it has never once circulated." tools/bohemia_game_day_probe.js attempts the
 * day on the surface the RUN tab really opens and reports where it stops. Measured
 * 8/6, first run:
 *
 *     1  wake at base      OK
 *     2  pick up a quest   BLOCKED   <- the first thing that stops the day
 *     3  travel            OK
 *     4  resolve (talk)    PARTIAL
 *     4b resolve (fight)   BLOCKED
 *     5  get paid          BLOCKED
 *     6  spend             BLOCKED
 *     7  sleep, save       PARTIAL   (save works; sleep does not end the day)
 *
 * WHAT THIS GATE IS FOR. Not to demand the day work — closing those links is the
 * RUN lane's charter and is blocked on rulings Paolo has not made, and a gate that
 * failed until then would be a gate outranking a ruling. It is a RATCHET: the two
 * links that work today must keep working, and the record must stay honest about
 * the rest. Walking and waking are the entire game right now; if a refactor breaks
 * one of them, that must not be something a human notices later.
 *
 *   node gates/game_day_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const PROBE = 'tools/bohemia_game_day_probe.js';
const OUT = 'records/BOHEMIA_GAME_DAY_PROBE.json';
const REC = 'records/BOHEMIA_HOW_FAR_THE_GAME_GETS_IN_ONE_DAY_8_6_26.md';

ok('the day probe is on disk', fs.existsSync(PROBE));
ok('the day probe has been run (its result is on disk)', fs.existsSync(OUT));
ok('the finding is written down where a session will read it', fs.existsSync(REC));
if (!fs.existsSync(OUT)) {
  console.log('  (run: node ' + PROBE + ')');
  console.log('GAME DAY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}

let res = null;
try { res = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { }
ok('the probe result parses', !!res && Array.isArray(res.links));
if (!res) {
  console.log('GAME DAY GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(1);
}
const state = {};
res.links.forEach(l => { state[l.n.split(' ')[0]] = l.state; });

/* ---- THE RATCHET: what works today must keep working --------------------- */
/* These two ARE the game right now. Everything else on the list is honest
   about being absent; these two are the only things a player can actually do,
   so they are the only ones worth pinning. */
ok('WAKE AT BASE still works — the RUN tab still puts him in his body somewhere real ' +
  '(got ' + state['1'] + ')', state['1'] === 'OK');
ok('TRAVEL still works — the d-pad still walks him (got ' + state['3'] + ')',
  state['3'] === 'OK');

/* ---- THE RECORD MUST STAY HONEST ----------------------------------------- */
const rec = fs.readFileSync(REC, 'utf8');
ok('the record names the first thing that stops the day',
  /first thing that stops the day/i.test(rec));
ok('the record says BLOCKED means UNREACHABLE HERE, not unbuilt — the organs are ' +
  'finished in the file nobody sees, and a reader who misses that will rebuild them',
  /not\s*\*\*mean unbuilt|does \*\*not\*\* mean unbuilt|not mean unbuilt/i.test(rec) ||
  /The organs are built/i.test(rec));
ok('the record keeps the account of the instrument being wrong first (three rounds ' +
  'of tuning a word search could not fix a word search)',
  /names are a dialect/i.test(rec));

/* ---- AND THE PROBE MUST STILL BE HONEST ---------------------------------- */
/* the v1..v3 failure was a word search reporting built-ins as game systems. If
   anybody reintroduces one, this says so. */
const probe = fs.readFileSync(PROBE, 'utf8');
ok('the probe asks for SPECIFIC named affordances rather than scanning window for words',
  probe.indexOf('const NAMED = async') >= 0);
ok('the probe still drives the surface the RUN tab opens (not the invisible run slice)',
  probe.indexOf("click('.tab[data-p=\"run\"]')") >= 0 && probe.indexOf('cityFrame') >= 0);
ok('the probe writes nothing into the game (read-only by construction)',
  probe.indexOf('BOHEMIA_ALPHA_0_9.html\', \'w\'') < 0);

console.log('GAME DAY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  res.links.filter(l => l.state === 'OK').length + ' of ' + res.links.length +
  ' links work; first blocker: ' + (res.firstBlocker || 'none') + ')');
process.exit(fail ? 1 : 0);
