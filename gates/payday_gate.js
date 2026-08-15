#!/usr/bin/env node
/* PAYDAY GATE (8/9/26, WORLD lane).
 *
 *   "the quest payout hook so the day loop PAYS, one act-1 trading hub reachable
 *    and spendable"                                            -- Paolo, 8/9/26
 *
 * WHAT THIS HOLDS, and the first one is the reason it exists at all:
 *
 *  1. THE MONEY IS IN THE WORLD HE WALKS. Not in engine/. Not in the run slice, which
 *     the alpha loads and NEVER DISPLAYS. A module nobody loads is a module that does
 *     not exist, and this repo has now paid for the wrong door four times. The gate
 *     checks the page the RUN tab actually swaps in.
 *
 *  2. THE HOOK IS REALLY CONNECTED. Earlier the same day I wrote, on a surface he
 *     reads, that payQuest fired on every quest outcome. Nothing called it. Nothing
 *     imported the purse at all. So this gate does not read a claim -- it hands the
 *     bridge a finished quest in the quest runtime's OWN shape and checks what comes
 *     back.
 *
 *  3. AND IT STILL PAYS NOTHING, OUT LOUD, BY NAME. Every amount a player would feel
 *     is Paolo's: what a quest pays, what a thing costs, what a building yields. All
 *     three tables ship empty and answer NO_RULING. A "sensible default" here is canon
 *     nobody ruled -- so the gate fails if a number ever appears, and fails if the
 *     refusal ever goes quiet. The pipe is finished; the valve is his.
 *
 *  4. THE HUBS ARE READ, NOT PLACED. MAP LAW: Claude never designs map layouts. The
 *     hubs are the cells the overmap already sited, and the gate proves the same set
 *     comes back through the full world model and through a raw overmap -- because the
 *     walked surface only has the second one, which is exactly how the first version
 *     of this returned an empty list on the one surface that mattered.
 *
 *   node gates/payday_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const PURSE = require(path.join(ROOT, 'engine/bohemia_purse.js'));
const PD = require(path.join(ROOT, 'engine/bohemia_payday.js'));
const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));

// ---- 1. IT IS IN THE WORLD HE WALKS -------------------------------------------------
// Tapping RUN swaps in #cityFrame. Read the alpha to find which file that is rather
// than naming it here -- a filename typed in a gate is the wrong-door bug with extra
// steps.
const alpha = fs.readFileSync('slices/BOHEMIA_ALPHA_0_9.html', 'utf8');
const m = alpha.match(/const CITY_SRC\s*=\s*'([^']+)'/);
ok('the alpha says which page the RUN tab opens', !!m);
const WALKED = 'slices/' + (m ? m[1] : 'BOHEMIA_CITY_WORLD.html');
ok('that page exists (' + WALKED + ')', fs.existsSync(WALKED));
const walked = fs.readFileSync(WALKED, 'utf8');
for (const sym of ['BohemiaEconomy', 'BohemiaPurse', 'BohemiaPayday']) {
  ok(sym + ' is loaded in the world he walks, not just in engine/',
     new RegExp('root\\.' + sym + '\\s*=').test(walked));
}
/* THE MARKERS ARE READ OFF THE PATCH TOOL, NEVER RETYPED HERE, and that is not tidiness --
   THIS ASSERTION WAS PINNING A LIVE BUG IN PLACE. It hard-coded "THE PLAYER CAN BE PAID",
   the block's ORIGINAL name. When the block outgrew money and was renamed to "THE WORLD YOU
   STAND IN", the patch tool stopped recognising the old block and inlined a SECOND copy of
   economy/purse/payday above it -- and this gate then REQUIRED the orphan to stay, because
   deleting it would turn this line red. The stale copy sat later in the file, so the browser
   ran it and the fresh one was dead code, for as long as both were there.
   A GATE THAT HARD-CODES WHAT A TOOL GENERATES WILL EVENTUALLY DEFEND THE OLD BEHAVIOUR
   AGAINST THE NEW ONE. Derive it, and the rename is free. (The recurring house bug: a value
   passed by hand where a value could be derived.) */
const PATCH = fs.readFileSync('tools/bohemia_city_payday_patch.py', 'utf8');
const markOf = (name) => (PATCH.match(new RegExp('^' + name + " = '(.*)'", 'm')) || [, ''])[1];
const MARK = markOf('MARK'), ENDMARK = markOf('ENDMARK');
ok('the block markers are read off the patch tool rather than retyped (' + MARK + ')',
   !!MARK && !!ENDMARK);
ok('the payday block is delimited so it can be REFRESHED, never frozen at first landing',
   walked.includes(MARK) && walked.includes(ENDMARK));
ok('and NO block survives under a name the tool no longer looks for -- an orphan later in ' +
   'the file wins at runtime and shadows the fresh copy',
   !walked.includes('THE PLAYER CAN BE PAID'));
// ENGINE SYNC LAW: the inlined body must BE the canon body, not a fork of it
const payBody = fs.readFileSync('engine/bohemia_payday.js', 'utf8');
ok('the inlined payday is byte-identical to the engine canon (one body, no drift)',
   walked.includes(payBody.trim().slice(0, 400)));

// ---- 2. THE HOOK IS CONNECTED, tested by USE ----------------------------------------
const purse = PURSE.create({});
const finished = { done: true, outcome: 'COMPLETE', doneTags: ['#notable'], id: 'S01' };
const paid = PD.payForQuest(purse, finished, 1, 'S01');
ok('a finished quest reaches the purse (the bridge is real, not a story)',
   paid && paid.reason !== 'NO_PURSE' && paid.reason !== 'NOT_FINISHED');
ok('an UNfinished quest pays nothing and says why',
   PD.payForQuest(purse, { done: false }, 1).reason === 'NOT_FINISHED');
ok('the event is built from the quest runtime\'s OWN shape, with no third format between',
   (() => { const ev = PD.questEvent(finished, 'S01');
            return ev && ev.outcome === 'COMPLETE' && ev.tags[0] === '#notable'; })());

// ---- 3. AND IT PAYS NOTHING, BY NAME ------------------------------------------------
ok('what a quest pays is STILL Paolo\'s: PAYOUT is empty',
   Object.keys(PURSE.PAYOUT || {}).length === 0);
ok('what a thing costs is STILL Paolo\'s: PRICES is empty',
   Object.keys(PURSE.PRICES || {}).length === 0);
ok('what a building yields is STILL Paolo\'s: PRODUCTION is empty',
   Object.keys(PURSE.PRODUCTION || {}).length === 0);
ok('the payout refuses OUT LOUD, naming the table and whose call it is',
   paid.reason === 'NO_RULING' && paid.table === 'PAYOUT' && /Paolo/.test(paid.about || ''));
const pw = PD.price(purse, null, 'water');
ok('and so does a price', pw.reason === 'NO_RULING' && pw.table === 'PRICES');
ok('nothing was credited: every balance is still zero',
   PURSE.CURRENCIES.every(c => PURSE.balance(purse, c) === 0));
// A GATE MUST NEVER OUTRANK A RULING (8/1). This read "the valve is SHUT" until he
// answered: @RULING PRICES A (8/11) = "Three goods, priced off the scarcity sim we already
// have." So the valve is OPEN, and what the gate must now hold is that the price is READ
// off the sim rather than typed, and that his own table still beats it.
ok('the price comes off the scarcity sim, as he ruled 8/11 (PRICE_SOURCE economy)',
   PD.PRICE_SOURCE === 'economy');
const ECON = require(path.join(ROOT, 'engine/bohemia_economy.js'));
const led = ECON.makeLedger(12345, 900, 300);
const pw2 = PD.price(purse, led, 'water');
ok('and it really prices off it, moving with scarcity instead of a typed constant',
   pw2.source === 'economy' && typeof pw2.price === 'number' && pw2.price > 0);
ok('the shelf is priced end to end (' +
   PD.shelf().map(s => s.good + ' ' + PD.price(purse, led, s.good).price).join(', ') + ')',
   PD.shelf().every(s => typeof PD.price(purse, led, s.good).price === 'number'));
// buying is a HARD SINK, which is the half of a faucet-and-drain economy that fights inflation
const buyer = PURSE.create({});
ok('you cannot buy what you cannot afford', PD.buy(buyer, null, 'water', 1, led).reason === 'CANNOT_AFFORD');
PURSE.credit(buyer, 'resources', 20, 'test', 't', 1);
const bought = PD.buy(buyer, null, 'water', 1, led);
ok('and with a purse you can: the hub is SPENDABLE', bought.applied === true && bought.paid > 0);
ok('the spend is recorded as a HARD SINK, not a transfer', PURSE.flow(buyer).resources.drain > 0);

// WHAT A QUEST PAYS IS THE QUEST'S OWN BUSINESS -- ruled 8/11: "Whatever currency the quest
// decida to give." Not a global table keyed on outcome tier; the reward rides with the job.
const rq = PURSE.create({});
const declared = PD.payForQuest(rq, { done: true, outcome: 'COMPLETE',
                                      reward: { resources: 6, clout: 2 } }, 1, 'S01');
ok('a quest that declares its own reward is paid exactly that (Paolo 8/11)',
   declared.applied === true && declared.source === 'quest' &&
   PURSE.balance(rq, 'resources') === 6 && PURSE.balance(rq, 'clout') === 2);
ok('and a quest that declares nothing still refuses out loud, table empty as ever',
   PD.payForQuest(PURSE.create({}), { done: true, outcome: 'COMPLETE' }, 1).reason === 'NO_RULING');
// a default number smuggled in as "sensible" is the whole failure mode
const code = payBody.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
ok('the bridge contains NO payout or price number of its own',
   !/(PAYOUT|PRICES|PRODUCTION)\s*\[[^\]]*\]\s*=/.test(code) &&
   !/\b(price|amount|payout)\s*[:=]\s*\d/.test(code));

// ---- 4. THE HUBS ARE READ, NOT PLACED ----------------------------------------------
const SEEDS = [1, 777, 12345, 24301, 99991];
let minHubs = Infinity, agree = true, everyReach = true;
for (const s of SEEDS) {
  const w = W.world(s);
  const viaWorld = PD.hubs(w).map(h => h.id);
  const viaOvermap = PD.hubs(OM.buildOvermap(s)).map(h => h.id);
  if (JSON.stringify(viaWorld) !== JSON.stringify(viaOvermap)) agree = false;
  minHubs = Math.min(minHubs, viaWorld.length);
  for (const h of PD.hubs(w)) if (PD.reachable(w, h) !== true) everyReach = false;
}
ok('every seed has at least ONE act-1 trading hub (min ' + minHubs + ' across ' +
   SEEDS.length + ' seeds)', minHubs >= 1);
ok('the SAME hubs come back through the full world model and through a raw overmap ' +
   '(the walked surface only has the second)', agree);
ok('and every hub is REACHABLE -- the drive network gets to it from the curb', everyReach);
ok('reachable() returns NULL where it cannot be tested, never a guessed false',
   PD.reachable(OM.buildOvermap(12345), PD.hubs(OM.buildOvermap(12345))[0]) === null);
ok('the hub types are market types the overmap already sites, not new placements',
   PD.HUB_TYPES.every(t => W.districtTypes().indexOf(t) >= 0));
ok('the shelf is the economy module\'s own researched goods, not a list invented here',
   (() => { const ECON = require(path.join(ROOT, 'engine/bohemia_economy.js'));
            return PD.shelf().every(s => !!ECON.GOODS[s.good]); })());

// ---- 5. THE DAY REPORT NAMES WHAT IS BLOCKING AND WHOSE CALL IT IS ------------------
const rep = PD.dayReport(W.world(12345), purse, null);
ok('the day report says the purse exists and names the three ruled currencies',
   rep.purseExists && rep.currencies.length === 3);
ok('and it names exactly what is blocking, so nobody has to guess (' +
   rep.blocking.join(', ') + ')',
   rep.blocking.indexOf('PAYOUT') >= 0 && rep.blocking.indexOf('PRICES') >= 0);

console.log('PAYDAY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
            'the money is on the walked surface · hubs read from the overmap · ' +
            'every amount still [PENDING Paolo])');
process.exit(fail ? 1 : 0);
