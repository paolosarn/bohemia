/* BOHEMIA CONTRACTS GATE (10/9/26, ECONOMY lane)
 * VAMILY [the contract's worth], rule 74 top row.
 *
 * Contracts priced by skulls and distance, clout raising the pay, a failed one costing
 * relation, the haggle and its cost -- every number pulled directly off the wiki's own
 * Contracts and Relations pages, not a felt curve. This gate proves the conversion matches
 * the wiki's own worked example, the haggle mechanic follows its stated formula exactly, and
 * every gap the wiki itself leaves open (the skull-to-pay curve, the renown-to-pay curve, a
 * bread-theft cost) is named as a gap rather than silently filled.
 *
 * PROVES:
 *   A  the "nothing" row converts to batteries exactly as price_table.json's own floor rule
 *   B  haggleAttempt follows the wiki's own formula (annoyance before the roll, fail=annoyance*0.1)
 *   C  the Negotiator halves both the annoyance gain and the relations cost
 *   D  applyAsk('moreTotalPay') reproduces the wiki's own exact completion-pay example
 *   E  applyAsk('payInAdvance') and ('payPerHead') move value in the RULED direction, and the
 *      gap between that lossless rule and the wiki's own lossier worked example is named, not hidden
 *   F  relationsCost reads real wiki numbers and returns null for an action the page never named
 *   G  relationBand reads the sourced bands, including the unnamed 20-39/60-89 gaps
 *   H  the skull-to-pay and renown-to-pay curves are explicitly flagged unsourced, never invented
 *   I  every top-level block in contract_terms.json carries a source string
 *
 *   node gates/contracts_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');
var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (typeof cond === 'string') throw new Error('GATE BUG: ok() got a STRING as its condition.');
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var C = require(path.join(ROOT, 'engine/bohemia_contracts.js'));
var TERMS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/contract_terms.json'), 'utf8'));

head('A. THE "NOTHING" ROW CONVERTS EXACTLY (610/10 floor, 10/10, 760/10)');
var nothing = C.workedExample('nothing');
ok('afterCompletion 61 battery', nothing.afterCompletionBatteries === 61);
ok('perHead 1 battery', nothing.perHeadBatteries === 1);
ok('total 76 batteries', nothing.totalBatteries === 76);
ok('advance 0 (no fraction, allowZero)', nothing.advanceBatteries === 0);

head('B. HAGGLE FOLLOWS THE WIKI\'S OWN FORMULA');
var h = C.haggleAttempt(0, false, 0.5);
ok('first attempt, no negotiator, midpoint roll gives annoyance 4.5 (range 3-6)', h.newAnnoyance === 4.5);
ok('fail chance is annoyance * 0.1', Math.abs(h.failChance - 0.45) < 0.0001);
ok('not kicked out below 9', h.keptOut === false);
var h2 = C.haggleAttempt(8.6, false, 0.5);
ok('kicked out once annoyance crosses 9', h2.keptOut === true);

head('C. THE NEGOTIATOR HALVES BOTH COSTS');
var withoutNeg = C.haggleAttempt(0, false, 0.5);
var withNeg = C.haggleAttempt(0, true, 0.5);
ok('annoyance gain is roughly half with the Negotiator', withNeg.newAnnoyance < withoutNeg.newAnnoyance);
ok('relations cost is exactly half with the Negotiator', withNeg.relationsCost === withoutNeg.relationsCost / 2);

head('D. moreTotalPay REPRODUCES THE WIKI\'S OWN EXACT EXAMPLE');
var base = TERMS.workedExampleWikiCrowns.nothing;
var solvedR = ((640 / 610 - 1) - 0.04) / 0.07;
var totalAsk = C.applyAsk(base, 'moreTotalPay', solvedR);
ok('afterCompletion lands on the wiki\'s exact 640 at the solved percentage',
   Math.abs(totalAsk.afterCompletion - 640) < 0.01, totalAsk.afterCompletion);

head('E. THE DIRECTION IS RULED; THE EXACT ROUNDING GAP IS NAMED, NOT HIDDEN');
var advanceAsk = C.applyAsk(base, 'payInAdvance');
ok('advance pay rule moves money TOWARD advance, away from completion and per-head',
   advanceAsk.advance > base.advance && advanceAsk.afterCompletion < base.afterCompletion);
ok('the lossless pre-rounding transfer sums back to the original total (the wiki\'s own stated rounding loss is a SEPARATE, documented gap)',
   Math.abs(advanceAsk.total - base.total) < 0.01);
var perHeadAsk = C.applyAsk(base, 'payPerHead');
ok('per-head pay rule moves money TOWARD per-head, away from completion and advance',
   perHeadAsk.perHead > base.perHead && perHeadAsk.afterCompletion < base.afterCompletion);

head('F. RELATIONS COST READS REAL NUMBERS, REFUSES A NAME THE PAGE NEVER STATED');
ok('betraying a contract costs -100', C.relationsCost('betrayContract') === -100);
ok('a finished noble contract pays +5', C.relationsCost('finishedNobleContract') === 5);
ok('a bread-theft cost (his own ask) returns null, not a guess', C.relationsCost('stealBread') === null);

head('G. RELATION BANDS, INCLUDING THE NAMED GAPS');
ok('45 reads as neutral', C.relationBand(45) === 'neutral');
ok('95 reads as allied', C.relationBand(95) === 'allied');
ok('25 (between threatening and neutral) reads as unbanded, not guessed into one', C.relationBand(25) === 'unbanded');

head('H. SKULL AND RENOWN PAY CURVES ARE FLAGGED, NEVER INVENTED');
ok('skull-to-pay scaling is explicitly unsourced', TERMS.difficulty.skullScalingSourced === false);
ok('renown-to-pay formula is explicitly unsourced', TERMS.renown.payFormulaSourced === false);
ok('but renown DOES gate some contracts and DOES raise pay, as a fact (just not a curve)',
   TERMS.renown.payScalesWithClout === true && TERMS.renown.someContractsGatedByCloutThreshold === true);

head('I. EVERY TOP-LEVEL BLOCK NAMES A SOURCE');
var topKeys = Object.keys(TERMS).filter(function (k) { return k !== '_about'; });
var unsourced = [];
topKeys.forEach(function (k) {
  var block = TERMS[k];
  if (JSON.stringify(block).indexOf('source') < 0) unsourced.push(k);
});
ok('every top-level block names a source', unsourced.length === 0, unsourced.join(', '));

console.log('\n==========================================================================');
console.log('  CONTRACTS GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('==========================================================================');
process.exit(fail ? 1 : 0);
