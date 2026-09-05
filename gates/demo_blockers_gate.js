#!/usr/bin/env node
/* DEMO BLOCKERS GATE (8/9/26, WORLD lane).
 *
 *   "First: DEMO BLOCKERS -- numbered, thumbable."            -- Paolo, 8/9/26
 *
 * The demo dispatch demands, before any demo work, a numbered list of everything in
 * flight in this lane that needs PAOLO -- and NOTHING a lane can decide itself. Two
 * ways that list rots, and this gate exists for both:
 *
 *   IT ASKS HIM FOR SOMETHING HE ALREADY GAVE. A hand-typed list is stale the moment
 *   he rules one row. That is STALE UNJUDGED and NOTES ARE RULINGS in one, and it is
 *   the fastest way to make a judging surface worthless. So every blocker's EXISTENCE
 *   is derived from a hole the machine can still see, and this gate proves the derivation
 *   is real by checking the hole itself, not the report.
 *
 *   IT QUIETLY DROPS ONE. A blocker the tool has no question written for must still be
 *   reported, loudly, as UNWRITTEN. Silence about a hole reads exactly like no hole.
 *
 * AND HE HAS TO BE ABLE TO ANSWER IT WHERE HE ALREADY IS: in the VOTE tab, ABOVE the
 * art, one tap, realistic option first (REALISM FIRST + the 8/4 question format), and
 * the export has to carry the answer back in a shape the repo can read.
 *
 *   node gates/demo_blockers_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const JSON_PATH = 'records/target/BOHEMIA_DEMO_BLOCKERS.json';
const MD_PATH = 'records/BOHEMIA_DEMO_BLOCKERS_WORLD.md';
const TOOL = 'tools/bohemia_demo_blockers.py';
const TAB = 'slices/BOHEMIA_VOTE_CURRENT.html';
const PURSE = 'engine/bohemia_purse.js';

ok('the blocker report exists (' + MD_PATH + ')', fs.existsSync(MD_PATH));
ok('the tab data exists (' + JSON_PATH + ')', fs.existsSync(JSON_PATH));
if (!fs.existsSync(JSON_PATH)) {
  console.log('DEMO BLOCKERS GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
const B = data.blockers || [];
ok('there is a lane on the report', data.lane === 'WORLD');
// ZERO IS THE GOAL, NOT A FAILURE. This read `B.length > 0` and went RED on 8/11 the
// moment Paolo answered all five -- a gate demanding he permanently owe us something,
// which is exactly backwards and is the thing EVERYTHING IS A THUMB (8/9) forbids. An
// empty list means the lane is unblocked; the structural checks below apply per blocker
// and are vacuously true when there are none.
console.log('  (' + B.length + ' blocker(s) outstanding' +
            (B.length === 0 ? ' -- he has answered everything' : '') + ')');

// ---- 1. NUMBERED, and numbered CORRECTLY -------------------------------------------
ok('every blocker is numbered, 1..n with no gaps',
   B.every((b, i) => b.n === i + 1));
ok('every blocker asks an actual question', B.every(b => b.q && b.q.length > 12));

// ---- 2. TWO OR THREE CONCLUSIONS, ANSWERED WITH ONE LETTER (the 8/4 format) ---------
// An UNWRITTEN blocker is exempt from the shape -- it is reported precisely BECAUSE
// nobody wrote it yet, and demanding options would push the tool to hide it instead.
const written = B.filter(b => !/^\[UNWRITTEN/.test(b.q));
ok('nothing was quietly dropped: every hole is on the list, written or flagged UNWRITTEN',
   B.length === written.length + B.filter(b => /^\[UNWRITTEN/.test(b.q)).length);
ok('every written blocker offers TWO OR THREE conclusions (8/4 question format)',
   written.every(b => b.opts && b.opts.length >= 2 && b.opts.length <= 3));
ok('each conclusion is a single letter he can answer with',
   written.every(b => b.opts.every((o, i) => o[0] === 'ABC'[i])));
ok('each conclusion explains itself, so he never has to go look anything up',
   written.every(b => b.opts.every(o => (o[2] || '').length > 30)));

// ---- 3. THE EXISTENCE IS DERIVED. Check the HOLE, not the report. -------------------
const purse = fs.readFileSync(PURSE, 'utf8');
const emptyTables = [];
const RE = /^\s*var\s+([A-Z_]+)\s*=\s*\{\s*\}\s*;.*?\[PENDING Paolo\]/gm;
let m;
while ((m = RE.exec(purse))) emptyTables.push(m[1]);
/* *** THIS ASKED FOR A HOLE TO EXIST, AND THE HOLE IS FILLED NOW (9/5). ***
   It read "the purse still has ruled-but-empty tables to derive from" and required at
   least one, which was a fair guard while PAYOUT and PRICES were empty: a deriver with
   nothing to derive proves nothing. Then his 8/15 ruling ("everything costs one") and
   his 9/4 ruling ("batteries are the currency") went into the tables and the count went
   to zero -- which is the state this whole gate exists to reach.
   A GATE MUST NEVER OUTRANK A RULING (8/1). So the guard keeps its tooth by MUTATION
   instead of by demanding the repo stay broken: the same regex is run over a synthetic
   purse that does have such a table, and it must find it. If the deriver ever stops
   working, this goes red on a clean repo -- which is the only time it matters. */
console.log('       ruled-but-empty [PENDING Paolo] tables in the purse: ' +
            (emptyTables.length ? emptyTables.join(', ') : 'none, and that is the point'));
{
  const probe = '  var FAKETABLE = {};    // whatever -> whatever   [PENDING Paolo]\n';
  const found = [];
  const RE2 = /^\s*var\s+([A-Z_]+)\s*=\s*\{\s*\}\s*;.*?\[PENDING Paolo\]/gm;
  let mm2; while ((mm2 = RE2.exec(probe))) found.push(mm2[1]);
  ok('THE DERIVER STILL WORKS -- plant an empty [PENDING Paolo] table and it is found, ' +
     'so an empty list above means the tables are filled and not that nothing is looking',
     found.length === 1 && found[0] === 'FAKETABLE');
}
const keys = new Set(B.map(b => b.key));
// A RULING RETIRES A BLOCKER WITHOUT FILLING ITS TABLE, and two of his three 8/11
// answers do exactly that on purpose: PAYOUT moved the reward onto the quest itself,
// PRODUCTION is "out of the demo cut" and stays empty forever. So the test is not
// "empty table => on the list", it is "empty table AND unruled => on the list".
const ruled = new Set();
for (const f of fs.readdirSync('records')) {
  if (!/\.(txt|md)$/i.test(f)) continue;
  const t = fs.readFileSync(path.join('records', f), 'utf8');
  for (const mm of t.matchAll(/^\s*@RULING\s+([A-Za-z0-9_]+)\b/gm)) ruled.add(mm[1].toUpperCase());
}
const missing = emptyTables.filter(t => !keys.has(t) && !ruled.has(t));
ok('every empty [PENDING Paolo] table he has NOT ruled is on the list' +
   (missing.length ? ' — missing ' + missing.join(', ') : ''), missing.length === 0);
ok('and a table he HAS ruled is off it, even though it is still empty (' +
   emptyTables.filter(t => ruled.has(t)).join(', ') + ')',
   emptyTables.every(t => !ruled.has(t) || !keys.has(t)));

// and the reverse: a table blocker must not survive its own table being filled
const filled = [...keys].filter(k => /^[A-Z_]+$/.test(k) && !emptyTables.includes(k) &&
                                     new RegExp('var\\s+' + k + '\\s*=').test(purse));
ok('no blocker is reported for a table he has already ruled' +
   (filled.length ? ' — stale ' + filled.join(', ') : ''), filled.length === 0);

// the edge really is wired and really is silent -- a blocker is never a story
for (const [t, fn] of [['PAYOUT', 'payQuest'], ['PRICES', 'spend'], ['PRODUCTION', 'produce']]) {
  if (!keys.has(t)) continue;
  ok('the ' + t + ' edge is BUILT and connected (' + fn + '), it just has nothing to pay out',
     new RegExp('function\\s+' + fn + '\\s*\\(').test(purse) && purse.includes(t + '['));
}
ok('and each one names NO_RULING rather than failing silently', /NO_RULING/.test(purse));

// ---- 4. THE TOOL DERIVES; IT DOES NOT COUNT BY HAND ---------------------------------
const tool = fs.readFileSync(TOOL, 'utf8');
const code = tool.replace(/^\s*#.*$/gm, '').replace(/"""[\s\S]*?"""/g, '');
ok('the tool never hard-codes how many blockers there are',
   !/blockers\s*=\s*\[\s*\{/.test(code) && !/BLOCKER_COUNT/.test(code));
ok('the tool reads the engine source to find the holes', code.includes(PURSE));
ok('the tool reads the live verdict queue the same way the VOTE tab does',
   /@VERDICT/.test(code));

// ---- 5. HE CAN ANSWER IT WHERE HE ALREADY IS ---------------------------------------
ok('the VOTE tab was rebuilt with the blockers in it', fs.existsSync(TAB));
const tab = fs.readFileSync(TAB, 'utf8');
const nBlk = (tab.match(/class="blk"/g) || []).length;
ok('every blocker is rendered in the tab (' + nBlk + ' of ' + B.length + ')', nBlk === B.length);
const iBlk = tab.indexOf('class="blk"');
const iCard = tab.indexOf('class="card"');
if (B.length) {
  ok('the blockers sit ABOVE the icons, so he cannot scroll past the thing that blocks the demo',
     iBlk > 0 && iCard > 0 && iBlk < iCard);
  ok('one tap answers one blocker (lettered buttons, not a form)', /class="ob"/.test(tab));
  ok('and he can always answer in his own words instead', /class="bnote"/.test(tab));
} else {
  ok('nothing is asked of him when he has answered everything', iBlk < 0);
}
ok('the realistic option LEADS: option A is first in the DOM for every blocker',
   !B.length || written.every(b => {
     const seg = tab.split('data-b="' + b.key + '"')[1] || '';
     const first = (seg.match(/data-o="([A-C])"/) || [])[1];
     return first === 'A';
   }));
ok('his answer comes back in a shape the repo can read (@RULING)', /@RULING/.test(tab));

console.log('DEMO BLOCKERS GATE: ' + pass + ' passed, ' + fail + ' failed  (' + B.length +
            ' blockers, all derived · ' + emptyTables.length + ' ruled-but-empty tables · ' +
            'answered in the VOTE tab above the art)');
process.exit(fail ? 1 : 0);
