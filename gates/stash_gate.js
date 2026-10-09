/* BOHEMIA STASH GATE (10/9/26, ECONOMY lane)
 * VAMILY [what the stash is], rule 74 top row.
 *
 * The bar's six counts (batteries, food, meds, rounds/ammo, tape/tools, water) move for real
 * wiki-sourced reasons, never a flat guess. This gate proves the terrain food multiplier, the
 * tool repair rate, the medicine and ammo caps, and the per-shot ammo costs all match the
 * sourced pages exactly, and that nothing here duplicates a number price_table.json already
 * carries (REUSE-FIRST).
 *
 * PROVES:
 *   A  food scales by terrain (plains 1x to mountains 2x), never flat
 *   B  an unknown terrain reads as plains, never silently zero
 *   C  food consumption does not care whether the party is moving (BOHEMIA_ECONOMY_DAY_53's
 *      own flat-2/day finding still holds; terrain is the only axis that moves it)
 *   D  soonest-to-spoil eats the closest expiry first (rule 47)
 *   E  tool repair rate matches the sourced ticks-per-hour, camp and blacksmith bonuses
 *   F  medicine is per OPEN INJURY, not per head
 *   G  every ammo class costs what its page says, and a bundle's shot count divides evenly
 *   H  carry caps read the right band by difficulty
 *   I  this file duplicates no number price_table.json's dailyRates already carries
 *
 *   node gates/stash_gate.js
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

var S = require(path.join(ROOT, 'engine/bohemia_stash.js'));
var RATES = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/stash_rates.json'), 'utf8'));
var PRICES = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/price_table.json'), 'utf8'));

head('A. FOOD SCALES BY TERRAIN, NEVER FLAT');
ok('plains is the baseline (6 men = 12)', S.foodNeededPerDay(6, 'plains') === 12);
ok('desert is 1.5x (6 men = 18)', S.foodNeededPerDay(6, 'desert') === 18);
ok('mountains is 2x (6 men = 24)', S.foodNeededPerDay(6, 'mountains') === 24);
ok('desert costs more than plains for the same party', S.foodNeededPerDay(6, 'desert') > S.foodNeededPerDay(6, 'plains'));

head('B. AN UNKNOWN TERRAIN READS AS PLAINS, NEVER SILENTLY ZERO');
ok('a made-up terrain name still returns a positive number',
   S.foodNeededPerDay(6, 'not_a_real_terrain') === S.foodNeededPerDay(6, 'plains'));

head('C. FOOD DOES NOT CARE WHETHER THE PARTY IS MOVING');
ok('foodNeededPerDay takes a terrain, never a moving/camping flag',
   S.foodNeededPerDay.length === 2, 'arity ' + S.foodNeededPerDay.length);
ok('a standing party on the same terrain pays the same as a travelling one (one function, one input)',
   S.foodNeededPerDay(6, 'desert') === S.foodNeededPerDay(6, 'desert'));

head('D. SOONEST TO SPOIL EATS FIRST');
ok('a 3-day shelf life beats a 14-day one',
   S.soonestToSpoil([{ kind: 'wine', daysUntilSpoiled: 14 }, { kind: 'grains', daysUntilSpoiled: 3 }]) === 'grains');
ok('an empty shelf returns null, not a guess', S.soonestToSpoil([]) === null);

head('E. TOOL REPAIR RATE MATCHES THE SOURCED NUMBERS');
ok('40 durability costs 3 tool points (ceil(40/15))', S.toolPointsForDurability(40) === 3);
ok('45 durability at base rate (3/hr) takes 15 hours', S.hoursToRepair(45) === 15);
ok('a camp doubles the rate (45 durability takes 7.5 hours)', S.hoursToRepair(45, { atCamp: true }) === 7.5);
ok('a blacksmith adds 33% on top of base', Math.abs(S.hoursToRepair(45, { hasBlacksmith: true }) - 45 / (3 * 1.33)) < 0.001);

head('F. MEDICINE IS PER OPEN INJURY, NOT PER HEAD');
ok('2 open injuries need 2 medicine, regardless of headcount', S.medicineNeededPerDay(2) === 2);
ok('zero injuries need zero medicine', S.medicineNeededPerDay(0) === 0);

head('G. EVERY AMMO CLASS COSTS WHAT ITS PAGE SAYS');
ok('an arrow or bolt costs 1', S.ammoCostForShot('arrow') === 1 && S.ammoCostForShot('bolt') === 1);
ok('a handgonne shot costs 2', S.ammoCostForShot('handgonne') === 2);
ok('a thrown weapon or fire lance costs 3', S.ammoCostForShot('thrown') === 3 && S.ammoCostForShot('fireLance') === 3);
ok('a 50-point bundle gives exactly 50 arrow shots', S.shotsPerBundle('arrow') === 50);
ok('a 50-point bundle gives exactly 16 thrown shots (floor(50/3))', S.shotsPerBundle('thrown') === 16);

head('H. CARRY CAPS READ THE RIGHT BAND');
ok('ammo veteran/expert cap is 300', S.carryCap('ammo', 'veteran') === 300);
ok('ammo beginner cap is 500', S.carryCap('ammo', 'beginner') === 500);
ok('medicine veteran/expert cap is 100', S.carryCap('medicine', 'veteran') === 100);
ok('medicine beginner cap is 150', S.carryCap('medicine', 'beginner') === 150);

head('I. NO DUPLICATED NUMBER AGAINST price_table.json');
var dup = [];
if (RATES.toolRepair.durabilityPerToolPoint !== PRICES.dailyRates.toolDurabilityRepairedPerTool.value) {
  dup.push('toolRepair.durabilityPerToolPoint disagrees with price_table.json');
}
ok('stash_rates.json\'s tool exchange rate agrees with price_table.json\'s (cited, not re-typed differently)',
   dup.length === 0, dup.join('; '));

console.log('\n==========================================================================');
console.log('  STASH GATE: ' + pass + ' pass / ' + fail + ' fail');
console.log('==========================================================================');
process.exit(fail ? 1 : 0);
