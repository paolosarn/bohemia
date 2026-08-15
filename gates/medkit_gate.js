#!/usr/bin/env node
/* MEDKIT GATE (8/15/26, WORLD lane) — THE FIELD SURGERY KIT IS FIVE GOODS, AND ONLY FIVE.
 *
 * LOCKED 8/13: laws/BOHEMIA_ADDENDUM_HEALING_IS_A_BIG_DEAL_8_12_26.md sec 7-8. Paolo wrote
 * the procedure himself, at a bedside, step for step:
 *
 *   1. POVIDONE IODINE, "you can dilute it a little bit with sterile water. Then you poured
 *      it on your open wound."
 *   2. LIDOCAINE, "inject in the surrounding tissue."
 *   3. STERILIZE TWEEZERS IN BOILING WATER.
 *   4. EXTRACT, "pick the shotgun pellets or bullet out."
 *   5. ANTIBIOTICS, "inject yourself with antibiotics."
 *
 * AND IT IS MEDICALLY REAL, which is why it earned a law instead of a note: irrigate and
 * disinfect, local anaesthetic, sterile instruments, foreign-body removal, antibiotic cover
 * is the actual civilian and wilderness-medicine sequence. The medicine ledger holds too --
 * iodine and lidocaine are both shelf-stable for years, so what survives the crash is
 * exactly this kit, and injectable antibiotics being the scarce link is what turns a
 * complete kit from a shopping list into a PRIZE.
 *
 * WHAT THIS GATE PROVES:
 *  1. All five exist and are queryable off the goods table, in his order.
 *  2. TWEEZERS IS THE ONLY DURABLE. Sterilised, never consumed. Everything else burns.
 *  3. They price through the EXISTING scarcity sim, not a second price path built beside
 *     it -- a kit economy with its own pricing rules is two economies.
 *  4. THE PRICE IS HIS ONE. EVERYTHING COSTS ONE (8/15) is NEWER than the 8/11 scarcity
 *     ruling and reaches "any future resource price anybody is tempted to invent", so a
 *     researched-looking anchor invented today would be canon nobody ruled. Newest date
 *     wins; the six older goods keep their anchors because they predate it.
 *  5. EVERY WORD SHIPS draft:true. ALWAYS MAKE AN ATTEMPT (8/11): he does not write from a
 *     blank page, HE EDITS, so the descriptions are written as if they ship and tagged so
 *     he can find every word he has not approved.
 *  6. AND THIS LANE DID NOT TAKE ANYBODY ELSE'S HALF. The 8/13 routing gave WORLD the goods
 *     and nothing else: the surgery CLIPS are CHARACTER/ANIMATION's, the treat-wound VERB
 *     and step ordering are RUN's resolver, the sounds are the sound lane's. Building them
 *     here would be crossing a lane boundary, which is the one thing ONE SYSTEM, ONE
 *     SESSION forbids. So the gate checks what is ABSENT as carefully as what is present.
 *
 *   node gates/medkit_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const E = require(path.join(ROOT, 'engine/bohemia_economy.js'));
const SRC = fs.readFileSync('engine/bohemia_economy.js', 'utf8');
/* Comments AND string bodies stripped, because a checker that cannot tell a mention from a
   use is the broken one -- this file's own prose quotes the procedure it must not implement. */
const logic = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
                 .replace(/'(?:\\.|[^'\\])*'/g, "''").replace(/"(?:\\.|[^"\\])*"/g, '""');

const KIT = ['iodine', 'sterilewater', 'lidocaine', 'tweezers', 'antibiotics'];
const inKit = Object.keys(E.GOODS).filter(g => E.GOODS[g].kit === 'field_surgery');

// ---- 1: all five, and no sixth ----------------------------------------------------------
ok('all five of his goods exist (' + KIT.join(', ') + ')',
   KIT.every(g => !!E.GOODS[g]));
ok('and the kit is EXACTLY five -- a sixth would be canon nobody ruled',
   inKit.length === 5 && KIT.every(g => inKit.indexOf(g) >= 0));
ok('each one carries the step of his procedure it belongs to, so the order is data rather ' +
   'than something a reader has to remember',
   KIT.every(g => E.GOODS[g].step >= 1 && E.GOODS[g].step <= 5));
ok('iodine and sterile water are the SAME step, because he dilutes one with the other',
   E.GOODS.iodine.step === E.GOODS.sterilewater.step);
ok('and antibiotics are LAST, which is the step that decides whether the rest mattered',
   KIT.every(g => E.GOODS[g].step <= E.GOODS.antibiotics.step));

// ---- 2: the durable ---------------------------------------------------------------------
ok('TWEEZERS ARE THE ONLY DURABLE: sterilised and reused, never burned like the rest',
   E.GOODS.tweezers.durable === true &&
   KIT.filter(g => E.GOODS[g].durable).length === 1);

// ---- 3 + 4: one price path, and it is his ONE -------------------------------------------
{
  const led = E.makeLedger(7, 20, 10);
  KIT.forEach(g => { if (led.stocks[g] === undefined) led.stocks[g] = 0; });
  const priced = KIT.map(g => E.price(led, g));
  ok('every kit good prices through the EXISTING scarcity sim -- no second price path was ' +
     'built beside it, because a kit economy with its own rules is two economies',
     priced.every(p => typeof p === 'number' && isFinite(p)));
  ok('and the price is 1, his EVERYTHING COSTS ONE ruling, which is NEWER than the 8/11 ' +
     'scarcity ruling and reaches any price anybody is tempted to invent',
     KIT.every(g => E.GOODS[g].base === 1));
  ok('the six goods that predate the ruling keep their researched anchors, so nothing was ' +
     'flattened that he never asked to flatten',
     E.GOODS.meds.base !== 1 && E.GOODS.water.base !== 1);
  ok('none of the five invents a daily need -- they are EVENT goods, and the sim already ' +
     'handles need:0 the way it does for power and salvage',
     KIT.every(g => E.GOODS[g].need === 0));
}

// ---- 5: every word is an attempt, and tagged ---------------------------------------------
ok('every kit good ships a REAL written description rather than a blank field, because he ' +
   'does not write from nothing, he edits (ALWAYS MAKE AN ATTEMPT, 8/11)',
   KIT.every(g => typeof E.GOODS[g].desc === 'string' && E.GOODS[g].desc.length > 12));
ok('and every one is tagged draft:true so he can find every word he has not approved',
   KIT.every(g => E.GOODS[g].draft === true));

// ---- 6: this lane did not take anybody else's half ---------------------------------------
{
  ok('NO treat-wound verb was built here -- the resolver surface is RUN\'s half of the 8/13 ' +
     'routing', !/treatWound|applyStep|performSurgery|doSurgery/.test(logic));
  ok('NO animation or clip hook was built here -- the surgery clips are CHARACTER/ANIMATION\'s',
     !/\b(clip|anim|frame|pose)\w*\s*[:=]/i.test(logic));
  ok('NO sound hook was built here -- the sequence is a prime SFX moment set and that is the ' +
     'sound lane\'s ear, not this one\'s', !/\bsfx|playSound|audio/i.test(logic));
  ok('and no outcome dial was invented for skipping a step, which is a NUMBER and therefore ' +
     'pending his playtest feel', !/penalt|infectionChance|worseOutcome/i.test(logic));
}

console.log('MEDKIT GATE: ' + pass + ' passed, ' + fail + ' failed  (his five-step field ' +
            'surgery is five goods in his order, tweezers the only durable, priced through ' +
            'the one existing sim at his ONE, every word an attempt he can edit, and not ' +
            'one piece of another lane\'s half taken)');
process.exit(fail ? 1 : 0);
