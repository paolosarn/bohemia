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
 *   G  (CAMP 10/26, rule 234: STRUCK DOWN, HE STILL FIGHTS) the days are THE
 *      FRESH WOUND's, never a bench: the fresh table matches condition.json
 *      and injuries.json byte for byte (and the browser's copy matches
 *      Node's); the wound is whole the day he wakes and falls in a straight
 *      line to nothing; the mark is for life; the penalties and the face's
 *      stages; ours.json's row no longer quotes a bench as his words; no
 *      live file holds a man out of a fight for injury days
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
ok('*** and the 10/26 ruling that struck the bench is cited too (rule 234) ***', OURS.struck_down_laid_up_days.source.indexOf('STRUCK_DOWN_HE_STILL_FIGHTS') >= 0);
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

head('G. RULE 234: THE DAYS ARE THE FRESH WOUND\'S, NEVER A BENCH');
(function () {
  var COND = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/condition.json'), 'utf8'));
  var T = COND.struck_down_fresh && COND.struck_down_fresh.value;
  ok('condition.json carries the fresh wound for every one of the eleven marks, and no other', !!T && Object.keys(T).length === realPermanent.length && realPermanent.every(function (r) { return T.hasOwnProperty(r.id); }));
  var bad = [];
  Object.keys(T || {}).forEach(function (k) {
    var w = T[k].wound, mine = L.FRESH[k];
    if (w === null) { if (mine !== null) bad.push(k + ' should have none'); return; }
    var real = INJ.rows.filter(function (r) { return r.id === w; })[0];
    if (!real || real.kind !== 'temporary') { bad.push(k + ': ' + w + ' is not a wiki temporary injury'); return; }
    if (!mine || mine.id !== real.id || mine.name !== real.name || JSON.stringify(mine.effects) !== JSON.stringify(real.effects) || JSON.stringify(mine.effects_text) !== JSON.stringify(real.effects_text)) bad.push(k + ': my copy differs from the wiki row');
    if (JSON.stringify(T[k].effects_text) !== JSON.stringify(real.effects_text)) bad.push(k + ': the table\'s words differ from the wiki row');
  });
  ok('*** every fresh wound is the wiki\'s own temporary row, byte for byte, in the table and in the module ***', bad.length === 0, bad.join('; '));
  var vm = require('vm'), ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'engine/bohemia_long_injury.js'), 'utf8'), ctx);
  var B = ctx.window.BohemiaLongInjury;
  ok('the browser\'s inlined copy (marks with their effects, the fresh table) is the Node copy, byte for byte',
    JSON.stringify(B.FRESH) === JSON.stringify(L.FRESH) && JSON.stringify(B.PERMANENT_MARKS.map(function (m) { return [m.id, m.name, m.effects, m.effects_text, m.flavor]; }))
      === JSON.stringify(L.PERMANENT_MARKS.map(function (m) { return [m.id, m.name, m.effects, m.effects_text, m.flavor]; })));
  ok('the share the day he wakes is condition.json\'s', L.FRESH_FULL_SHARE === COND.struck_down_fresh_full_share.value);
  var w0 = L.freshNow('missing_eye', 34, 34), wh = L.freshNow('missing_eye', 17, 34), wz = L.freshNow('missing_eye', 0, 34), eye = L.FRESH.missing_eye;
  ok('*** the day he wakes the fresh wound is the wiki row\'s whole penalty ***', !!w0 && JSON.stringify(w0.effects) === JSON.stringify(eye.effects), JSON.stringify(w0 && w0.effects));
  ok('*** halfway it is half (a straight line), and on the last day nothing ***', !!wh && wh.effects.ranged_skill_pct === -25 && wh.effects.vision === -1 && wz === null, JSON.stringify(wh && wh.effects));
  ok('a mark the wiki gives no flesh wound (Traumatized) has no fresh part, only the mark', L.freshNow('traumatized', 30, 30) === null);
  var pen = L.penalties(['missing_eye'], { mark: 'missing_eye', left: 34, of: 34 });
  ok('the penalties list both parts: the mark for life and the wound today, each the wiki\'s key', pen.some(function (p) { return p.from === 'mark' && p.stat === 'ranged_skill' && p.value === -50; })
    && pen.some(function (p) { return p.from === 'fresh' && p.stat === 'ranged_skill' && p.value === -50; }) && pen.some(function (p) { return p.stat === 'vision' && p.unit === ''; }));
  var lk = [34, 20, 5, 0].map(function (left) { return L.look(['missing_eye'], left ? { mark: 'missing_eye', left: left, of: 34 } : null).fresh; });
  ok('the face\'s stages: blood while more than half is left, the band-aid until it closes, then the mark alone', JSON.stringify(lk) === JSON.stringify(['blood', 'blood', 'bandage', null]), JSON.stringify(lk));
  ok('*** ours.json no longer quotes the bench as his words ***', !/takes them out of fights/i.test(OURS.struck_down_laid_up_days.quote || '') && /out of fights/.test(OURS.struck_down_laid_up_days.was || '')
    && OURS.struck_down_injury.value.lasts === 'life', OURS.struck_down_laid_up_days.quote);
  /* NOBODY HELD OUT: the live files that once benched a struck-down man for his days */
  var live = ['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html', 'slices/bohemia_job_kinds.js', 'slices/BOHEMIA_ROSTER_SCREEN.html'];
  var held = [];
  live.forEach(function (f) {
    var t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    if (/today\s*<\s*\(f\.day\s*\|\s*0\)\s*\+\s*\(r\.laidUpDays/.test(t)) held.push(f + ': a row held out until its day');
    if (/b\.until\s*!=\s*null\s*&&\s*today\s*<\s*\(b\.until/.test(t) || /today\s*>=\s*\(b\.until/.test(t)) held.push(f + ': the bench waits for its day');
  });
  ok('*** no live file holds a struck-down man out of a fight for his days (the door, the job sizing, the crew screen) ***', held.length === 0, held.join('; ') || 'none');
})();

console.log('\n' + (fail ? 'THE LONG INJURY GATE: ' + fail + ' FAILED, ' + pass + ' ok'
  : 'THE LONG INJURY GATE: ' + pass + ' ok, 0 failed'));
process.exit(fail ? 1 : 0);
