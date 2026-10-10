/* BOHEMIA THE LONG INJURY GATE (10/9/26, PEOPLE lane).
 * VAMILY [the long injury], row THIRTY-TO-FORTY-DAYS-LAID-UP.
 *
 * engine/bohemia_long_injury.js is a pure module: given a man struck down in
 * a fight who lived, what is true about him -- 30 to 40 days laid up and a
 * permanent mark, Paolo's own locked words (laws/BOHEMIA_LAW_THE_FIGHT_GETS_
 * DEEP_TUNING_AND_MODS_9_27_26.md). Every number and every word is read off
 * the real files it actually lives in, never retyped from memory:
 *   - the 30-40 day range against records/target/bb/ours.json's own
 *     struck_down_laid_up_days (cited there to the same law)
 *   - the eleven permanent marks, their pain line and their body-part
 *     penalty against records/target/bb/injuries.json's own real rows
 *
 * PROVES:
 *   A  the day range matches the real sourced table, byte for byte
 *   B  all eleven real permanent marks are reachable, nothing invented,
 *      nothing from the temporary list leaking in
 *   C  generation is deterministic: same key, same man, every time
 *   D  the pain line and the body-part penalty are the mark's own real
 *      flavor and effects_text, never reworded
 *   E  healDay() counts down, floors at zero, and the mark never clears --
 *      "laid up" ends, "marked" does not
 *   F  cook + registry
 *
 *   node gates/long_injury_gate.js
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

var L = require(path.join(ROOT, 'engine/bohemia_long_injury.js'));
var OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
var INJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/injuries.json'), 'utf8'));

head('A. THE DAY RANGE MATCHES THE REAL SOURCED TABLE, BYTE FOR BYTE');
ok('ours.json has a real struck_down_laid_up_days to read', Array.isArray(OURS.struck_down_laid_up_days && OURS.struck_down_laid_up_days.value));
ok('*** LAID_UP_DAYS_MIN matches it exactly ***', L.LAID_UP_DAYS_MIN === OURS.struck_down_laid_up_days.value[0]);
ok('*** LAID_UP_DAYS_MAX matches it exactly ***', L.LAID_UP_DAYS_MAX === OURS.struck_down_laid_up_days.value[1]);
ok('the real law is actually cited on that row (not asserted)', OURS.struck_down_laid_up_days.source.indexOf('BOHEMIA_LAW_THE_FIGHT_GETS_DEEP') >= 0);
(function () {
  var N = 4000, out = 0;
  for (var i = 0; i < N; i++) {
    var d = L.rollDays('range-check:' + i);
    if (d < L.LAID_UP_DAYS_MIN || d > L.LAID_UP_DAYS_MAX) out++;
  }
  ok('*** ' + N + ' rolls, ZERO land outside 30 to 40 ***', out === 0, out + ' out of range');
})();

head('B. ALL ELEVEN REAL PERMANENT MARKS ARE REACHABLE, NOTHING INVENTED, NOTHING TEMPORARY LEAKS IN');
var realPermanent = INJ.rows.filter(function (r) { return r.kind === 'permanent'; });
ok('the real file has exactly the permanent rows this module loaded', L.PERMANENT_MARKS.length === realPermanent.length, L.PERMANENT_MARKS.length + ' vs ' + realPermanent.length);
ok('*** every one of my marks exists in the real file by id, name, flavor and effects_text, byte for byte ***', L.PERMANENT_MARKS.every(function (m) {
  var real = realPermanent.filter(function (r) { return r.id === m.id; })[0];
  return !!real && real.name === m.name && real.flavor === m.flavor && JSON.stringify(real.effects_text) === JSON.stringify(m.effects_text);
}));
ok('no temporary injury (short heal_days, no permanent mark) is reachable from this module', L.PERMANENT_MARKS.every(function (m) { return !INJ.rows.some(function (r) { return r.kind === 'temporary' && r.id === m.id; }); }));
(function () {
  var seen = {};
  for (var i = 0; i < 3000; i++) seen[L.rollMarkId('which-mark:' + i)] = 1;
  ok('every one of the eleven real marks is actually rolled somewhere in a large sample', Object.keys(seen).length === L.PERMANENT_MARKS.length, Object.keys(seen).length + ' of ' + L.PERMANENT_MARKS.length);
})();
ok('an unknown mark id is refused, never a guessed default', L.byId('made_up_injury') === null);

head('C. GENERATION IS DETERMINISTIC: SAME KEY, SAME MAN, EVERY TIME');
ok('the same key rolls the identical fact every time', JSON.stringify(L.injuryFact('det:1')) === JSON.stringify(L.injuryFact('det:1')));
ok('a different key rolls a different fact', JSON.stringify(L.injuryFact('det:1')) !== JSON.stringify(L.injuryFact('det:2')));

head('D. THE PAIN LINE AND THE BODY-PART PENALTY ARE THE MARK’S OWN REAL WORDS, NEVER REWORDED');
L.PERMANENT_MARKS.forEach(function (m) {
  var real = realPermanent.filter(function (r) { return r.id === m.id; })[0];
  ok(m.id + ': the pain line is the real flavor’s own first sentence, not a rewrite',
    real.flavor.indexOf(L.painLine(m.id).replace(/\.$/, '')) === 0, L.painLine(m.id));
  ok(m.id + ': the body-part penalty is the real effects_text, joined, nothing added',
    L.bodyPartPenalty(m.id) === real.effects_text.join(', '));
});

head('E. HEALDAY() COUNTS DOWN, FLOORS AT ZERO, AND THE MARK NEVER CLEARS');
(function () {
  var f = L.injuryFact('heal-walk');
  var start = f.days, startMark = f.markName;
  var steps = 0;
  for (var i = 0; i < start; i++) { var before = f.days; f = L.healDay(f); if (f.days !== before - 1) { steps = -1; break; } steps++; }
  ok('counts down by exactly one real day at a time, all the way to zero', steps === start, 'started ' + start + ', took ' + steps);
  ok('the mark is still there at zero days laid up ("marked" does not clear)', f.markName === startMark && !!f.painLine && !!f.bodyPartPenalty);
  var past = L.healDay(f);
  ok('healing past zero never goes negative', past.days === 0);
  ok('healing a null fact refuses cleanly rather than throwing', L.healDay(null) === null);
})();

head('F. COOK + REGISTRY');
var REG = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
var item = REG.items.filter(function (x) { return x.id === 'people-the-long-injury-10-9'; })[0];
ok('the cook is registered in VOTE', !!item);
if (item) {
  ok('it names the lane', item.lane === 'people');
  ok('it points at a real cook file', typeof item.show === 'object'
    && fs.existsSync(path.join(ROOT, 'slices', item.show.src)));
}
ok('the record exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_THE_LONG_INJURY_10_9_26.txt')));
ok('the review file for COMBAT and RUN TWO exists', fs.existsSync(path.join(ROOT, 'records/BOHEMIA_THE_LONG_INJURY_REVIEW_FOR_COMBAT_10_9_26.md')));

console.log('\n' + (fail ? 'THE LONG INJURY GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE LONG INJURY GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
