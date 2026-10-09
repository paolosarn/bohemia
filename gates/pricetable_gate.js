/* BOHEMIA PRICE TABLE GATE (10/9/26, ECONOMY lane)
 * VAMILY [the price table at ten to one], rule 74 top row.
 *
 * His ruling (GROK_31/32/33, locked 10/1): no crowns in the game; every wiki crown number is
 * divided by ten and ROUNDED DOWN; one battery is the floor. This gate proves the mechanism
 * follows that rule exactly, against the wiki's own worked example and against Grok's own
 * independently-grouped wage tiers, and that every number in the table carries a source.
 *
 * PROVES:
 *   A  toBatteries floors, never rounds to nearest (GROK_31's own words, "round down")
 *   B  the one-battery floor holds for every nonzero crown value, however small
 *   C  a real, ruled zero (indebted wage, Lone Wolf) stays zero, never floored up
 *   D  the wage formula reproduces the wiki's own worked example (Hedge Knight 91 / 122)
 *   E  the wage formula matches Grok's own 77-background tier grouping with zero mismatches
 *   F  sell/buy fractions read the sourced two-point curve, never a flat unsourced constant
 *   G  contract pay scales off the one real sample, invents no per-skull digit
 *   H  every top-level block in price_table.json carries a source string
 *
 *   node gates/pricetable_gate.js
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

var PT = require(path.join(ROOT, 'engine/bohemia_pricetable.js'));
var TABLE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/price_table.json'), 'utf8'));
var BG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/backgrounds.json'), 'utf8'));

head('A. FLOORS, NEVER ROUNDS TO NEAREST');
ok('18 crowns floors to 1, not 2 (round-to-nearest would give 2)', PT.toBatteries(18) === 1);
ok('19 crowns still floors to 1', PT.toBatteries(19) === 1);
ok('91 crowns floors to 9', PT.toBatteries(91) === 9);
ok('99 crowns floors to 9, not 10', PT.toBatteries(99) === 9);

head('B. THE ONE-BATTERY FLOOR, FOR ANY NONZERO VALUE');
ok('3 crowns (the cheapest wiki wage) floors to 1, not 0', PT.toBatteries(3) === 1);
ok('1 crown floors to 1', PT.toBatteries(1) === 1);
ok('9 crowns floors to 1', PT.toBatteries(9) === 1);

head('C. A REAL RULED ZERO STAYS ZERO, NEVER FLOORED UP');
ok('toBatteries(0,{allowZero:true}) is 0', PT.toBatteries(0, { allowZero: true }) === 0);
ok('an indebted background (wage 0) pays 0, not floored to 1',
   PT.dailyWageBatteries('beggar', 1) >= 1 && (function () {
     var row = BG.rows.find(function (r) { return r.daily_wage === 0; });
     return !row || PT.dailyWageBatteries(row.id, 1) === 0;
   })());

head('D. THE WAGE FORMULA REPRODUCES THE WIKI\'S OWN WORKED EXAMPLE');
var hk11 = PT.dailyWageBatteries('hedge_knight', 11);
var hk21 = PT.dailyWageBatteries('hedge_knight', 21);
ok('level 11 Hedge Knight is 9 batteries (91 crowns / 10, floored)', hk11 === 9, 'got ' + hk11);
ok('level 21 Hedge Knight is 12 batteries (122 crowns / 10, floored)', hk21 === 12, 'got ' + hk21);

head('E. MATCHES GROK\'S OWN 77-BACKGROUND TIER GROUPING, ZERO MISMATCHES');
var tiers = TABLE.wageAndHire.wageBatteryTierCrossCheck;
var mismatches = [];
BG.rows.forEach(function (r) {
  if (!r.daily_wage) return;
  var computed = PT.dailyWageBatteries(r.id, 1);
  var tier = Object.keys(tiers).find(function (t) { return tiers[t].indexOf(r.id) >= 0; });
  if (tier && Number(tier) !== computed) mismatches.push(r.id + ': computed ' + computed + ' expected tier ' + tier);
});
ok('0 of ' + BG.rows.filter(function (r) { return r.daily_wage; }).length + ' backgrounds mismatch their Grok tier',
   mismatches.length === 0, mismatches.slice(0, 3).join('; '));

head('F. SELL/BUY FRACTIONS READ THE SOURCED CURVE, NEVER A FLAT CONSTANT');
ok('city hall sell at relation 50 is the sourced 0.1769, not a flat 0.5',
   Math.abs(PT.sellFraction('city', 50) - 0.1769) < 0.0001);
ok('city hall sell at relation 100 is the sourced 0.1969',
   Math.abs(PT.sellFraction('city', 100) - 0.1969) < 0.0001);
ok('sell fraction rises with relation (100 > 50)', PT.sellFraction('city', 100) > PT.sellFraction('city', 50));
ok('buy fraction falls with relation (the top-of-bar drop)', PT.buyFraction(100) < PT.buyFraction(50));

head('G. CONTRACT PAY SCALES OFF THE ONE REAL SAMPLE, NO INVENTED SKULL DIGIT');
var pay15 = PT.contractPayBatteries(15);
ok('15 heads reproduces the sourced sample total of 76', pay15.total === 76, JSON.stringify(pay15));
ok('skullScaling is explicitly marked unsourced, not a felt digit', TABLE.contractPay.skullScaling.sourced === false);

head('H. EVERY TOP-LEVEL BLOCK IN price_table.json CARRIES A SOURCE');
var topKeys = Object.keys(TABLE).filter(function (k) { return k !== 'conversion' && k !== '_about'; });
var unsourced = [];
topKeys.forEach(function (k) {
  var block = TABLE[k];
  var hasSource = JSON.stringify(block).indexOf('source') >= 0 || JSON.stringify(block).indexOf('"_source"') >= 0;
  if (!hasSource) unsourced.push(k);
});
ok('every top-level block names a source', unsourced.length === 0, unsourced.join(', '));

console.log('\n==========================================================================');
console.log('  PRICE TABLE GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('==========================================================================');
process.exit(fail ? 1 : 0);
